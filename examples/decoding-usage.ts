/**
 * Decoding usage examples for RYXU XO Lavalink Encoder
 */

import { LavalinkEncoder, TrackInfo, LavalinkTrack, LavalinkPlaylist } from '../src';
import { formatDuration, createTrackSummary } from '../src/utils';

// Initialize the encoder
const encoder = new LavalinkEncoder();

console.log('=== Track Decoding Examples ===\n');

// Example 1: Encode and then decode a track
console.log('1. Basic Encode/Decode Cycle:');

const originalTrackInfo: TrackInfo = {
  identifier: 'dQw4w9WgXcQ',
  title: 'Never Gonna Give You Up',
  author: 'Rick Astley',
  length: 212000, // 3 minutes 32 seconds
  uri: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  isSeekable: true,
  isStream: false,
  position: 0,
  sourceName: 'youtube',
  artworkUrl: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
  isrc: 'GBUM71202978',
};

// Encode the track
const encodedTrack = encoder.encodeTrack(originalTrackInfo);
console.log('Encoded track string:', encodedTrack.track.substring(0, 50) + '...');
console.log('Original track info:', originalTrackInfo);

// Decode the track
const decodedTrackInfo = encoder.decodeTrack(encodedTrack.track);
console.log('Decoded track info:', decodedTrackInfo);
console.log('Are they equal?', JSON.stringify(originalTrackInfo) === JSON.stringify(decodedTrackInfo));

// Example 2: Decode a track from a different source
console.log('\n2. Decoding Different Source Tracks:');

// YouTube track
const youtubeTrack = encoder.createYouTubeTrack(
  '9bZkp7q19f0',
  'PSY - GANGNAM STYLE',
  'officialpsy',
  252 // Duration in seconds
);
console.log('YouTube track created:', createTrackSummary(youtubeTrack));

const decodedYouTube = encoder.decodeTrack(youtubeTrack.track);
console.log('Decoded YouTube track:', decodedYouTube);

// Spotify track
const spotifyTrack = encoder.createSpotifyTrack(
  '4iV5W9uYEdYUVa79Axb7Rh',
  'Never Gonna Give You Up',
  'Rick Astley',
  212000 // Duration in milliseconds
);
console.log('Spotify track created:', createTrackSummary(spotifyTrack));

const decodedSpotify = encoder.decodeTrack(spotifyTrack.track);
console.log('Decoded Spotify track:', decodedSpotify);

// SoundCloud track
const soundcloudTrack = encoder.createSoundCloudTrack(
  'rick-astley/never-gonna-give-you-up',
  'Never Gonna Give You Up',
  'Rick Astley',
  212000 // Duration in milliseconds
);
console.log('SoundCloud track created:', createTrackSummary(soundcloudTrack));

const decodedSoundCloud = encoder.decodeTrack(soundcloudTrack.track);
console.log('Decoded SoundCloud track:', decodedSoundCloud);

// Example 3: Decode playlist tracks
console.log('\n3. Decoding Playlist Tracks:');

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

const playlist = encoder.createYouTubePlaylist(
  'PLrAXtmRdnEQy6nuLMOVuF4K4FQ4F2hVjA',
  'Viral Music Hits',
  playlistData,
  0
);

console.log('Playlist created with', playlist.tracks.length, 'tracks');

// Decode all tracks in the playlist
playlist.tracks.forEach((track, index) => {
  if (track.track) {
    const decodedTrack = encoder.decodeTrack(track.track);
    console.log(`Track ${index + 1}:`, createTrackSummary({ track: track.track, info: decodedTrack }));
  } else {
    console.log(`Track ${index + 1}: No encoded track data available`);
  }
});

// Example 4: Error handling for invalid encoded tracks
console.log('\n4. Error Handling for Invalid Encoded Tracks:');

try {
  const invalidTrack = encoder.decodeTrack('invalid-base64-string');
  console.log('This should not print:', invalidTrack);
} catch (error) {
  console.log('Caught expected error:', error instanceof Error ? error.message : 'Unknown error');
}

