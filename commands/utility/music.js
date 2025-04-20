const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');
const ytdl = require('ytdl-core');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Plays a song from YouTube')
        .addStringOption(option =>
            option.setName('url')
                .setDescription('YouTube video URL')
                .setRequired(true)),
    async execute(interaction) {
        const url = interaction.options.getString('url');
        if (!ytdl.validateURL(url)) {
            return interaction.reply('Invalid YouTube URL!');
        }

        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) {
            return interaction.reply('You need to be in a voice channel to play music!');
        }

        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: interaction.guild.id,
            adapterCreator: interaction.guild.voiceAdapterCreator,
        });

        const stream = ytdl(url, { filter: 'audioonly' });
        const resource = createAudioResource(stream);
        const player = createAudioPlayer();

        player.play(resource);
        connection.subscribe(player);

        await interaction.reply(`Now playing: ${url}`);
    },
};
