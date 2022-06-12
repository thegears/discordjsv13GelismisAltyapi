const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
    name: "çekiliş",
    command: new SlashCommandBuilder().setName("çekiliş").setDescription("Çekiliş yapın.").addIntegerOption(o => o.setName("deger").setDescription("Süre değeri").setRequired(true)).addStringOption(o => o.setName("cins").setDescription("Süre cinsi").addChoices({ name: "Dakika", value: "dakika" }, { name: "Saat", value: "saat" }, { name: "Gün", value: "gun" }).setRequired(true)).addStringOption(o => o.setName("odul").setDescription("Ödül").setRequired(true)),
    async run({ client, int, db }) {
        let deger = int.options.getInteger("deger");
        let cins = int.options.getString("cins");
        let odul = int.options.getString("odul");

        let sure = parseInt(deger) * 1000;
        if (cins == "dakika") sure = sure * 60;
        if (cins == "saat") sure = sure * 60 * 60;
        if (cins == "gun") sure = sure * 60 * 60 * 24;

        sure = sure + Date.now();

        let row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                .setCustomId(`cekiliseKatil-${int.id}`)
                .setLabel('Katıl')
                .setStyle('SUCCESS'),
            );

        await db.push("cekilisler", {
            id: int.id,
            channel: int.channel.id,
            odul,
            sure
        });

        setTimeout(async () => {
            let list = await db.get(`cekilis-${int.id}-liste`) || [];

            let embed = new MessageEmbed().setColor("RANDOM").setTitle("Çekiliş bitti").setTimestamp();

            if (list.length > 0) {
                let kazanan = list[Math.floor(Math.random() * list.length)];
                embed.setDescription(`**${odul}** Ödüllü çekiliş sonuçlandı. **${list.length}** kişi katıldı. Kazanan: <@!${kazanan}>.`);
            } else {
                embed.setDescription(`**${odul}** Ödüllü çekiliş sonuçlandı. Kimse katılmadı.`);
            };

            db.delete(`cekilis-${int.id}-liste`);
            let cekilisler = await db.get("cekilisler") || [];
            cekilisler = cekilisler.filter(a => a.id != int.id);
            await db.set("cekilisler",cekilisler);

            int.channel.send({
                embeds: [embed]
            });
        }, sure - Date.now());

        int.reply({
            embeds: [
                new MessageEmbed().setTitle("Çekiliş").setTimestamp().setColor("RANDOM").setDescription("Bir çekiliş başladı katılmak için aşağıdaki butona tıkla.").addFields({ name: "Süre", value: `${deger} ${cins.replace("u","ü")}` }, { name: "Ödül", value: `${odul}` })
            ],
            components: [row]
        })
    }
};