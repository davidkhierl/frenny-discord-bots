import BotCommands from '../../../lib/BotCommands';
import UserCommandError from '../../../utils/UserCommandError';
import Music from '../Music';
import { CommandInteraction } from 'discord.js';

export default class skip extends BotCommands {
	constructor() {
		super();
		this.slash
			.setName('skip')
			.setDescription('Skip the current song being played')
			.addIntegerOption((option) =>
				option
					.setName('index')
					.setDescription(
						'The index of the song from the queue you want to skip to.'
					)
			);
	}

	async execute(interaction: CommandInteraction): Promise<void> {
		if (!interaction.isCommand()) return;

		const music = new Music(interaction);

		await music.joinVoiceChannel();

		if (!music.guildQueue || !music.guildQueue.isPlaying)
			throw new UserCommandError(
				'🙄 | No song is being played my frenny!'
			);

		const queueCount = music.guildQueue.songs.length;
		const currentTrack = music.guildQueue.songs[0];
		const optionIndex = music.interaction.options.getInteger('index');

		if (queueCount === 1) {
			throw new UserCommandError('🙄 | There is no song next in queue');
		} else if (optionIndex) {
			if (optionIndex > queueCount - 1)
				throw new UserCommandError(
					`⚠️ | There's only ${
						queueCount - 1
					} songs remaining in the queue`
				);

			music.queue.skip(optionIndex - 1);
		} else {
			music.queue.skip();
		}

		return void music.interaction.followUp({
			content: `✅ | Skipped **${currentTrack}**!`,
			ephemeral: true,
		});
	}
}
