/**
 * Utility functions for Lavalink track and playlist encoding
 */

import { TrackInfo, LavalinkTrack, LavalinkPlaylist, SearchResult } from '../types';

/**
 * Formats duration from milliseconds to human-readable string
 */
export function formatDuration(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}:${(minutes % 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  }
}

/**
 * Formats duration from seconds to human-readable string
 */
export function formatDurationFromSeconds(seconds: number): string {
  return formatDuration(seconds * 1000);
}

/**
 * Converts duration from seconds to milliseconds
 */
export function secondsToMilliseconds(seconds: number): number {
  return seconds * 1000;
}

/**
 * Converts duration from milliseconds to seconds
 */
export function millisecondsToSeconds(milliseconds: number): number {
  return Math.floor(milliseconds / 1000);
}

/**
 * Validates if a URL is valid
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Extracts video ID from YouTube URL
 */
export function extractYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
}

/**
 * Extracts track ID from Spotify URL
 */
export function extractSpotifyTrackId(url: string): string | null {
  const pattern = /spotify\.com\/track\/([a-zA-Z0-9]+)/;
  const match = url.match(pattern);
  return match ? match[1] : null;
}

/**
 * Extracts track ID from SoundCloud URL
 */
export function extractSoundCloudTrackId(url: string): string | null {
  const pattern = /soundcloud\.com\/([^\/]+)\/([^\/\?]+)/;
  const match = url.match(pattern);
  return match ? `${match[1]}/${match[2]}` : null;
}

/**
 * Detects the source of a track from its URI
 */
export function detectTrackSource(uri: string): string {
  if (uri.includes('youtube.com') || uri.includes('youtu.be')) {
    return 'youtube';
  } else if (uri.includes('spotify.com')) {
    return 'spotify';
  } else if (uri.includes('soundcloud.com')) {
    return 'soundcloud';
  } else if (uri.includes('twitch.tv')) {
    return 'twitch';
  } else if (uri.includes('bandcamp.com')) {
    return 'bandcamp';
  } else {
    return 'unknown';
  }
}

/**
 * Creates a search result from tracks
 */
export function createSearchResult(
  tracks: LavalinkTrack[],
  loadType: SearchResult['loadType'] = 'SEARCH_RESULT',
  playlistInfo?: { name: string; selectedTrack: number }
): SearchResult {
  return {
    loadType,
    tracks,
    ...(playlistInfo && { playlistInfo }),
  };
}

/**
 * Creates a search result for a single track
 */
export function createTrackSearchResult(track: LavalinkTrack): SearchResult {
  return createSearchResult([track], 'TRACK_LOADED');
}

/**
 * Creates a search result for a playlist
 */
export function createPlaylistSearchResult(
  playlist: LavalinkPlaylist
): SearchResult {
  return createSearchResult(
    playlist.tracks,
    'PLAYLIST_LOADED',
    playlist.info
  );
}

/**
 * Creates a no matches search result
 */
export function createNoMatchesResult(): SearchResult {
  return createSearchResult([], 'NO_MATCHES');
}

/**
 * Creates a load failed search result
 */
export function createLoadFailedResult(
  message: string,
  severity: 'COMMON' | 'SUSPICIOUS' | 'FAULT' = 'COMMON'
): SearchResult {
  return {
    loadType: 'LOAD_FAILED',
    tracks: [],
    exception: { message, severity },
  };
}

/**
 * Calculates total duration of tracks
 */
export function calculateTotalDuration(tracks: LavalinkTrack[]): number {
  return tracks.reduce((total, track) => total + track.info.length, 0);
}

/**
 * Calculates total duration of a playlist
 */
export function calculatePlaylistDuration(playlist: LavalinkPlaylist): number {
  return calculateTotalDuration(playlist.tracks);
}

/**
 * Sorts tracks by duration
 */
export function sortTracksByDuration(
  tracks: LavalinkTrack[],
  ascending: boolean = true
): LavalinkTrack[] {
  return [...tracks].sort((a, b) => {
    const comparison = a.info.length - b.info.length;
    return ascending ? comparison : -comparison;
  });
}

/**
 * Sorts tracks by title
 */
export function sortTracksByTitle(
  tracks: LavalinkTrack[],
  ascending: boolean = true
): LavalinkTrack[] {
  return [...tracks].sort((a, b) => {
    const comparison = a.info.title.localeCompare(b.info.title);
    return ascending ? comparison : -comparison;
  });
}

/**
 * Sorts tracks by author
 */
export function sortTracksByAuthor(
  tracks: LavalinkTrack[],
  ascending: boolean = true
): LavalinkTrack[] {
  return [...tracks].sort((a, b) => {
    const comparison = a.info.author.localeCompare(b.info.author);
    return ascending ? comparison : -comparison;
  });
}

