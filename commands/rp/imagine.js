const { EmbedBuilder, ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');


module.exports = {
    name: 'image',
    description: 'Gere arte em seus sonhos!',
    options: [
        {
            name: 'prompt',
            type: ApplicationCommandOptionType.String,
            description: "Sua solicitação para gerar a arte",
            required: true,
        },
    ],
    run: async (client, interaction) => {

        await interaction.deferReply();

        const { default: midjourney } = await import('midjourney-client')
        const prompt = interaction.options.getString('prompt');

        midjourney(prompt).then(response => {
            if (response.length < 1) {
                interaction.editReply('Não é possível gerar imagens.')
            }

            const imageURLs = response.join('\n')

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel(`Abrir no navegador`)
                        .setStyle(ButtonStyle.Link)
                        .setURL(`${imageURLs}`)
                        .setEmoji('1083007659457912852'),
                )

            const embed = new EmbedBuilder()
                .setTitle("**Your Prompt:**")
                .setDescription(`**${prompt}**`)
                .setImage(`${imageURLs}`)
                .setColor('#2f3136')


            interaction.editReply({ embeds: [embed], components: [row] });
        })

    }
}