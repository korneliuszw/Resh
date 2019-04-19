


//Import all requried libraries 
const discord = require('discord.js')
const stream = require('ytdl-core')
const youtube = require('simple-youtube-api')
require('dotenv').config()
const ytapi = new youtube(String(process.env.YT_TOKEN))

//Music queue
var queue = new Map()

// Function for play command
const play = async function (msg, song) {
    try {
        //Check check for voice channel and permissions to join and speak
        const voiceChannel = msg.member.voiceChannel
        if (!voiceChannel) return msg.reply("Hey dude, it's not like I don't want to play music for you, but you have just not connected to voice channel")
        const perms = voiceChannel.permissionsFor(msg.client.user)
        if (perms.has('CONNECT') && perms.has('SPEAK')) {
            //Find song provided as arg
            const songplaying = await find(song)
            //Check for existing play queue
            if (!queue.get(msg.guild)) {
                //Create new queue
                await createQueue(msg.channel, voiceChannel, msg.guild, 4).catch(e => { throw new Error(e) })
                //Get queue and add current song to it
                que = queue.get(msg.guild)
                que.songs.push(songplaying.link)
            }
            else {
                //If queue exists, add requested song to it
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
            q.text.send('No songs left in quueue - leaving channel')
            return q.connection.disconnect()
        }
        //If music is already playing - return message to sender
        if (q.status === 'playing') {
            q.text.send('Added to queue!')
        }
        else {
            console.log('hey,there')
            //Start voice channel connection
            connection = await q.voice.join()
            q.connection = connection //Add connection to the queue nap
            q.text.send('Playing: ' + q.songs[0]) //Send ongoing song to the text channel
            q.status = 'playing' //Change status 
            const dispatcher = connection.playStream(stream(q.songs[0]) //Init playstream from first link provided in queue
                .on('end', why => { //On end of song

                    //TODO: Fix
                    console.log(why)
                    if (why === 'Stream is not generating quickly enough.') { q.text.send('Song ended') }
                    else if (why === 'Stopped') { q.status = 'stop'; return q.text.send('Stopped') }
                    else if (why === 'skipping') { return q.text.send('Skipping') }
                    else console.log(why)
                    q.status = 'skipping'
                    //Delete finished song from queue and play queue again
                    q.songs.shift()
                    playSongs(guild)
                }))
        }
    }
    catch (e) {
        console.log(e)
    }
}

//Song finding method
async function find(song) {
    console.log(song)
    regex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm //regex for checking is arg url
    if (new RegExp(regex).test(song.trim())) { //If arg is url - add it to the queue
        console.log('song is an url')
        return {
            title: '',
            link: song
        }
    }
    //If arg is not url - search for video with provided name and then return link.
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
    //Skip currently playing song
    q = queue.get(msg.guild)
    q.songs.shift() //Delete first (playing) song from queue
    q.status = 'skipping'
    if (!q.songs || q.songs.length == 0) { //If queue is empty - leave channel
        q.connection.disconnect()
        delete queue
    }
    else { //Else - end current playing song and start new
        q.connection.dispatcher.end('skipping')
        playSongs(msg.guild)
    }

}


async function quit(msg) {
    //Quit channel
    queue.get(msg.guild).connection.disconnect()
    queue.delete(msg.guild) //Remove server from queue
}


module.exports = {
    play: play,
    quit: quit,
    skip: skip
}