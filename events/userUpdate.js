const settings = require("../settings.json");

module.exports = {
    name: "userUpdate",
    async run(oldUser, newUser, client) {
        let member = client.guilds.cache.get(settings.sunucuId).members.cache.get(oldUser.id);

        console.log(member);

        if (!member) return false;

        let tag = settings.tag;

        if (!oldUser.username.includes(tag) && newUser.username.includes(tag)) {
            member.roles.add(settings.tagRolId);
        };

        if (oldUser.username.includes(tag) && !newUser.username.includes(tag)) {
            member.roles.remove(settings.tagRolId);
        };
    }
};