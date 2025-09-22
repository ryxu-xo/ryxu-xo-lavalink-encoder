import { TrackEncoder } from './encoders/TrackEncoder';
import { PlaylistEncoder } from './encoders/PlaylistEncoder';
import { DiscordTrackEncoder } from './discord/DiscordTrackEncoder';
import { 
  TrackInfo, 
  PlaylistInfo, 
  Track, 
  LavalinkTrack, 
  LavalinkPlaylist,
  DiscordTrack,
  DiscordPlaylist,
  EncoderOptions,
  PlaylistEncoderOptions,
  SearchResult
} from './types';

/**
 * Main Lavalink encoder class that combines all functionality
 */
export class LavalinkEncoder {
  private trackEncoder: TrackEncoder;
  private playlistEncoder: PlaylistEncoder;
  private discordEncoder: DiscordTrackEncoder;

  constructor(options: EncoderOptions & PlaylistEncoderOptions = {}) {
    this.trackEncoder = new TrackEncoder(options);
    this.playlistEncoder = new PlaylistEncoder(options);
    this.discordEncoder = new DiscordTrackEncoder();
  }

  // Track encoding methods
  public encodeTrack(trackInfo: TrackInfo): LavalinkTrack {
    return this.trackEncoder.encodeTrack(trackInfo);
  }

  public decodeTrack(encodedTrack: string): TrackInfo {
    return this.trackEncoder.decodeTrack(encodedTrack);
  }

  public createTrack(
    identifier: string,
    title: string,
    author: string,
    length: number,
    uri: string,
    additionalInfo: Partial<TrackInfo> = {}
  ): LavalinkTrack {
    return this.trackEncoder.createTrack(identifier, title, author, length, uri, additionalInfo);
  }

  public createYouTubeTrack(
    videoId: string,
    title: string,
    author: string,
    duration: number,
    additionalInfo: Partial<TrackInfo> = {}
  ): LavalinkTrack {
    return this.trackEncoder.createYouTubeTrack(videoId, title, author, duration, additionalInfo);
  }

  public createSpotifyTrack(
    trackId: string,
    title: string,
    author: string,
    duration: number,
    additionalInfo: Partial<TrackInfo> = {}
  ): LavalinkTrack {
    return this.trackEncoder.createSpotifyTrack(trackId, title, author, duration, additionalInfo);
  }

  public createSoundCloudTrack(
    trackId: string,
    title: string,
    author: string,
    duration: number,
    additionalInfo: Partial<TrackInfo> = {}
  ): LavalinkTrack {
    return this.trackEncoder.createSoundCloudTrack(trackId, title, author, duration, additionalInfo);
  }

  // Playlist encoding methods
  public encodePlaylist(playlistInfo: PlaylistInfo, tracks: Track[]): LavalinkPlaylist {
    return this.playlistEncoder.encodePlaylist(playlistInfo, tracks);
  }

  public createPlaylist(
    name: string,
    trackInfos: TrackInfo[],
    selectedTrack: number = 0
  ): LavalinkPlaylist {
    return this.playlistEncoder.createPlaylist(name, trackInfos, selectedTrack);
  }

  public createYouTubePlaylist(
    playlistId: string,
    name: string,
    videoData: Array<{
      videoId: string;
      title: string;
      author: string;
      duration: number;
    }>,
    selectedTrack: number = 0
  ): LavalinkPlaylist {
    return this.playlistEncoder.createYouTubePlaylist(playlistId, name, videoData, selectedTrack);
  }

  public createSpotifyPlaylist(
    playlistId: string,
    name: string,
    trackData: Array<{
      trackId: string;
      title: string;
      author: string;
      duration: number;
    }>,
    selectedTrack: number = 0
  ): LavalinkPlaylist {
    return this.playlistEncoder.createSpotifyPlaylist(playlistId, name, trackData, selectedTrack);
  }

  public createSoundCloudPlaylist(
    playlistId: string,
    name: string,
    trackData: Array<{
      trackId: string;
      title: string;
      author: string;
      duration: number;
    }>,
    selectedTrack: number = 0
  ): LavalinkPlaylist {
    return this.playlistEncoder.createSoundCloudPlaylist(playlistId, name, trackData, selectedTrack);
  }

  public mergePlaylists(playlists: LavalinkPlaylist[], newName?: string): LavalinkPlaylist {
    return this.playlistEncoder.mergePlaylists(playlists, newName);
  }

  public splitPlaylist(playlist: LavalinkPlaylist, chunkSize: number): LavalinkPlaylist[] {
    return this.playlistEncoder.splitPlaylist(playlist, chunkSize);
  }

