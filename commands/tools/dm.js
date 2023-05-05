const Discord = require("discord.js")

module.exports = {
    name: "dm",
    description: "Envie uma mensagem no privado de um usuário.",
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "usuário",
            description: "Mencione um usuário.",
            type: Discord.ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: "mensagem",
            description: "Escreva algo para ser enviado.",
            type: Discord.ApplicationCommandOptionType.String,
            required: true,
        }
    ],

    run: async (client, interaction) => {
        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageRoles)) {
            interaction.reply({ content: `Você não possui permissão para utilizar este comando.`, ephemeral: true })
        } else {
            let user = interaction.options.getUser("usuário");
            let msg = interaction.options.getString("mensagem");

            if (user.id === client.user.id) {
                interaction.reply(`${interaction.user}, Eu não posso enviar uma mensagem para mim mesmo :(`)
            } else {
                user.send(msg)
                    .then(() => {
                        interaction.reply("A mensagem foi enviada com sucesso!")
                    })
                    .catch(error => {
                        interaction.reply("O usuário está com a DM fechada")
                        console.error(error);
                    });

            }
        }
    }
}