const Discord = require('discord.js')
const commands = require('./models/commands')
const bot = new Discord.Client()
const youtube = require('./commands/youtube')
require('dotenv').config()

//Get bot token from enviroment variable
bot.login(String(process.env.BOT_TOKEN)).catch((error) => console.log(error))


bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag}`)
})
console.log(typeof (bot))

bot.on('message', async msg => {
    msg_command = String(msg).split(' ', 1)[0]
    var comms = commands.commands() //Get commands as objects
    var commsK = Object.keys(comms) //Commands
    if (commsK.includes(msg_command)) { //If message sent starts with name of command 
        msg_args = String(msg).replace(msg_command, '') //Get arguments (text after command)
        if (comms[msg_command].section === 'youtube') { //If section is equal to youtube, go to it's parser
            section = comms[msg_command].subsection
            youtube(msg_command, msg, msg_args, section)
        }
    }
})