const Discord = require('discord.js')
const commands = require('./models/commands')
const bot = new Discord.Client()
require('dotenv').config()

//Get bot token from enviroment variable
bot.login(String(process.env.BOT_TOKEN)).catch((error) => console.log(error))


bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag}`)
})

bot.on('message', async msg => {
    msg_command = String(msg).split(' ', 1)[0]
    var comms = commands  //Get commands as objects
    var commsK = Object.keys(comms) //Commands
    if (commsK.includes(msg_command)) { //If message sent starts with name of command 
        msg_args = String(msg).replace(msg_command, '')
        comms[msg_command].func(msg, msg_args)

    }
})