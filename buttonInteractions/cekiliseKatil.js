module.exports = {
    customId: "cekiliseKatil",
    async run({ client, int, db }) {
        let id = int.customId.split("-")[1];

        let list = await db.get(`cekilis-${id}-liste`) || [];

        if(list.includes(int.member.user.id)) return int.reply({
        	content: "Zaten katılmışsınız",
        	ephemeral: true
        });

        await db.push(`cekilis-${id}-liste`,int.member.user.id);

        int.reply({
        	content: "Başarıyla katıldınız.",
        	ephemeral: true
        });
    }
};