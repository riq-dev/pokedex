require('../index')
const client = require('../index')

client.on("messageCreate", (message) => {
    if (message.author.bot) return;

    let mencoes = [`<@${client.user.id}>`, `<@!${client.user.id}>`]

    mencoes.forEach(element => {
        
        if (message.content === element) {
            (message.content.includes(element))
            message.channel.send(`É A TROPA DO **BRASIL** KRL!!`)
        }
    })

})