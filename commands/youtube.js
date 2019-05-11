
//Import all requried libraries.
const stream = require('ytdl-core')
const youtube = require('simple-youtube-api')
require('dotenv').config()
const ytapi = new youtube(String(process.env.YT_TOKEN))

//Music queue
var queue = new Map()

const clearQueue = (guild) => { //Clear server's music queue
    q = queue.get(guild)
    if (q.dispatcher) {
        q.dispatcher.end() //If dispatcher is avaible - end it
    }
    if (q.connection) {
        q.connection.disconnect() //If connected - disconnect
    }
    queue.delete(guild)
}
// Function for play command
const play = async function (msg, song) {
    try {
        //Check check for voice channel and permissions to join and speak
        const voiceChannel = msg.member.voiceChannel
        if (!voiceChannel) return msg.reply("Hey dude, it's not like I don't want to play music for you, but you are just not connected to voice channel")
        const perms = voiceChannel.permissionsFor(msg.client.user)
        if (perms.has('CONNECT') && perms.has('SPEAK') && (!voiceChannel.full || perms.has('ADMINISTRATOR') || perms.has('MOVE_MEMBERS'))) {
            //Find song provided as arg
            if (!song) {
                return msg.reply("You need to provide your song's name/url")
            }
            const songplaying = await find(song, msg)
            //Check for existing play queue
            if (!queue.get(msg.guild.id)) {
                //Create new queue
                await createQueue(msg.channel, voiceChannel, msg.guild.id, 4).catch(e => { throw new Error(e) })
                //Get queue and add current song to it
                que = queue.get(msg.guild.id)
                que.songs.push(songplaying.link)
            }
            else {
                //If queue exists, add requested song to it
                insertIntoQueue(songplaying.link, msg.guild.id).catch(e => { throw new Error(e) })
            }
            playSongs(msg.guild.id)
        }
        else {
            if (voiceChannel.full) {
                return msg.reply('Your channel is full')
            }
            return msg.reply('I need more permissions to play music for you')
        }
    }
    catch (e) {
        console.log(e)
    }

}

async function createQueue(text, voiceChannel, guild, sound = 3) {
    //Create new queue
    const queueStructure = {
        text: text, //Text channel
        voice: voiceChannel, //Voice channe;
        connection: '', //Connection with voice chat 
        songs: new Array(), //Songs in queue
        sound: sound, //Volume
        status: '' //Status of music 
    }
    //Set queue with guild(server id)
    queue.set(guild, queueStructure)
}

async function insertIntoQueue(songURL, guild) {
    q = queue.get(guild)
    q.songs.push(songURL)
}


async function playSongs(guild) {
    try {
        q = queue.get(guild)
        //If no songs in queue - exit channel
        if (q.songs.length <= 0) {
            q.text.send('No songs left in queue - leaving channel')
            return q.connection.disconnect()
        }
        //If music is already playing - return message to sender
        if (q.status === 'playing') {
            q.text.send('Added to queue!')
        }
        else {
            //Start voice channel connection
            q.connection = await q.voice.join() //Add connection to the queue nap
            console.log(q.songs[0])
            q.text.send('Playing: ' + q.songs[0]) //Send ongoing song to the text channel
            q.status = 'playing' //Change status 
            q.dispatcher = q.connection.playStream(stream(q.songs[0], {
                quality: 'highestaudio',
                filter: 'audioonly'
            }) //Init playstream from first link provided in queue
                .on('end', () => {
                    console.log('test')
                    if (q.status = 'stop') {

                    }
                    q.status = 'skipping'
                    //Delete finished song from queue and play queue again
                    q.songs.shift()
                    playSongs(guild)
                }), { bitrate: 'auto' })
        }
    }
    catch (e) {
        clearQueue(guild)
        console.log(e)
    }
}

//Song finding method
async function find(song, msg = undefined, searchOnly = false) {
    regex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm //regex for checking is arg url
    if (new RegExp(regex).test(song.trim())) { //If arg is url - add it to the queue
        if (searchOnly && msg) msg.reply('Looks like you already have your video, so why do you want me to find it?')
        return {
            title: '',
            link: song
        }
    }
    //If arg is not url - search for video with provided name and then return link.
    const aw = await ytapi.searchVideos(song, 1).then((res) => {
        return {
            title: res[0].title,
            link: 'https://www.youtube.com/watch?v=' + res[0].id
        }
    }).catch(e => { console.log(e); clearQueue(msg.guild) })
    if (searchOnly && msg) return msg.reply('Title: ' + aw.title + '\n Link: ' + aw.link) //For use in *find command, searchOnly defines is method called from command (true) or play (false)
    return aw

}

async function skip(msg) {
    //Skip currently playing song
    q = queue.get(msg.guild.id)
    q.songs.shift() //Delete first (playing) song from queue
    q.status = 'skipping'
    if (!q) { return msg.reply('Bot is not playing') }
    if (!q.songs || q.songs.length == 0) { //If queue is empty - leave channel
        clearQueue(msg.guild.id)
    }
    else { //Else - end current playing song and start new
        q.connection.dispatcher.end('skipping')
        playSongs(msg.guild.id)
    }

}


async function quit(msg) {
    //Quit channel
    clearQueue(msg.guild.id)
}


module.exports = {
    play: play,
    quit: quit,
    skip: skip,
    find: find,
    clearQueue
}