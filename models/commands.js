const methods = {
    youtube: require('../commands/youtube.js'),
    help: null
}

//All commands avaible here. Use to check if message is command and go to the section and then parse it to the method with same name ex. if message starts with *play - go to section youtube(../commands/youtube.js)     
const commands = {
    '*play': {
        help: 'Play music from youtube. Currently only supporting single songs.\n Usage {*play name|url}',
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
        section: 'youtube',
        func: (msg, words) => {
            methods.youtube.find(words, msg, true)
        }
    },
    '*random': {
        help: 'Find random video on youtube. NOT IMPLEMENTED YET!',
    },
    '*help': {
        help: 'Get all commands with method of usage\n .\n Usage {*help}',
    }
}
module.exports = commands