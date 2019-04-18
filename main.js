const Discord = require('discord.js')
const commands = require('./models/commands')
const bot = new Discord.Client()
const swears = ['kurwa', 'wypierdalaj', 'huj', 'spierdalaj', 'siema']

const youtube = require('./commands/youtube')

bot.login(String(process.env.BOT_TOKEN)).catch((error) => console.log(error))


bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag}`)
})
console.log(typeof (bot))

bot.on('message', async msg => {
    if (swears.includes(msg.content)) {
        if (msg.member.user.discriminator === '0788') {
            msg.channel.send('Kisielek uspokoj sie')
        }
        else {
            msg.channel.send('No swearing on this christan channel, please')
        }
    }
    else {
        msg_command = String(msg).split(' ', 1)[0]
        var comms = commands.commands()
        var commsK = Object.keys(comms)
        if (commsK.includes(msg_command)) {
            // if (msg_command === '*help') {

            // }
            msg_args = String(msg).replace(msg_command, '')
            if (comms[msg_command].section === 'youtube') {
                section = comms[msg_command].subsection
                youtube(msg_command, msg, msg_args, section)
            }
        }
    }
})