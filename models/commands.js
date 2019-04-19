const youtube = require('../commands/youtube.js')


//All commands avaible here. Use to check if message is command and go to the section and then parse it to the method with same name ex. if message starts with *play - go to section youtube(../commands/youtube.js)     
const commands = {
    '*play': {
        help: 'Play music from youtube. Currently only supporting single songs.\n Usage {*play name|url}',
        section: 'youtube',
        subsection: 'play'
    },
    '*quit': {
        help: 'Quit voice channel - stop playing music',
        section: 'youtube',
        subsection: 'play'
    },
    '*skip': {
        help: 'Skip song - play next in queue',
        section: 'youtube',
        subsection: 'play'
    },
    '*random': {
        help: 'Find random video on youtube. NOT IMPLEMENTED YET!',
        section: 'youtube',
    },
    '*help': {
        help: 'Get all commands with method of usage\n .\n Usage {*help}',
        function_name: 'sendHelp',
        section: 'help'
    }
}
const get_commands = function () {
    return commands
}

module.exports = {
    commands: get_commands,
}