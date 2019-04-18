const discord = require('discord.js')
const stream = require('ytdl-core')
const youtube = require('simple-youtube-api')
const ytapi = new youtube(String(process.env.YT_TOKEN))

var queue = new Map()


const play = async function (msg, song) {
    try {
        const voiceChannel = msg.member.voiceChannel
        if (!voiceChannel) return msg.reply("Hey dude, it's not like I don't want to play music for you, but you have just not connected to voice channel")
        const perms = voiceChannel.permissionsFor(msg.client.user)
        if (perms.has('CONNECT') && perms.has('SPEAK')) {
            const songplaying = await find(song)
            if (!queue.get(msg.guild)) {
                await createQueue(msg.channel, voiceChannel, msg.guild, 4).catch(e => { throw new Error(e) })
                que = queue.get(msg.guild)
                que.songs.push(songplaying.link)
            }
            else {
                insertIntoQueue(songplaying.link, msg.guild).catch(e => { throw new Error(e) })
            }
            playSongs(msg.guild)
        }
        else {
            return msg.reply('I need more permissions to play music for you')
        }
    }
    catch (e) {
        console.log(e)
    }

}

async function createQueue(text, voiceChannel, guild, sound = 3) {
    const queueStructure = {
        text: text,
        voice: voiceChannel,
        connection: '',
        songs: new Array(),
        sound: sound,
        status: ''
    }
    queue.set(guild, queueStructure)
}

async function insertIntoQueue(songURL, guild) {
    q = queue.get(guild)
    q.songs.push(songURL)
}


async function playSongs(guild) {
    try {
        q = queue.get(guild)
        if (q.status === 'playing') {
            q.text.send('Added to queue!')
        }
        else {
            console.log('hey,there')
            connection = await q.voice.join()
            q.connection = connection
            q.text.send('Playing: ' + q.songs[0])
            q.status = 'playing'
            const dispatcher = connection.playStream(stream(q.songs[0])
                .on('end', why => {
                    if (why === 'Stream is not generating quickly enough.') { q.text.send('Song ended') }
                    else if (why === 'Stopped') { q.status = 'stop'; return q.text.send('Stopped') }
                    else if (why === 'skipping') { return q.text.send('Skipping') }
                    else console.log(why)
                    q.songs.shift()
                    playSongs(guild)
                }))
        }
    }
    catch (e) {
        console.log(e)
    }
}
async function find(song) {
    const aw = await ytapi.searchVideos(song, 1).then((res) => {
        console.log(res[0].id)
        return {
            title: res[0].title,
            link: 'https://www.youtube.com/watch?v=' + res[0].id
        }
    }).catch(e => console.log(e))
    return aw

}

async function skip(msg) {
    q = queue.get(msg.guild)
    q.songs.shift()
    q.status = 'skipping'
    console.log(q.songs)
    if (!q.songs || q.songs.length == 0) {
        q.connection.disconnect()
        delete queue
    }
    else {
        q.connection.dispatcher.end('skipping')
        playSongs(msg.guild)
    }

}


async function quit(msg) {
    q = queue.get(msg.guild)
    q.connection.disconnect()
    q.status = ''
}


module.exports = {
    play: play,
    quit: quit,
    skip: skip
}