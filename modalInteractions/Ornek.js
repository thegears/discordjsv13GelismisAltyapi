module.exports = {
	customId: "ornek",
	async run(client, int) {
		await int.reply({
			content: "Merhaba",
			ephemeral: true
		});
	}
};