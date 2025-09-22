/**
 * Discord bot usage examples for RYXU XO Lavalink Encoder
 */

import { LavalinkEncoder, DiscordTrack, DiscordPlaylist } from '../src';

// Initialize the encoder
const encoder = new LavalinkEncoder();

// Example 1: Create a Discord track with user information
console.log('=== Discord Track Example ===');

const requester = {
  id: '123456789012345678',
  username: 'MusicLover',
  discriminator: '1234',
};

const guildId = '987654321098765432';
const channelId = '111111111111111111';

const discordTrack = encoder.createDiscordYouTubeTrack(
  'dQw4w9WgXcQ',
  'Never Gonna Give You Up',
  'Rick Astley',
  212, // Duration in seconds
  requester,
  guildId,
  channelId,
  {
    artworkUrl: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
  }
);

console.log('Discord track:', discordTrack);
console.log('Requester:', encoder.getRequester(discordTrack));
console.log('Guild info:', encoder.getGuildInfo(discordTrack));

// Example 2: Create a Discord playlist
console.log('\n=== Discord Playlist Example ===');

const playlistData = [
  {
    videoId: 'dQw4w9WgXcQ',
    title: 'Never Gonna Give You Up',
    author: 'Rick Astley',
    duration: 212,
  },
  {
    videoId: '9bZkp7q19f0',
    title: 'PSY - GANGNAM STYLE',
    author: 'officialpsy',
    duration: 252,
  },
  {
    videoId: 'kJQP7kiw5Fk',
    title: 'Luis Fonsi - Despacito ft. Daddy Yankee',
    author: 'Luis Fonsi',
    duration: 281,
  },
];

const discordPlaylist = encoder.createDiscordYouTubePlaylist(
  'PLrAXtmRdnEQy6nuLMOVuF4K4FQ4F2hVjA',
  'Viral Music Hits',
  playlistData,
  requester,
  guildId,
  channelId,
  0
);

console.log('Discord playlist:', discordPlaylist.info);
console.log('Number of tracks:', discordPlaylist.tracks.length);

// Example 3: Filter tracks by requester
console.log('\n=== Filter Tracks by Requester Example ===');

const anotherUser = {
  id: '999999999999999999',
  username: 'AnotherUser',
  discriminator: '5678',
};

const anotherTrack = encoder.createDiscordYouTubeTrack(
  '9bZkp7q19f0',
  'PSY - GANGNAM STYLE',
  'officialpsy',
  252,
  anotherUser,
  guildId,
  channelId
);

const allTracks = [discordTrack, ...discordPlaylist.tracks, anotherTrack];
const userTracks = encoder.filterTracksByRequester(allTracks, requester.id);

console.log('All tracks:', allTracks.length);
console.log('User tracks:', userTracks.length);

// Example 4: Filter tracks by guild
console.log('\n=== Filter Tracks by Guild Example ===');

const anotherGuildId = '555555555555555555';
const anotherGuildTrack = encoder.createDiscordYouTubeTrack(
  'kJQP7kiw5Fk',
  'Luis Fonsi - Despacito ft. Daddy Yankee',
  'Luis Fonsi',
  281,
  requester,
  anotherGuildId,
  channelId
);

const allTracksWithGuilds = [...allTracks, anotherGuildTrack];
const guildTracks = encoder.filterTracksByGuild(allTracksWithGuilds, guildId);

console.log('All tracks:', allTracksWithGuilds.length);
console.log('Guild tracks:', guildTracks.length);

// Example 5: Get track statistics for a user
console.log('\n=== Track Statistics Example ===');

const stats = encoder.getTrackStats(allTracks, requester.id);
console.log('User stats:', stats);

// Example 6: Create a Spotify track
console.log('\n=== Spotify Track Example ===');

const spotifyTrack = encoder.createDiscordSpotifyTrack(
  '4iV5W9uYEdYUVa79Axb7Rh',
  'Never Gonna Give You Up',
  'Rick Astley',
  212000, // Duration in milliseconds
  requester,
  guildId,
  channelId,
  {
    artworkUrl: 'https://i.scdn.co/image/ab67616d0000b273c8a11e48c91a982d086afc69',
  }
);

console.log('Spotify track:', spotifyTrack);

// Example 7: Create a SoundCloud track
console.log('\n=== SoundCloud Track Example ===');

const soundcloudTrack = encoder.createDiscordSoundCloudTrack(
  'rick-astley/never-gonna-give-you-up',
  'Never Gonna Give You Up',
  'Rick Astley',
  212000, // Duration in milliseconds
  requester,
  guildId,
  channelId
);

console.log('SoundCloud track:', soundcloudTrack);

// Example 8: Create a mixed source playlist
console.log('\n=== Mixed Source Playlist Example ===');

const mixedTracks = [
  encoder.createDiscordYouTubeTrack(
    'dQw4w9WgXcQ',
    'Never Gonna Give You Up',
    'Rick Astley',
    212,
    requester,
    guildId,
    channelId
  ),
  encoder.createDiscordSpotifyTrack(
    '4iV5W9uYEdYUVa79Axb7Rh',
    'Never Gonna Give You Up',
    'Rick Astley',
    212000,
    requester,
    guildId,
    channelId
  ),
  encoder.createDiscordSoundCloudTrack(
    'rick-astley/never-gonna-give-you-up',
    'Never Gonna Give You Up',
    'Rick Astley',
    212000,
    requester,
    guildId,
    channelId
  ),
];

const mixedPlaylist = encoder.encodeDiscordPlaylist(
  { name: 'Mixed Source Playlist', selectedTrack: 0 },
  mixedTracks.map(track => ({ track: track.track, info: track.info })),
  requester,
  guildId,
  channelId
);

console.log('Mixed playlist:', mixedPlaylist.info);
console.log('Number of tracks:', mixedPlaylist.tracks.length);

// Example 9: Update encoder options
console.log('\n=== Update Options Example ===');

encoder.updateOptions({
  includeArtwork: false,
  maxTracks: 500,
  sourceName: 'custom',
});

console.log('Updated options:', encoder.getOptions());
