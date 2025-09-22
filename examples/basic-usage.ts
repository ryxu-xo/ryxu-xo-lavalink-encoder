/**
 * Basic usage examples for RYXU XO Lavalink Encoder
 */

import { LavalinkEncoder, TrackInfo } from '../src';

// Initialize the encoder
const encoder = new LavalinkEncoder({
  includeArtwork: true,
  includeISRC: true,
  sourceName: 'youtube',
  validate: true,
  maxTracks: 1000,
});

// Example 1: Create a single track
console.log('=== Single Track Example ===');

const trackInfo: TrackInfo = {
  identifier: 'dQw4w9WgXcQ',
  title: 'Never Gonna Give You Up',
  author: 'Rick Astley',
  length: 212000, // 3 minutes 32 seconds in milliseconds
  uri: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  isSeekable: true,
  isStream: false,
  position: 0,
  sourceName: 'youtube',
  artworkUrl: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
};

const encodedTrack = encoder.encodeTrack(trackInfo);
console.log('Encoded track:', encodedTrack.track);
console.log('Track info:', encodedTrack.info);

// Example 2: Create a YouTube track using helper method
console.log('\n=== YouTube Track Example ===');

const youtubeTrack = encoder.createYouTubeTrack(
  'dQw4w9WgXcQ',
  'Never Gonna Give You Up',
  'Rick Astley',
  212, // Duration in seconds
  {
    artworkUrl: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
  }
);

console.log('YouTube track:', youtubeTrack);

// Example 3: Create a playlist
console.log('\n=== Playlist Example ===');

const playlistTracks: TrackInfo[] = [
  {
    identifier: 'dQw4w9WgXcQ',
    title: 'Never Gonna Give You Up',
    author: 'Rick Astley',
    length: 212000,
    uri: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    isSeekable: true,
    isStream: false,
    position: 0,
    sourceName: 'youtube',
  },
  {
    identifier: '9bZkp7q19f0',
    title: 'PSY - GANGNAM STYLE',
    author: 'officialpsy',
    length: 252000,
    uri: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
    isSeekable: true,
    isStream: false,
    position: 0,
    sourceName: 'youtube',
  },
];

const playlist = encoder.createPlaylist('My Awesome Playlist', playlistTracks, 0);
console.log('Playlist:', playlist.info);
console.log('Number of tracks:', playlist.tracks.length);

// Example 4: Create a YouTube playlist using helper method
console.log('\n=== YouTube Playlist Example ===');

const youtubePlaylistData = [
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
];

const youtubePlaylist = encoder.createYouTubePlaylist(
  'PLrAXtmRdnEQy6nuLMOVuF4K4FQ4F2hVjA',
  'Viral Hits',
  youtubePlaylistData,
  0
);

console.log('YouTube playlist:', youtubePlaylist.info);
console.log('Number of tracks:', youtubePlaylist.tracks.length);

// Example 5: Decode a track
console.log('\n=== Decode Track Example ===');

const decodedTrack = encoder.decodeTrack(encodedTrack.track);
console.log('Decoded track info:', decodedTrack);

// Example 6: Utility functions
console.log('\n=== Utility Functions Example ===');

import { formatDuration, calculateTotalDuration, createTrackSummary } from '../src/utils';

console.log('Formatted duration:', formatDuration(212000)); // 3:32
console.log('Total playlist duration:', formatDuration(calculateTotalDuration(playlist.tracks)));
console.log('Track summary:', createTrackSummary(youtubeTrack));
