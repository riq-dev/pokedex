const fs = require("fs");

module.exports = async (client) => {
    const SlashsArray = []

    fs.readdir(`./commands`, (error, folder) => {
        folder.forEach(subfolder => {
            fs.readdir(`./commands/${subfolder}/`, (error, files) => {
                files.forEach(files => {

                    if (!files?.endsWith('.js')) return;
                    files = require(`../commands/${subfolder}/${files}`);
                    if (!files?.name) return;
                    client.slashCommands.set(files?.name, files);

                    SlashsArray.push(files)
                });
            });
        });
    });

    fs.readdir('./events', (err, file) => {
        file.forEach(event => {
            require(`../events/${event}`)
        })
    })

    client.on("ready", async () => {
        client.guilds.cache.forEach(guild => guild.commands.set(SlashsArray));
    });

    client.on("guildCreate", async () => {
        client.guilds.cache.forEach(guild => guild.commands.set(SlashsArray));
    });

    process.on('multipleResolutions', (type, reason, promise) => {
        console.log(`Err:\n` + type, promise, reason);
    });

    process.on('unhandledRejection', (reason, promise) => {
        console.log(`Err:\n` + reason, promise);
    });

    process.on('uncaughtException', (error, origin) => {
        console.log(`Err:\n` + error, origin);
    });

    process.on('uncaughtExceptionMonitor', (error, origin) => {
        console.log(`Err:\n` + error, origin);
    });
};