const methods = {
    youtube: require('../commands/youtube.js'),
}

//All commands avaible here. Use to check if message is command and go to the section and then parse it to the method with same name ex. if message starts with *play - go to section youtube(../commands/youtube.js)     
const commands = {
    '*play': {
        help: 'Play music from youtube. Currently only supporting single songs',
        usage: '*play name|url',
        func: (msg, song) => {
            methods.youtube.play(msg, song)
        }
    },
    '*quit': {
        help: 'Quit voice channel - stop playing music',
        func: (msg) => {
            methods.youtube.quit(msg)
        }
    },
    '*skip': {
        help: 'Skip song - play next in queue',
        func: (msg) => {
            methods.youtube.skip(msg)
        }
    },
    '*find': {
        help: 'Find a video using keywoards',
        func: (msg, words) => {
            methods.youtube.find(words, msg, true)
        }
    },
    '*help': {
        help: 'Get all commands with method of usage',
        func: (msg) => {
            mess = 'Command | Usage\n'
            Object.entries(commands).forEach((command) => {
                mess += `** ${command[0]} ** | ${command[1].help} `
                if (command[1].usage) {
                    sp = command[1].usage.split(' ')
                    mess += ` ** ${sp[0]} _${sp[1]}_ ** `
                }
                mess += '\n'
            })
            msg.author.send(mess)

        }
    },
}
module.exports = commands