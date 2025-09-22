import { TrackEncoder } from '../encoders/TrackEncoder';
import { PlaylistEncoder } from '../encoders/PlaylistEncoder';
import { 
  DiscordTrack, 
  DiscordPlaylist, 
  DiscordTrackInfo, 
  TrackInfo, 
  PlaylistInfo, 
  Track,
  LavalinkTrack,
  LavalinkPlaylist
} from '../types';

/**
 * Discord-specific track and playlist encoder with user and guild information
 */
export class DiscordTrackEncoder {
  private trackEncoder: TrackEncoder;
  private playlistEncoder: PlaylistEncoder;

  constructor() {
    this.trackEncoder = new TrackEncoder();
    this.playlistEncoder = new PlaylistEncoder();
  }

  /**
   * Encodes a track with Discord user and guild information
   */
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
    const discordTrackInfo: DiscordTrackInfo = {
      ...trackInfo,
      requester,
      guildId,
      channelId,
    };

    const encodedTrack = this.trackEncoder.encodeTrack(trackInfo);

    return {
      track: encodedTrack.track,
      info: discordTrackInfo,
    };
  }

  /**
   * Encodes a playlist with Discord user and guild information
   */
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
    const discordTracks: DiscordTrack[] = tracks.map(track => ({
      track: track.track,
      info: {
        ...track.info,
        requester,
        guildId,
        channelId,
      },
    }));

    const encodedPlaylist = this.playlistEncoder.encodePlaylist(playlistInfo, tracks);

    return {
      info: encodedPlaylist.info,
      pluginInfo: encodedPlaylist.pluginInfo,
      tracks: discordTracks,
    };
  }

  /**
   * Creates a Discord track from YouTube data
   */
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
    const trackInfo: TrackInfo = {
      identifier: videoId,
      title,
      author,
      length: duration * 1000, // Convert seconds to milliseconds
      uri: `https://www.youtube.com/watch?v=${videoId}`,
      isSeekable: duration > 0,
      isStream: duration === 0,
      position: 0,
      sourceName: 'youtube',
      ...additionalInfo,
    };

    return this.encodeDiscordTrack(trackInfo, requester, guildId, channelId);
  }

  /**
   * Creates a Discord track from Spotify data
   */
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
    const trackInfo: TrackInfo = {
      identifier: trackId,
      title,
      author,
      length: duration,
      uri: `https://open.spotify.com/track/${trackId}`,
      isSeekable: duration > 0,
      isStream: duration === 0,
      position: 0,
      sourceName: 'spotify',
      ...additionalInfo,
    };

    return this.encodeDiscordTrack(trackInfo, requester, guildId, channelId);
  }

  /**
   * Creates a Discord track from SoundCloud data
   */
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
    const trackInfo: TrackInfo = {
      identifier: trackId,
      title,
      author,
      length: duration,
      uri: `https://soundcloud.com/${author}/${title}`,
      isSeekable: duration > 0,
      isStream: duration === 0,
      position: 0,
      sourceName: 'soundcloud',
      ...additionalInfo,
    };

    return this.encodeDiscordTrack(trackInfo, requester, guildId, channelId);
  }

  /**
   * Creates a Discord playlist from YouTube data
   */
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
    const tracks: Track[] = videoData.map(video => {
      const trackInfo: TrackInfo = {
        identifier: video.videoId,
        title: video.title,
        author: video.author,
        length: video.duration * 1000, // Convert seconds to milliseconds
        uri: `https://www.youtube.com/watch?v=${video.videoId}`,
        isSeekable: video.duration > 0,
        isStream: video.duration === 0,
        position: 0,
        sourceName: 'youtube',
      };

      return {
        track: '', // Will be encoded
        info: trackInfo,
      };
    });

    return this.encodeDiscordPlaylist(
      { name, selectedTrack },
      tracks,
      requester,
      guildId,
      channelId
    );
  }

  /**
   * Creates a Discord playlist from Spotify data
   */
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
    const tracks: Track[] = trackData.map(track => {
      const trackInfo: TrackInfo = {
        identifier: track.trackId,
        title: track.title,
        author: track.author,
        length: track.duration,
        uri: `https://open.spotify.com/track/${track.trackId}`,
        isSeekable: track.duration > 0,
        isStream: track.duration === 0,
        position: 0,
        sourceName: 'spotify',
      };

      return {
        track: '', // Will be encoded
        info: trackInfo,
      };
    });

    return this.encodeDiscordPlaylist(
      { name, selectedTrack },
      tracks,
      requester,
      guildId,
      channelId
    );
  }

  /**
   * Extracts requester information from a Discord track
   */
  public getRequester(track: DiscordTrack): {
    id: string;
    username: string;
    discriminator?: string;
  } | null {
    return track.info.requester || null;
  }

  /**
   * Extracts guild information from a Discord track
   */
  public getGuildInfo(track: DiscordTrack): {
    guildId: string;
    channelId: string;
  } | null {
    if (!track.info.guildId || !track.info.channelId) {
      return null;
    }
    return {
      guildId: track.info.guildId,
      channelId: track.info.channelId,
    };
  }

  /**
   * Filters tracks by requester
   */
  public filterTracksByRequester(tracks: DiscordTrack[], requesterId: string): DiscordTrack[] {
    return tracks.filter(track => track.info.requester?.id === requesterId);
  }

  /**
   * Filters tracks by guild
   */
  public filterTracksByGuild(tracks: DiscordTrack[], guildId: string): DiscordTrack[] {
    return tracks.filter(track => track.info.guildId === guildId);
  }

  /**
   * Gets track statistics for a user
   */
  public getTrackStats(tracks: DiscordTrack[], requesterId: string): {
    totalTracks: number;
    totalDuration: number;
    sources: Record<string, number>;
  } {
    const userTracks = this.filterTracksByRequester(tracks, requesterId);
    
    const stats = {
      totalTracks: userTracks.length,
      totalDuration: 0,
      sources: {} as Record<string, number>,
    };

    userTracks.forEach(track => {
      stats.totalDuration += track.info.length;
      const source = track.info.sourceName;
      stats.sources[source] = (stats.sources[source] || 0) + 1;
    });

    return stats;
  }

  /**
   * Updates encoder options
   */
  public updateOptions(options: {
    includeArtwork?: boolean;
    includeISRC?: boolean;
    sourceName?: string;
    validate?: boolean;
    maxTracks?: number;
    includeMetadata?: boolean;
  }): void {
    this.trackEncoder.updateOptions(options);
    this.playlistEncoder.updateOptions(options);
  }
}
