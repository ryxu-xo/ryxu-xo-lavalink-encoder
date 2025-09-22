/**
 * Core types for Lavalink track and playlist encoding
 */

export interface TrackInfo {
  /** The track identifier */
  identifier: string;
  /** Whether the track is seekable */
  isSeekable: boolean;
  /** The track author */
  author: string;
  /** The track length in milliseconds */
  length: number;
  /** Whether the track is a stream */
  isStream: boolean;
  /** The track position in milliseconds */
  position: number;
  /** The track title */
  title: string;
  /** The track URI */
  uri: string;
  /** The track source name */
  sourceName: string;
  /** The track artwork URL */
  artworkUrl?: string;
  /** The track ISRC */
  isrc?: string;
}

export interface Track {
  /** The encoded track string */
  track: string;
  /** The track info */
  info: TrackInfo;
}

export interface PlaylistInfo {
  /** The playlist name */
  name: string;
  /** The playlist selected track index */
  selectedTrack: number;
}

export interface Playlist {
  /** The playlist info */
  info: PlaylistInfo;
  /** The playlist plugin info */
  pluginInfo: Record<string, any>;
  /** The playlist tracks */
  tracks: Track[];
}

export interface LavalinkTrack {
  /** The encoded track string */
  track: string;
  /** The track info */
  info: TrackInfo;
}

export interface LavalinkPlaylist {
  /** The playlist info */
  info: PlaylistInfo;
  /** The playlist plugin info */
  pluginInfo: Record<string, any>;
  /** The playlist tracks */
  tracks: LavalinkTrack[];
}

export interface SearchResult {
  /** The search result load type */
  loadType: 'TRACK_LOADED' | 'PLAYLIST_LOADED' | 'SEARCH_RESULT' | 'NO_MATCHES' | 'LOAD_FAILED';
  /** The playlist info (if applicable) */
  playlistInfo?: PlaylistInfo;
  /** The tracks */
  tracks: LavalinkTrack[];
  /** The exception (if load failed) */
  exception?: {
    message: string;
    severity: 'COMMON' | 'SUSPICIOUS' | 'FAULT';
  };
}

export interface EncoderOptions {
  /** Whether to include artwork URLs */
  includeArtwork?: boolean;
  /** Whether to include ISRC */
  includeISRC?: boolean;
  /** Custom source name */
  sourceName?: string;
  /** Whether to validate track data */
  validate?: boolean;
}

export interface PlaylistEncoderOptions extends EncoderOptions {
  /** Maximum number of tracks in playlist */
  maxTracks?: number;
  /** Whether to include playlist metadata */
  includeMetadata?: boolean;
}

export interface DiscordTrackInfo extends TrackInfo {
  /** Discord user who requested the track */
  requester?: {
    id: string;
    username: string;
    discriminator?: string;
  };
  /** Discord guild ID */
  guildId?: string;
  /** Discord channel ID */
  channelId?: string;
}

export interface DiscordTrack extends Track {
  /** The track info with Discord-specific data */
  info: DiscordTrackInfo;
}

export interface DiscordPlaylist extends Playlist {
  /** The playlist tracks with Discord-specific data */
  tracks: DiscordTrack[];
}
