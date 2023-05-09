const { ApplicationCommandOptionType, PermissionFlagsBits } = require("discord.js")
const fs = require("fs");
const cron = require('node-cron');

async function resetRanking() {
    try {
        fs.unlinkSync("./recruitingData.json");
        console.log("Os dados de recrutamento foram apagados com sucesso!");
    } catch (err) {
        console.error(err);
    }
}

module.exports = {
    name: "reset",
    description: "reseta banco de dados",
    options: [
        {
            name: "ranking",
            description: "Apaga os dados de recrutamento.",
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: "farm",
            description: "Em construção",
            type: ApplicationCommandOptionType.Subcommand,
        }

    ],
    run: async (client, interaction) => {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator) ||
            !interaction.member.permissions.has('1074679279482322945')) {
            return interaction.reply({ content: `Você não possui permissão para usar este comando!`, ephemeral: true })
        }

        switch (interaction.options.getSubcommand()) {
            case "ranking": {
                resetRanking();
                interaction.reply({ content: "Os dados de recrutamento foram apagados com sucesso!", ephemeral: true });
                break;
            }
            case "farm": {
                interaction.reply({ content: 'Em construção', ephemeral: true })
            }
        }
    }
}

cron.schedule('59 23 * * 1', () => {
    resetRanking();
});
