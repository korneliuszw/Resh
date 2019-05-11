const fs = require('fs')
const Discord = require('discord.js')

const setup = async (msg) => {
    let info = {

    }
    let voteEmotes = ["\u0030\u20E3", "\u0031\u20E3", "\u0032\u20E3", "\u0033\u20E3", "\u0034\u20E3", "\u0035\u20E3", "\u0036\u20E3", "\u0037\u20E3", "\u0038\u20E3", "\u0039\u20E3"]
    msg.channel.send('Welcome to bot configuration for your server. If you want to continue, use :one: or if you do not - use :two:').then((mess) => {
        mess.react(voteEmotes[1]); mess.react(voteEmotes[2])
        mess.awaitReactions((reaction, user) => {
            return [voteEmotes[1], voteEmotes[2]].includes(reaction.emoji.name) && user.id == msg.author.id
        }, { max: 1 }).then(res => {
            if (res.first().emoji.name == voteEmotes[1]) {
                info.guild = msg.guild.id
                msg.channel.send('Which voice channel would you like to be dedicated to this bot? - Type null if none')
                collector = new Discord.MessageCollector(msg.channel, mess => mess.author.id == msg.author.id)
                collector.on('collect', message => {
                    if (!info.channelModerate) {
                        if (message.content === 'null') info.channelName = false
                        else {
                            channel = msg.guild.channels.find(val => val.name === message.content)
                            console.log(channel + '' + message.content)
                            if (!channel) return msg.reply('Channel does not found')
                            else if (channel.type != 'voice') return msg.reply('You can only use voice channel')
                            info.channelName = message.content
                            info.channelId = channel.id
                            console.log(info)
                        }
                        msg.reply('Would you like to to automatically change this channel name to currently playing song?').then(mess => {
                            mess.react(voteEmotes[1]); mess.react(voteEmotes[2])
                            mess.awaitReactions((reaction, user) => {
                                return [voteEmotes[1], voteEmotes[2]].includes(reaction.emoji.name) && user.id == msg.author.id
                            }, { max: 1 }).then(res => {
                                if (res.first().emoji.name == voteEmotes[1]) info.canChange = 'true'
                                else info.canChange = 'false'
                                console.log(info)
                                writeConfig(info)
                                watcher = require('../main').watcher
                                watcher.guild = msg.guild.id
                            }
                            )
                        })
                    }
                })
            }
            else {

            }
        })
    })
}
const writeConfig = (obj) => {
    fs.writeFile(`configs/${obj.guild}.json`, JSON.stringify(obj), (error) => {
        if (error) {
            console.log(error)
        }
        console.log('hej')
    })
}

const config = async (guild) => {
    fs.readFile(`configs/${guild}.json`, (err, data) => {
        if (err) console.error(err)
        else {
            return JSON.parse(data)
        }
    })
}

module.exports = {
    config: config,
    setup: setup,
}