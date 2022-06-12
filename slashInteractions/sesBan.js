const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const settings = require("../settings.json");

module.exports = {
    name: "ses-ban",
    command: new SlashCommandBuilder().setName("ses-ban").setDescription("Birini seste mikrofununu kapatın ve bağlantısını kesin.").addUserOption(o => o.setName("kisi").setDescription("Kişi").setRequired(true)),
    async run({ client, int, db }) {
        if (!int.member.roles.cache.get(settings.yetkiliRolId)) return int.reply({
            content: "Yetkili değilsiniz",
            ephemeral: true
        });

        let kisi = int.options.getMember("kisi");
        kisi = int.guild.members.cache.get(kisi.user.id);

        kisi.voice.setMute(true);
        kisi.voice.disconnect();

        int.reply({
            content: "Susturuldu ve bağlantısı kesildi.",
            ephemeral: true
        });
    }
};