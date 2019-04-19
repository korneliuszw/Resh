
const play = require('./commands/play')

const parser = (command, msg, args, section) => {
    command = String(command).replace('*', '')
    console.log('hey!')
    if (section === 'play') {
        console.log('hey from parser')
        play[command](msg, args)
    }
}

module.exports = parser