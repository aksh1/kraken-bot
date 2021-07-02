const { MongoClient } = require('mongodb');
const config = require("./config.json");
const uri = config.url
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    // perform actions on the collection object
    if(err) {
        console.log(err)
    }
  });

const Discord = require('discord.js');
const bot = new Discord.Client();
const token = config.token;
const prefix = config.prefix;
const fs = require("fs");

bot.once('ready', () => {
	console.log('Ready!');
});

bot.login(token);
bot.commands = new Discord.Collection();

fs.readdir("./commands", (err, files) => {
    if (err) console.log(err)

    let jsfile = files.filter(f => f.split(".").pop() === "js")
    if (jsfile.length <= 0) {
        return console.log("[LOGS] Couldn't Find Commands!");
    }
    try {
        jsfile.forEach((f, i) => {
            let pull = require(`./commands/${f}`);
            bot.commands.set(pull.config.name, pull);
            console.log(pull.config.name)
        });
    } catch {
        console.error();
    }
});

bot.on('message', message => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
    message.content.toLowerCase();

    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    try {
        let commandfile = bot.commands.get(cmd.slice(prefix.length)) || bot.commands.get(bot.aliases.get(cmd.slice(prefix.length)))
        extras = {client}
        if (commandfile) commandfile.run(bot, message, args, extras)
    } catch (error) {
        message.console.send("Not a command.")
    }

})