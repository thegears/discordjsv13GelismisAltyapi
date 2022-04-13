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
	MessageSelectMenu
} = require("discord.js");
const config = require("./config.json");
const {
	readdirSync
} = require("fs");
const client = new Client({
	intents: 32767
});
const discordModals = require("discord-modals");
const {
	Modal,
	TextInputComponent,
	showModal
} = require("discord-modals");
discordModals(client);
client.login(config.token);
client.on("ready", async () => {
	console.log("Hazır");
});

// Buton Etkileşimleri
client.buttonInteractions = new Collection();
readdirSync("./buttonInteractions/").forEach(f => {
	let cmd = require(`./buttonInteractions/${f}`);
	client.buttonInteractions.set(cmd.customId, cmd);
});
// Buton Etkileşimleri

// Modal Etkileşimleri
client.modalInteractions = new Collection();
readdirSync("./modalInteractions/").forEach(f => {
	let cmd = require(`./modalInteractions/${f}`);
	client.modalInteractions.set(cmd.customId, cmd);
});
// Modal Etkileşimleri

// Select Menu Etkileşimleri
client.selectMenuInteractions = new Collection();
readdirSync("./selectMenuInteractions/").forEach(f => {
	let cmd = require(`./selectMenuInteractions/${f}`);
	client.selectMenuInteractions.set(cmd.customId, cmd);
});
// Select Menu Etkileşimleri

// Context Menu Etkileşimleri
client.contextMenuInteractions = new Collection();
readdirSync("./contextMenuInteractions/").forEach(f => {
	let cmd = require(`./contextMenuInteractions/${f}`);
	client.contextMenuInteractions.set(cmd.customId, cmd);
});
// Context Menu Etkileşimleri

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
		event.run(...args);
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

	if (int.isCommand()) client.slashInteractions.get(int.commandName)?.run(client, int);
	else if (int.isContextMenu()) client.contextMenuInteractions.get(int.customId)?.run(client, int);
	else if (int.isSelectMenu()) client.selectMenuInteractions.get(int.customId)?.run(client, int);
	else client.buttonInteractions.get(int.customId)?.run(client, int);

});

client.on('modalSubmit', async (modal) => {

	client.modalInteractions.get(modal.customId)?.run(client, modal);

});
