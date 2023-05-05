const { EmbedBuilder, ApplicationCommandOptionType, PermissionFlagsBits } = require("discord.js")
const fs = require("fs");

module.exports = {
    name: "reset",
    description: "reseta banco de dados",
    options: [
        {
            name: "ranking",
            description: "Adiciona advertência ao usuário.",
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: "farm",
            description: "em construção",
            type: ApplicationCommandOptionType.Subcommand,
        }

    ],
    run: async (client, interaction) => {
        /*         if (interaction.user.id !== interaction.guild.ownerId) {
                    return interaction.reply({ content: "Você não é o dono do servidor e não pode usar este comando!", ephemeral: true });
                } */
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator) || 
            !interaction.member.permissions.has('1074679279482322945')) {
            return interaction.reply({ content: `Você não possui permissão para usar este comando!`, ephemeral: true })
        }

        switch (interaction.options.getSubcommand()) {
            case "ranking": {
                try {
                    fs.unlinkSync("./recruitingData.json");
                    interaction.reply({ content: `${interaction.user}, Os dados de recrutamento foram apagados com sucesso!` });
                } catch (err) {
                    console.error(err);
                    interaction.reply({ content: "Ocorreu um erro ao apagar os dados de recrutamento.", ephemeral: true });
                }
                break;
            }
            case "farm": {
                interaction.reply({ content: 'em construção', ephemeral: true })
            }
        }
    }
}