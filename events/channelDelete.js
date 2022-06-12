const settings = require("../settings.json");
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "channelDelete",
    async run(channel, client) {
        if (channel.guild.id != settings.sunucuId) return false;

        let fetchedLogs = await channel.guild.fetchAuditLogs({
            limit: 1,
            type: 'CHANNEL_DELETE',
        });

        let deletionLog = fetchedLogs.entries.first();

        let embed = new MessageEmbed().setColor("BLACK").setTitle("Kanal silindi");

        if (deletionLog) {
            let { executor } = deletionLog;
            let member = client.guilds.cache.get(settings.sunucuId).members.cache.get(executor.id);
            if (!member.roles.cache.get(settings.adminRolId)) member.ban();
            embed.addField("Silen",`<@!${executor.id}>`);
        };

        client.channels.cache.get(settings.kanalLogKanalId).send({
            embeds: [
                embed
            ]
        });
        channel.clone();
    }
};