const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const settings = require("../settings.json");

module.exports = {
    name: "rol-ver",
    command: new SlashCommandBuilder().setName("rol-ver").setDescription("Seçtiğiniz rolü verir.").addUserOption(o => o.setName("kisi").setDescription("Kişi").setRequired(true)).addStringOption(o => o.setName("rol").setDescription("Verilecek rol").setRequired(true).addChoices({ name: "Rol 1", value: "972182122985037884" })),
    async run({ client, int, db }) {
        if (!int.member.roles.cache.get(settings.yetkiliRolId)) return int.reply({
            content: "Yetkili değilsiniz",
            ephemeral: true
        });

        let kisi = int.options.getMember("kisi");
        kisi = int.guild.members.cache.get(kisi.user.id);
        let rol = int.options.getString("rol");

        kisi.roles.add(rol);

        int.reply({
            content: "Verildi.",
            ephemeral: true
        });
    }
};