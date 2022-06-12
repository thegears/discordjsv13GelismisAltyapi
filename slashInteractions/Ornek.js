const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: "ornek",
    command: new SlashCommandBuilder().setName("ornek").setDescription("ornek"),
    async run({ client, int }) {
        client.emit("guildMemberAdd",int.member);
    }
};