  // Discord-specific methods
  public encodeDiscordTrack(
    trackInfo: TrackInfo,
    requester: {
      id: string;
      username: string;
      discriminator?: string;
    },
    guildId: string,
    channelId: string
  ): DiscordTrack {
    return this.discordEncoder.encodeDiscordTrack(trackInfo, requester, guildId, channelId);
  }

  public encodeDiscordPlaylist(
    playlistInfo: PlaylistInfo,
    tracks: Track[],
    requester: {
      id: string;
      username: string;
      discriminator?: string;
    },
    guildId: string,
    channelId: string
  ): DiscordPlaylist {
    return this.discordEncoder.encodeDiscordPlaylist(playlistInfo, tracks, requester, guildId, channelId);
  }

  public createDiscordYouTubeTrack(
    videoId: string,
    title: string,
    author: string,
    duration: number,
    requester: {
      id: string;
      username: string;
      discriminator?: string;
    },
    guildId: string,
    channelId: string,
    additionalInfo: Partial<TrackInfo> = {}
  ): DiscordTrack {
    return this.discordEncoder.createDiscordYouTubeTrack(
      videoId, title, author, duration, requester, guildId, channelId, additionalInfo
    );
  }

  public createDiscordSpotifyTrack(
    trackId: string,
    title: string,
    author: string,
    duration: number,
    requester: {
      id: string;
      username: string;
      discriminator?: string;
    },
    guildId: string,
    channelId: string,
    additionalInfo: Partial<TrackInfo> = {}
  ): DiscordTrack {
    return this.discordEncoder.createDiscordSpotifyTrack(
      trackId, title, author, duration, requester, guildId, channelId, additionalInfo
    );
  }

  public createDiscordSoundCloudTrack(
    trackId: string,
    title: string,
    author: string,
    duration: number,
    requester: {
      id: string;
      username: string;
      discriminator?: string;
    },
    guildId: string,
    channelId: string,
    additionalInfo: Partial<TrackInfo> = {}
  ): DiscordTrack {
    return this.discordEncoder.createDiscordSoundCloudTrack(
      trackId, title, author, duration, requester, guildId, channelId, additionalInfo
    );
  }

  public createDiscordYouTubePlaylist(
    playlistId: string,
    name: string,
    videoData: Array<{
      videoId: string;
      title: string;
      author: string;
      duration: number;
    }>,
    requester: {
      id: string;
      username: string;
      discriminator?: string;
    },
    guildId: string,
    channelId: string,
    selectedTrack: number = 0
  ): DiscordPlaylist {
    return this.discordEncoder.createDiscordYouTubePlaylist(
      playlistId, name, videoData, requester, guildId, channelId, selectedTrack
    );
  }

  public createDiscordSpotifyPlaylist(
    playlistId: string,
    name: string,
    trackData: Array<{
      trackId: string;
      title: string;
      author: string;
      duration: number;
    }>,
    requester: {
      id: string;
      username: string;
      discriminator?: string;
    },
    guildId: string,
    channelId: string,
    selectedTrack: number = 0
  ): DiscordPlaylist {
    return this.discordEncoder.createDiscordSpotifyPlaylist(
      playlistId, name, trackData, requester, guildId, channelId, selectedTrack
    );
  }

  // Utility methods
  public getRequester(track: DiscordTrack): {
    id: string;
    username: string;
    discriminator?: string;
  } | null {
    return this.discordEncoder.getRequester(track);
  }

  public getGuildInfo(track: DiscordTrack): {
    guildId: string;
    channelId: string;
  } | null {
    return this.discordEncoder.getGuildInfo(track);
  }

  public filterTracksByRequester(tracks: DiscordTrack[], requesterId: string): DiscordTrack[] {
    return this.discordEncoder.filterTracksByRequester(tracks, requesterId);
  }

  public filterTracksByGuild(tracks: DiscordTrack[], guildId: string): DiscordTrack[] {
    return this.discordEncoder.filterTracksByGuild(tracks, guildId);
  }

  public getTrackStats(tracks: DiscordTrack[], requesterId: string): {
    totalTracks: number;
    totalDuration: number;
    sources: Record<string, number>;
  } {
    return this.discordEncoder.getTrackStats(tracks, requesterId);
  }

  // Configuration methods
  public updateOptions(options: Partial<EncoderOptions & PlaylistEncoderOptions>): void {
    this.trackEncoder.updateOptions(options);
    this.playlistEncoder.updateOptions(options);
    this.discordEncoder.updateOptions(options);
  }

  public getOptions(): Required<EncoderOptions & PlaylistEncoderOptions> {
    return {
      ...this.trackEncoder.getOptions(),
      ...this.playlistEncoder.getOptions(),
    };
  }
}