try {
  const invalidJson = encoder.decodeTrack('dGVzdA=='); // "test" in base64
  console.log('This should not print:', invalidJson);
} catch (error) {
  console.log('Caught expected error:', error instanceof Error ? error.message : 'Unknown error');
}

// Example 5: Decode with different encoder options
console.log('\n5. Decoding with Different Encoder Options:');

// Create encoder with different options
const customEncoder = new LavalinkEncoder({
  includeArtwork: false,
  includeISRC: false,
  sourceName: 'custom',
  validate: false,
});

const customTrack = customEncoder.createTrack(
  'custom123',
  'Custom Track',
  'Custom Artist',
  180000, // 3 minutes
  'https://example.com/track/custom123'
);

console.log('Custom track created:', createTrackSummary(customTrack));

const decodedCustom = customEncoder.decodeTrack(customTrack.track);
console.log('Decoded custom track:', decodedCustom);

// Example 6: Batch decoding multiple tracks
console.log('\n6. Batch Decoding Multiple Tracks:');

const tracksToDecode = [
  youtubeTrack.track,
  spotifyTrack.track,
  soundcloudTrack.track,
  customTrack.track,
];

const decodedTracks = tracksToDecode.map((encodedTrack, index) => {
  try {
    const decoded = encoder.decodeTrack(encodedTrack);
    return { index, success: true, track: decoded };
  } catch (error) {
    return { 
      index, 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
});

console.log('Batch decoding results:');
decodedTracks.forEach(result => {
  if (result.success && result.track) {
    console.log(`Track ${result.index + 1}:`, createTrackSummary({ track: '', info: result.track }));
  } else {
    console.log(`Track ${result.index + 1}: Failed - ${result.success ? 'No track data' : result.error}`);
  }
});

// Example 7: Decode and validate track data
console.log('\n7. Decode and Validate Track Data:');

const trackToValidate = encoder.createYouTubeTrack(
  'kJQP7kiw5Fk',
  'Luis Fonsi - Despacito ft. Daddy Yankee',
  'Luis Fonsi',
  281
);

const decodedTrack = encoder.decodeTrack(trackToValidate.track);

// Validate the decoded track
const validationErrors = [];
if (!decodedTrack.identifier) validationErrors.push('Missing identifier');
if (!decodedTrack.title) validationErrors.push('Missing title');
if (!decodedTrack.author) validationErrors.push('Missing author');
if (decodedTrack.length <= 0) validationErrors.push('Invalid length');
if (!decodedTrack.uri) validationErrors.push('Missing URI');
if (!decodedTrack.sourceName) validationErrors.push('Missing source name');

if (validationErrors.length === 0) {
  console.log('✅ Track validation passed:', createTrackSummary({ track: '', info: decodedTrack }));
} else {
  console.log('❌ Track validation failed:', validationErrors);
}

// Example 8: Decode and extract specific information
console.log('\n8. Extract Specific Information from Decoded Track:');

const complexTrack = encoder.createYouTubeTrack(
  'dQw4w9WgXcQ',
  'Never Gonna Give You Up',
  'Rick Astley',
  212,
  {
    artworkUrl: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    isrc: 'GBUM71202978',
  }
);

const decodedComplexTrack = encoder.decodeTrack(complexTrack.track);

console.log('Track Details:');
console.log('- Title:', decodedComplexTrack.title);
console.log('- Author:', decodedComplexTrack.author);
console.log('- Duration:', formatDuration(decodedComplexTrack.length));
console.log('- Source:', decodedComplexTrack.sourceName);
console.log('- Seekable:', decodedComplexTrack.isSeekable ? 'Yes' : 'No');
console.log('- Stream:', decodedComplexTrack.isStream ? 'Yes' : 'No');
console.log('- Artwork:', decodedComplexTrack.artworkUrl || 'None');
console.log('- ISRC:', decodedComplexTrack.isrc || 'None');
console.log('- URI:', decodedComplexTrack.uri);

console.log('\n=== Decoding Examples Complete ===');
