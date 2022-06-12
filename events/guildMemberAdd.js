const settings = require("../settings.json");
const { createCanvas, loadImage } = require('canvas')
const canvas = createCanvas(500, 250);
const ctx = canvas.getContext('2d');
const { MessageAttachment } = require("discord.js");

module.exports = {
    name: "guildMemberAdd",
    async run(member) {
        await loadImage('https://imgs.search.brave.com/6xbtsQFm4PBZhjTaQMAVsKBl_mfCn-OJAs7wrIAatmo/rs:fit:1200:1200:1/g:ce/aHR0cDovL3dvbmRl/cmZ1bGVuZ2luZWVy/aW5nLmNvbS93cC1j/b250ZW50L3VwbG9h/ZHMvMjAxNC8wNi9n/YWxheHktd2FsbHBh/cGVycy0zMC5qcGc').then((image) => {
            ctx.drawImage(image, 0, 0, 500, 250)
        });

        await loadImage(member.user.displayAvatarURL().replace("webp", "jpg")).then((image) => {
            ctx.drawImage(image, 190, 20, 125, 125);
        });

        ctx.font = '30px Impact';

        ctx.fillStyle = '#ffffff';

        ctx.fillText(member.displayName, 190 , 175);

        ctx.font = '15px Impact';

        ctx.fillText("Sunucumuza hoş geldin", 175 , 195);

        let attachment = new MessageAttachment(canvas.toBuffer('image/png'), 'profile-image.png');

        member.guild.channels.cache.get(settings.gelenGidenKanalId).send({
            files: [attachment]
        })
    }
};