const Discord = require('discord.js');
const client = require('../index')
const moment = require('moment');
const { PIX } = require('gpix/dist');
const Canvas = require('canvas');

client.on('ready', () => {
    const cliente = client.users.cache.get('863979764317552640')

    async function verificarPrazoPagamento() {
        const createData = moment();
        const paymentData = moment(createData).add(1, 'days');
        const vencido = moment(createData).add(37, 'days');
        const mensagem = `Olá ${cliente}, seu bot está prestes a ser desligado
        \n**PIX COPIA E COLA: **`;

        const pix = PIX.static().setReceiverName(client.user.username)
            .setReceiverCity('Brasil')
            .setKey('496f02d7-0c7c-4346-8119-1cb677ba93c5')
            .setAmount(15);

        const canvas = Canvas.createCanvas(1200, 1200);
        const context = canvas.getContext('2d');
        const qrCodeImage = await Canvas.loadImage(await pix.getQRCode());
        context.fillStyle = '#FFFFFF';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(qrCodeImage, 0, 0, canvas.width, canvas.height);

        const brCode = pix.getBRCode();
        const embed = new Discord.EmbedBuilder()
            .setTitle(`QRCode PIX no valor de R$15`)
            .setImage(`attachment://qrcode.png`)
            .setDescription(`Realize o **pagamento** do bot antes que o prazo de 7 dias seja expirado`)
            .setColor('Green')
            .setTimestamp(Date.now());

        if (createData.isAfter(paymentData) && createData.isBefore(vencido)) {
            cliente.send({
                content: `${mensagem}\n\`${brCode}\`\n`,
                embeds: [embed],
                files: [{
                    name: 'qrcode.png',
                    attachment: canvas.toBuffer()
                }]
            });
        }
    }
    verificarPrazoPagamento();
})

