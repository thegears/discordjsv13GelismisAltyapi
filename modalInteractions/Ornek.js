module.exports = {
	customId: "ornek",
	async run(client, modal) {
		await int.reply({
			content: "Merhaba",
			ephemeral: true
		});
	}
};
