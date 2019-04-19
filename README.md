# Resh is a discord bot made in node.js and powered by discord.js. ![alt text](https://i.imgur.com/slj8lf4.png)



At this moment Resh can play music from youtube, create one-time queue. 
However, more features are coming very soon.
__If you have problem with something or want to suggest new feature - go on, I'm open for new suggestions.__


# Installation and usage

To use this bot on your own, you need to have node.js and npm installed.
Once you have it, install all required modules using npm.
```bash
npm install
```
**Resh requires _discord bot token_ and _youtube search api key_ as enviroment variable.**
To acquire bot token you need to [create application](https://discordapp.com/developers/applications/#top) and summon bot from 'Bot' section. Your token should be below bot's nickname.
To obtain youtube api key go to the [google developer console](https://console.developers.google.com), login with your google account head to 'library' section and find Youtube Data. Enable it and then go to the credentials and create new api key.
Once you have all your tokens, create new file called '.env' (make sure that it doesn't have any additional extensions, copy below
text and after = replace everything in line with your token (be sure it doesn't have any spaces after =).
Make sure that .env file is located in same folder as main.js.

```
BOT_TOKEN=(insert your discord token here)
YT_TOKEN=(insert your youtube api key here)
```

To start bot you just need to type ``` npm start ``` or ``` node main.js ```
# Current working commands
(Prefix '*')

__'*play'__ - Plays music from youtube. Currently only supporting single songs. Usage {*play name | url}'. </br>
__'*quit'__ - Quit voice channel - stop playing music. </br>
__'*skip'__ - Skip song and play next in queue.


# Ongoing features

- [ ] **Better audio quality**
- [ ] Better performance
- [ ] **Help command**
- [ ] **Admin commands**
- [ ] Implement welcome message
- [ ] Special voice channel for bot which name is equal to current song.
- [ ] Random video from youtube (not sure about it yet)
- [ ] Coin flip
And much more things!
