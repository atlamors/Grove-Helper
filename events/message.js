module.exports = {
	name: 'messageCreate',
	execute(message) {

		/**
		 * Do not allow regaular messages in deposit channel
		 * /deposit only, and bot embeds
		 *
		 * console.log(`${message.author.username} in #${message.channel.name} sent a message:`)
 		 * console.log(`${message.content}`)
		 */
		if ( message.channel.id === '883125579791073390' ) {
			if ( message.author.id !== __clientID ) {
				message.delete()
			}
		}
	},
}
