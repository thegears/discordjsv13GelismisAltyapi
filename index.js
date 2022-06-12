const {
    REST
} = require('@discordjs/rest');
const {
    Routes
} = require('discord-api-types/v9');
const {
    Client,
    Intents,
    MessageActionRow,
    MessageButton,
    MessageEmbed,
    Collection,
    MessageSelectMenu,
    Modal,
    TextInputComponent,
    showModal
} = require("discord.js");
const config = require("./config.json");
const {
    readdirSync
} = require("fs");
const client = new Client({
    intents: 32767
});
client.login(config.token);
const {
    JsonDatabase
} = require("wio.db");

const db = new JsonDatabase({
    databasePath: "./db.json"
});

client.on("ready", async () => {
    console.log("Hazır");

    let cekilisler = await db.get("cekilisler") || [];

    cekilisler.forEach(c => {
        setTimeout(async () => {
            let list = await db.get(`cekilis-${c.id}-liste`) || [];

            let embed = new MessageEmbed().setColor("RANDOM").setTitle("Çekiliş bitti").setTimestamp();

            if (list.length > 0) {
                let kazanan = list[Math.floor(Math.random() * list.length)];
                embed.setDescription(`**${c.odul}** Ödüllü çekiliş sonuçlandı. **${list.length}** kişi katıldı. Kazanan: <@!${kazanan}>.`);
            } else {
                embed.setDescription(`**${c.odul}** Ödüllü çekiliş sonuçlandı. Kimse katılmadı.`);
            };

            db.delete(`cekilis-${c.id}-liste`);
            let cekilisler = await db.get("cekilisler") || [];
            cekilisler = cekilisler.filter(a => a.id != c.id);
            await db.set("cekilisler", cekilisler);

            client.channels.cache.get(c.channel).send({
                embeds: [embed]
            });
        }, c.sure - Date.now());
    });

    console.log("Çekilişler ayarlandı.");
});

// Buton Etkileşimleri
client.buttonInteractions = new Collection();
readdirSync("./buttonInteractions/").forEach(f => {
    let cmd = require(`./buttonInteractions/${f}`);
    client.buttonInteractions.set(cmd.customId, cmd);
});
// Buton Etkileşimleri

// Slash Etkileşimleri
client.slashInteractions = new Collection();
let globalSlashCommands = [];
readdirSync("./slashInteractions/").forEach(f => {
    let cmd = require(`./slashInteractions/${f}`);
    client.slashInteractions.set(cmd.name, cmd);
    globalSlashCommands.push(cmd.command);
});
// Slash Etkileşimleri

// Events'ları çekelim
readdirSync("./events/").forEach(f => {
    let event = require(`./events/${f}`);

    client.on(`${event.name}`, (...args) => {
        event.run(...args,client);
    });
});
// Events'ları çekelim

    // Slash Global Komutlar Ekleyelim
let rest = new REST({
    version: '9'
}).setToken(config.token);

client.on("ready", async () => {
    try {

        await rest.put(
            Routes.applicationCommands(client.user.id), {
                body: globalSlashCommands
            },
        );

        console.log('Global komutlar güncellendi.');
    } catch (error) {
        console.error(error);
    };
});
// Slash Global Komutlar Ekleyelim


client.on("interactionCreate", async int => {

    if (int.isCommand()) client.slashInteractions.get(int.commandName)?.run({ client, int, db });
    else if (int.isButton()) client.buttonInteractions.find(a => int.customId.startsWith(a.customId))?.run({ client, int, db });

});
