const Discord = require("discord.js")
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');

module.exports = {
    name: "nobre",
    description: "atalho para connectar no servidor!",
    type: Discord.ApplicationCommandType.ChatInput,

    run: async (client, interaction) => {
        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageRoles)) {
            interaction.reply({ content: `Você não possui permissão para utilizar este comando.`, ephemeral: true })
        } else {

            let embed = new Discord.EmbedBuilder()
                .setAuthor({
                    name: 'CONECTE NA CIDADE NOBRE!',
                    iconURL: 'https://cdn-longterm.mee6.xyz/plugins/embeds/images/918915804924350496/b6eef357ade849aa67fd39cd900ab9ee38630e3014cffd5d5c346c8a27085705.gif'
                })
                .setColor("Yellow")
                .setTitle("CIDADE NOBRE - SEASON 4")
                .setThumbnail("https://cdn-longterm.mee6.xyz/plugins/embeds/images/918915804924350496/b6eef357ade849aa67fd39cd900ab9ee38630e3014cffd5d5c346c8a27085705.gif")
                .setDescription(`
                *Para você se conectar na cidade é simples, basta clicar no botão abaixo e você será redirecionado a cidade!*

                **Caso ainda não consiga se conectar, basta apertar F8, colar o comando abaixo e então aperte enter!:**

                \`connect nobre.santagroup.gg\``)
                .setImage("https://share.creavite.co/f63PsvjhB8lG0hZy.gif")

            const connectar = new ButtonBuilder()
                .setEmoji('🌐')
                .setLabel('Connectar')
                .setURL('https://cfx.re/join/d8548q')
                .setStyle(ButtonStyle.Link);

            const instagram = new ButtonBuilder()
                .setEmoji('📷')
                .setLabel('Instagram')
                .setURL('https://www.instagram.com/trpdaisraelcdn/')
                .setStyle(ButtonStyle.Link);

            const tiktok = new ButtonBuilder()
                .setEmoji('📱')
                .setLabel('Tiktok')
                .setURL('https://www.tiktok.com/@trpdaisraelcdn_')
                .setStyle(ButtonStyle.Link);

            const discord = new ButtonBuilder()
                .setEmoji('💻')
                .setLabel('Discord')
                .setURL('https://discord.com/invite/cidadenobre')
                .setStyle(ButtonStyle.Link);

            const row = new ActionRowBuilder().addComponents(connectar, discord, instagram, tiktok);

            interaction.reply({ content: `Sua mensagem foi enviada!`, ephemeral: true })
            interaction.channel.send({ embeds: [embed], components: [row] })
        }
    }
}