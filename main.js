const Discord = require('discord.js')
const commands = require('./models/commands')
var watcher = require('./watch/channel')
const bot = new Discord.Client()
require('dotenv').config()
//Get bot token from enviroment variable
bot.login(String(process.env.BOT_TOKEN)).catch((error) => console.log(error))
bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag}`)
    bot.user.setActivity('*help', {
        type: 'WATCHING'
    })
    watcher = new watcher()
})
bot.on('voiceStateUpdate', (old, ne) => {
    //When voice channel is empty - exit it and destroy currently queue
    connection = bot.voiceConnections.find(val => val.channel == old.voiceChannel)
    if (!connection) { }
    else {
        if (connection.channel.members.size <= 1) {
            require('./commands/youtube').clearQueue(old.guild.id)

        }
        //TODO: Watchers 
        // watcher.watchers.forEach((serv) => {
        //     if (ne.voiceChannel && ne.guild) {
        //         if (ne.guild.id == serv.guild && ne.voiceChannel.id == serv.channelId) {
        //             bot.voice.joinChannel(ne.voiceChannel)
        //         }
        //     }
        //     else {
        //         return
        //     }
        // })
    }
})

bot.on('message', async msg => {
    msg_command = String(msg).split(' ', 1)[0]
    var comms = commands  //Get commands as objects
    var commsK = Object.keys(comms) //Commands
    require('./commands/setup').config(msg.guild.id)
    if (commsK.includes(msg_command)) { //If message sent starts with name of command
        msg_args = String(msg).replace(msg_command, '')
        comms[msg_command].func(msg, msg_args)
    }
})

module.exports = {
    watcher: watcher
}