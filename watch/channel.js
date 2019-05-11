"use strict"

const fs = require('fs')

//Class for voice channel watcher - system for watching over bot's decicated voice channel - currently in work
class VoiceWatchers {
    constructor(id = null) { //consturctor - optional parameter: id - guild.id
        this.id = id
        this.watchers = new Map() //create map of watchers where is key is guild.id and value is data from config file
        this.startWatch() //read all servers config file and push into watchers
    }

    set guild(guild) { //when creating new config file from for example *setup, start new watcher automatically, or just start manually by guild.id
        if (guild) {
            this.id = guild
            this.startWatch()
        }
    }
    async startWatch() {
        if (this.id) { //when creating new config file from for example *setup, start new watcher automatically, or just start manually by guild.id
            require('../commands/setup').config(this.id).catch(e => console.error(e)).then(data => { //read config file 
                this.watchers.set(this.id, data[1, 2]) //push to watchers
            })
        }
        else {
            //Read all configs in a config directory
            fs.readdir('configs', (err, files) => {
                if (err) return console.error(err)
                files.forEach(file => {
                    console.log(file)
                    fs.readFile('configs/' + file, (err, data) => {
                        if (err) console.error(err)
                        else {
                            data = JSON.parse(data)
                            // data.watcher = new VoiceWatcher()
                            this.watchers.set(data.guild, data)
                        }
                    })
                })

            })
        }
    }
}
// class VoiceWatcher extends VoiceWatchers {
//     // constructor(id, voiceid) {
//     //     this.id = id
//     //     this.channel = voiceid

//     // }
// }



module.exports = VoiceWatchers