/**
 * Filters tracks by source
 */
export function filterTracksBySource(
  tracks: LavalinkTrack[],
  source: string
): LavalinkTrack[] {
  return tracks.filter(track => track.info.sourceName === source);
}

/**
 * Filters tracks by duration range
 */
export function filterTracksByDuration(
  tracks: LavalinkTrack[],
  minDuration: number,
  maxDuration: number
): LavalinkTrack[] {
  return tracks.filter(
    track => track.info.length >= minDuration && track.info.length <= maxDuration
  );
}

/**
 * Filters tracks by author
 */
export function filterTracksByAuthor(
  tracks: LavalinkTrack[],
  author: string
): LavalinkTrack[] {
  return tracks.filter(track => 
    track.info.author.toLowerCase().includes(author.toLowerCase())
  );
}

/**
 * Searches tracks by title
 */
export function searchTracksByTitle(
  tracks: LavalinkTrack[],
  query: string
): LavalinkTrack[] {
  const lowerQuery = query.toLowerCase();
  return tracks.filter(track => 
    track.info.title.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Gets unique authors from tracks
 */
export function getUniqueAuthors(tracks: LavalinkTrack[]): string[] {
  const authors = new Set(tracks.map(track => track.info.author));
  return Array.from(authors);
}

/**
 * Gets unique sources from tracks
 */
export function getUniqueSources(tracks: LavalinkTrack[]): string[] {
  const sources = new Set(tracks.map(track => track.info.sourceName));
  return Array.from(sources);
}

/**
 * Creates a track summary
 */
export function createTrackSummary(track: LavalinkTrack): string {
  const duration = formatDuration(track.info.length);
  return `${track.info.title} by ${track.info.author} (${duration})`;
}

/**
 * Creates a playlist summary
 */
export function createPlaylistSummary(playlist: LavalinkPlaylist): string {
  const totalDuration = formatDuration(calculatePlaylistDuration(playlist));
  const trackCount = playlist.tracks.length;
  return `${playlist.info.name} - ${trackCount} tracks (${totalDuration})`;
}

/**
 * Validates track information
 */
export function validateTrackInfo(trackInfo: TrackInfo): string[] {
  const errors: string[] = [];

  if (!trackInfo.identifier) {
    errors.push('Track identifier is required');
  }
  if (!trackInfo.title) {
    errors.push('Track title is required');
  }
  if (!trackInfo.author) {
    errors.push('Track author is required');
  }
  if (typeof trackInfo.length !== 'number' || trackInfo.length < 0) {
    errors.push('Track length must be a non-negative number');
  }
  if (!trackInfo.uri) {
    errors.push('Track URI is required');
  }
  if (!isValidUrl(trackInfo.uri)) {
    errors.push('Track URI must be a valid URL');
  }

  return errors;
}

/**
 * Sanitizes track title for display
 */
export function sanitizeTrackTitle(title: string, maxLength: number = 100): string {
  if (title.length <= maxLength) {
    return title;
  }
  return title.substring(0, maxLength - 3) + '...';
}

/**
 * Sanitizes author name for display
 */
export function sanitizeAuthorName(author: string, maxLength: number = 50): string {
  if (author.length <= maxLength) {
    return author;
  }
  return author.substring(0, maxLength - 3) + '...';
}

/**
 * Decodes multiple tracks at once
 */
export function decodeMultipleTracks(
  encodedTracks: string[],
  decoder: (encoded: string) => any
): Array<{ success: true; track: any } | { success: false; error: string; index: number }> {
  return encodedTracks.map((encodedTrack, index) => {
    try {
      const decoded = decoder(encodedTrack);
      return { success: true as const, track: decoded };
    } catch (error) {
      return { 
        success: false as const, 
        error: error instanceof Error ? error.message : 'Unknown error',
        index 
      };
    }
  });
}

/**
 * Validates decoded track data
 */
export function validateDecodedTrack(track: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!track) {
    errors.push('Track is null or undefined');
    return { valid: false, errors };
  }

  if (!track.identifier) errors.push('Missing identifier');
  if (!track.title) errors.push('Missing title');
  if (!track.author) errors.push('Missing author');
  if (typeof track.length !== 'number' || track.length < 0) {
    errors.push('Invalid length (must be non-negative number)');
  }
  if (!track.uri) errors.push('Missing URI');
  if (!track.sourceName) errors.push('Missing source name');
  if (typeof track.isSeekable !== 'boolean') errors.push('isSeekable must be boolean');
  if (typeof track.isStream !== 'boolean') errors.push('isStream must be boolean');
  if (typeof track.position !== 'number' || track.position < 0) {
    errors.push('Invalid position (must be non-negative number)');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Extracts track metadata from decoded track
 */
export function extractTrackMetadata(track: any): {
  basic: {
    title: string;
    author: string;
    duration: string;
    source: string;
  };
  technical: {
    identifier: string;
    uri: string;
    isSeekable: boolean;
    isStream: boolean;
    position: number;
  };
  optional: {
    artworkUrl?: string;
    isrc?: string;
  };
} {
  return {
    basic: {
      title: track.title || 'Unknown Title',
      author: track.author || 'Unknown Artist',
      duration: formatDuration(track.length || 0),
      source: track.sourceName || 'unknown',
    },
    technical: {
      identifier: track.identifier || '',
      uri: track.uri || '',
      isSeekable: Boolean(track.isSeekable),
      isStream: Boolean(track.isStream),
      position: Number(track.position) || 0,
    },
    optional: {
      artworkUrl: track.artworkUrl,
      isrc: track.isrc,
    },
  };
}

/**
 * Compares two decoded tracks for equality
 */
export function compareTracks(track1: any, track2: any): boolean {
  const fields = ['identifier', 'title', 'author', 'length', 'uri', 'sourceName'];
  return fields.every(field => track1[field] === track2[field]);
}

/**
 * Finds tracks by criteria in decoded track array
 */
export function findTracksByCriteria(
  tracks: any[],
  criteria: {
    title?: string;
    author?: string;
    source?: string;
    minDuration?: number;
    maxDuration?: number;
  }
): any[] {
  return tracks.filter(track => {
    if (criteria.title && !track.title?.toLowerCase().includes(criteria.title.toLowerCase())) {
      return false;
    }
    if (criteria.author && !track.author?.toLowerCase().includes(criteria.author.toLowerCase())) {
      return false;
    }
    if (criteria.source && track.sourceName !== criteria.source) {
      return false;
    }
    if (criteria.minDuration !== undefined && track.length < criteria.minDuration) {
      return false;
    }
    if (criteria.maxDuration !== undefined && track.length > criteria.maxDuration) {
      return false;
    }
    return true;
  });
}

/**
 * Groups decoded tracks by source
 */
export function groupTracksBySource(tracks: any[]): Record<string, any[]> {
  return tracks.reduce((groups, track) => {
    const source = track.sourceName || 'unknown';
    if (!groups[source]) {
      groups[source] = [];
    }
    groups[source].push(track);
    return groups;
  }, {} as Record<string, any[]>);
}

/**
 * Groups decoded tracks by author
 */
export function groupTracksByAuthor(tracks: any[]): Record<string, any[]> {
  return tracks.reduce((groups, track) => {
    const author = track.author || 'Unknown Artist';
    if (!groups[author]) {
      groups[author] = [];
    }
    groups[author].push(track);
    return groups;
  }, {} as Record<string, any[]>);
}

/**
 * Creates a summary of decoded track collection
 */
export function createTrackCollectionSummary(tracks: any[]): {
  totalTracks: number;
  totalDuration: number;
  sources: Record<string, number>;
  authors: Record<string, number>;
  averageDuration: number;
  longestTrack: any | null;
  shortestTrack: any | null;
} {
  if (tracks.length === 0) {
    return {
      totalTracks: 0,
      totalDuration: 0,
      sources: {},
      authors: {},
      averageDuration: 0,
      longestTrack: null,
      shortestTrack: null,
    };
  }

  const totalDuration = tracks.reduce((sum, track) => sum + (track.length || 0), 0);
  const sources = groupTracksBySource(tracks);
  const authors = groupTracksByAuthor(tracks);
  
  const sourceCounts = Object.keys(sources).reduce((acc, source) => {
    acc[source] = sources[source].length;
    return acc;
  }, {} as Record<string, number>);

  const authorCounts = Object.keys(authors).reduce((acc, author) => {
    acc[author] = authors[author].length;
    return acc;
  }, {} as Record<string, number>);

  const sortedByDuration = [...tracks].sort((a, b) => (a.length || 0) - (b.length || 0));
  const longestTrack = sortedByDuration[sortedByDuration.length - 1];
  const shortestTrack = sortedByDuration[0];

  return {
    totalTracks: tracks.length,
    totalDuration,
    sources: sourceCounts,
    authors: authorCounts,
    averageDuration: totalDuration / tracks.length,
    longestTrack: longestTrack.length > 0 ? longestTrack : null,
    shortestTrack: shortestTrack.length > 0 ? shortestTrack : null,
  };
}
