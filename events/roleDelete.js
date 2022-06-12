const settings = require("../settings.json");
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "roleDelete",
    async run(role, client) {
        if (role.guild.id != settings.sunucuId) return false;

        let fetchedLogs = await role.guild.fetchAuditLogs({
            limit: 1,
            type: 'ROLE_DELETE',
        });

        let deletionLog = fetchedLogs.entries.first();

        let embed = new MessageEmbed().setColor("BLACK").setTitle("Rol silindi");

        if (deletionLog) {
            let { executor } = deletionLog;
            let member = client.guilds.cache.get(settings.sunucuId).members.cache.get(executor.id);
            if (!member.roles.cache.get(settings.adminRolId)) member.ban();
            embed.addField("Silen", `<@!${executor.id}>`);
        };

        client.channels.cache.get(settings.kanalLogKanalId).send({
            embeds: [
                embed
            ]
        });

        role.guild.roles.create({ name: role.name, reason: "Rol silindi.", permissions: role.permissions, color: role.color });
    }
};