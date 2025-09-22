# ryxu-xo-lavalink-encoder

A comprehensive track and playlist encoder for Lavalink clients with Discord music bot support. This package provides easy-to-use utilities for encoding and managing audio tracks and playlists in a format compatible with Lavalink servers.

## Features

- 🎵 **Track Encoding**: Encode individual tracks with full metadata support
- 📋 **Playlist Management**: Create and manage playlists with multiple tracks
- 🤖 **Discord Integration**: Built-in support for Discord music bots with user and guild tracking
- 🔧 **Multiple Sources**: Support for YouTube, Spotify, SoundCloud, and custom sources
- 📦 **Package Manager Support**: Compatible with npm, yarn, and bun
- 🎯 **TypeScript**: Full TypeScript support with comprehensive type definitions
- 🛠️ **Utility Functions**: Helper functions for duration formatting, URL parsing, and more

## Installation

### npm
```bash
npm install ryxu-xo-lavalink-encoder
```

### yarn
```bash
yarn add ryxu-xo-lavalink-encoder
```

### bun
```bash
bun add ryxu-xo-lavalink-encoder
```

## Quick Start

### Basic Usage

```typescript
import { LavalinkEncoder, TrackInfo } from 'ryxu-xo-lavalink-encoder';

// Initialize the encoder
const encoder = new LavalinkEncoder();

// Create a track
const track = encoder.createYouTubeTrack(
  'dQw4w9WgXcQ',
  'Never Gonna Give You Up',
  'Rick Astley',
  212 // Duration in seconds
);

console.log('Encoded track:', track.track);
console.log('Track info:', track.info);
```

### Discord Bot Usage

```typescript
import { LavalinkEncoder } from 'ryxu-xo-lavalink-encoder';

const encoder = new LavalinkEncoder();

// Create a Discord track with user information
const discordTrack = encoder.createDiscordYouTubeTrack(
  'dQw4w9WgXcQ',
  'Never Gonna Give You Up',
  'Rick Astley',
  212,
  {
    id: '123456789012345678',
    username: 'MusicLover',
    discriminator: '1234'
  },
  '987654321098765432', // Guild ID
  '111111111111111111'  // Channel ID
);

console.log('Requester:', encoder.getRequester(discordTrack));
```

### Decoding Tracks

```typescript
import { LavalinkEncoder } from 'ryxu-xo-lavalink-encoder';

const encoder = new LavalinkEncoder();

// Create and encode a track
const track = encoder.createYouTubeTrack(
  'dQw4w9WgXcQ',
  'Never Gonna Give You Up',
  'Rick Astley',
  212
);

// Decode the track back to track info
const decodedTrack = encoder.decodeTrack(track.track);
console.log('Decoded track:', decodedTrack);

// Batch decode multiple tracks
import { decodeMultipleTracks, validateDecodedTrack } from 'ryxu-xo-lavalink-encoder/utils';

const encodedTracks = [track.track, anotherTrack.track];
const results = decodeMultipleTracks(encodedTracks, encoder.decodeTrack.bind(encoder));

results.forEach((result, index) => {
  if (result.success) {
    console.log(`Track ${index + 1}:`, result.track);
  } else {
    console.log(`Track ${index + 1} failed:`, result.error);
  }
});
```

## API Reference

### LavalinkEncoder

The main encoder class that combines all functionality.

#### Constructor

```typescript
new LavalinkEncoder(options?: EncoderOptions & PlaylistEncoderOptions)
```

#### Track Methods

- `encodeTrack(trackInfo: TrackInfo): LavalinkTrack` - Encode track info to Lavalink format
- `decodeTrack(encodedTrack: string): TrackInfo` - Decode Lavalink track string back to track info
- `createTrack(identifier, title, author, length, uri, additionalInfo?): LavalinkTrack`
- `createYouTubeTrack(videoId, title, author, duration, additionalInfo?): LavalinkTrack`
- `createSpotifyTrack(trackId, title, author, duration, additionalInfo?): LavalinkTrack`
- `createSoundCloudTrack(trackId, title, author, duration, additionalInfo?): LavalinkTrack`

#### Playlist Methods

- `encodePlaylist(playlistInfo, tracks): LavalinkPlaylist`
- `createPlaylist(name, trackInfos, selectedTrack?): LavalinkPlaylist`
- `createYouTubePlaylist(playlistId, name, videoData, selectedTrack?): LavalinkPlaylist`
- `createSpotifyPlaylist(playlistId, name, trackData, selectedTrack?): LavalinkPlaylist`
- `createSoundCloudPlaylist(playlistId, name, trackData, selectedTrack?): LavalinkPlaylist`
- `mergePlaylists(playlists, newName?): LavalinkPlaylist`
- `splitPlaylist(playlist, chunkSize): LavalinkPlaylist[]`

#### Discord Methods

- `encodeDiscordTrack(trackInfo, requester, guildId, channelId): DiscordTrack`
- `encodeDiscordPlaylist(playlistInfo, tracks, requester, guildId, channelId): DiscordPlaylist`
- `createDiscordYouTubeTrack(...): DiscordTrack`
- `createDiscordSpotifyTrack(...): DiscordTrack`
- `createDiscordSoundCloudTrack(...): DiscordTrack`
- `createDiscordYouTubePlaylist(...): DiscordPlaylist`
- `createDiscordSpotifyPlaylist(...): DiscordPlaylist`
- `getRequester(track): RequesterInfo | null`
- `getGuildInfo(track): GuildInfo | null`
- `filterTracksByRequester(tracks, requesterId): DiscordTrack[]`
- `filterTracksByGuild(tracks, guildId): DiscordTrack[]`
- `getTrackStats(tracks, requesterId): TrackStats`

