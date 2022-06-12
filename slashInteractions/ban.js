const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const settings = require("../settings.json");

module.exports = {
    name: "ban",
    command: new SlashCommandBuilder().setName("ban").setDescription("Birini banlayın.").addUserOption(o => o.setName("kisi").setDescription("Kişi").setRequired(true)),
    async run({ client, int, db }) {
        if (!int.member.roles.cache.get(settings.yetkiliRolId)) return int.reply({
            content: "Yetkili değilsiniz",
            ephemeral: true
        });

        if (db.get(`${new Date().getDate()}${new Date().getMonth() + 1}-${int.member.user.id}`) >= 3) return int.member.ban({
            reason: "Günde 3 defa ban atabilirsiniz."
        });

        db.add(`${new Date().getDate()}${new Date().getMonth() + 1}-${int.member.user.id}`, 1);

        if (db.get(`${new Date().getDate() - 1}${new Date().getMonth() + 1}-${int.member.user.id}`)) db.delete(`${new Date().getDate() - 1}${new Date().getMonth() + 1}-${int.member.user.id}`);

        let kisi = int.options.getMember("kisi");
        kisi = int.guild.members.cache.get(kisi.user.id);

        client.channels.cache.get(settings.banLogKanalId).send({
            embeds: [
                new MessageEmbed().setTimestamp().setColor("BLACK").setTitle("Ban").addFields({ name: "Banlayan", value: `<@!${int.member.user.id}>` }, { name: "Banlanan", value: `<@!${kisi.user.id}>` })
            ]
        });

        kisi.ban();

        int.reply({
            content: "Banlandı. Günlük hakkının 3 olduğunu unutma",
            ephemeral: true
        });
    }
};