### Utility Functions

```typescript
import { 
  formatDuration, 
  formatDurationFromSeconds,
  secondsToMilliseconds,
  millisecondsToSeconds,
  isValidUrl,
  extractYouTubeVideoId,
  extractSpotifyTrackId,
  extractSoundCloudTrackId,
  detectTrackSource,
  createSearchResult,
  createTrackSearchResult,
  createPlaylistSearchResult,
  createNoMatchesResult,
  createLoadFailedResult,
  calculateTotalDuration,
  calculatePlaylistDuration,
  sortTracksByDuration,
  sortTracksByTitle,
  sortTracksByAuthor,
  filterTracksBySource,
  filterTracksByDuration,
  filterTracksByAuthor,
  searchTracksByTitle,
  getUniqueAuthors,
  getUniqueSources,
  createTrackSummary,
  createPlaylistSummary,
  validateTrackInfo,
  sanitizeTrackTitle,
  sanitizeAuthorName,
  // Decoding utilities
  decodeMultipleTracks,
  validateDecodedTrack,
  extractTrackMetadata,
  compareTracks,
  findTracksByCriteria,
  groupTracksBySource,
  groupTracksByAuthor,
  createTrackCollectionSummary
} from 'ryxu-xo-lavalink-encoder/utils';
```

## Types

### TrackInfo

```typescript
interface TrackInfo {
  identifier: string;
  isSeekable: boolean;
  author: string;
  length: number;
  isStream: boolean;
  position: number;
  title: string;
  uri: string;
  sourceName: string;
  artworkUrl?: string;
  isrc?: string;
}
```

### DiscordTrackInfo

```typescript
interface DiscordTrackInfo extends TrackInfo {
  requester?: {
    id: string;
    username: string;
    discriminator?: string;
  };
  guildId?: string;
  channelId?: string;
}
```

### PlaylistInfo

```typescript
interface PlaylistInfo {
  name: string;
  selectedTrack: number;
}
```

## Examples

### Creating a YouTube Playlist

```typescript
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
];

const playlist = encoder.createYouTubePlaylist(
  'PLrAXtmRdnEQy6nuLMOVuF4K4FQ4F2hVjA',
  'Viral Hits',
  playlistData,
  0
);
```

### Filtering and Statistics

```typescript
// Filter tracks by requester
const userTracks = encoder.filterTracksByRequester(allTracks, '123456789012345678');

// Get user statistics
const stats = encoder.getTrackStats(allTracks, '123456789012345678');
console.log(`User has ${stats.totalTracks} tracks totaling ${formatDuration(stats.totalDuration)}`);

// Filter by source
const youtubeTracks = filterTracksBySource(allTracks, 'youtube');
```

### Utility Usage

```typescript
import { formatDuration, calculateTotalDuration, createTrackSummary } from 'ryxu-xo-lavalink-encoder/utils';

// Format duration
console.log(formatDuration(212000)); // "3:32"

// Calculate total duration
const totalDuration = calculateTotalDuration(playlist.tracks);
console.log(formatDuration(totalDuration));

// Create track summary
console.log(createTrackSummary(track)); // "Never Gonna Give You Up by Rick Astley (3:32)"
```

### Decoding and Analysis

```typescript
import { 
  decodeMultipleTracks, 
  validateDecodedTrack, 
  extractTrackMetadata,
  findTracksByCriteria,
  groupTracksBySource,
  createTrackCollectionSummary 
} from 'ryxu-xo-lavalink-encoder/utils';

// Decode and validate tracks
const encodedTracks = [track1.track, track2.track, track3.track];
const decodedResults = decodeMultipleTracks(encodedTracks, encoder.decodeTrack.bind(encoder));

// Validate each decoded track
decodedResults.forEach((result, index) => {
  if (result.success) {
    const validation = validateDecodedTrack(result.track);
    if (validation.valid) {
      console.log(`Track ${index + 1} is valid:`, extractTrackMetadata(result.track));
    } else {
      console.log(`Track ${index + 1} validation failed:`, validation.errors);
    }
  }
});

// Find tracks by criteria
const allDecodedTracks = decodedResults
  .filter(r => r.success)
  .map(r => r.track);

const youtubeTracks = findTracksByCriteria(allDecodedTracks, { source: 'youtube' });
const longTracks = findTracksByCriteria(allDecodedTracks, { minDuration: 300000 }); // 5+ minutes

// Group and analyze tracks
const tracksBySource = groupTracksBySource(allDecodedTracks);
const collectionSummary = createTrackCollectionSummary(allDecodedTracks);

console.log('Tracks by source:', tracksBySource);
console.log('Collection summary:', collectionSummary);
```

## Configuration

### EncoderOptions

```typescript
interface EncoderOptions {
  includeArtwork?: boolean;    // Include artwork URLs (default: true)
  includeISRC?: boolean;       // Include ISRC codes (default: true)
  sourceName?: string;         // Default source name (default: 'unknown')
  validate?: boolean;          // Validate track data (default: true)
}
```

### PlaylistEncoderOptions

```typescript
interface PlaylistEncoderOptions extends EncoderOptions {
  maxTracks?: number;          // Maximum tracks in playlist (default: 1000)
  includeMetadata?: boolean;   // Include playlist metadata (default: true)
}
```

## Error Handling

The encoder includes comprehensive error handling and validation:

```typescript
try {
  const track = encoder.createTrack('', 'Title', 'Author', 1000, 'invalid-url');
} catch (error) {
  console.error('Validation error:', error.message);
}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please open an issue on the GitHub repository.
