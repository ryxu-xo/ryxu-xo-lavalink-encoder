import { Playlist, PlaylistInfo, PlaylistEncoderOptions, LavalinkPlaylist, Track, TrackInfo } from '../types';
import { TrackEncoder } from './TrackEncoder';

/**
 * Playlist encoder for Lavalink clients
 */
export class PlaylistEncoder {
  private trackEncoder: TrackEncoder;
  private options: Required<PlaylistEncoderOptions>;

  constructor(options: PlaylistEncoderOptions = {}) {
    this.options = {
      includeArtwork: options.includeArtwork ?? true,
      includeISRC: options.includeISRC ?? true,
      sourceName: options.sourceName ?? 'unknown',
      validate: options.validate ?? true,
      maxTracks: options.maxTracks ?? 1000,
      includeMetadata: options.includeMetadata ?? true,
    };
    
    this.trackEncoder = new TrackEncoder({
      includeArtwork: this.options.includeArtwork,
      includeISRC: this.options.includeISRC,
      sourceName: this.options.sourceName,
      validate: this.options.validate,
    });
  }

  /**
   * Encodes a playlist with tracks into a Lavalink-compatible playlist
   */
  public encodePlaylist(playlistInfo: PlaylistInfo, tracks: Track[]): LavalinkPlaylist {
    if (this.options.validate) {
      this.validatePlaylistInfo(playlistInfo);
      this.validateTracks(tracks);
    }

    // Limit tracks if maxTracks is set
    const limitedTracks = this.options.maxTracks > 0 
      ? tracks.slice(0, this.options.maxTracks)
      : tracks;

    // Encode tracks using the track encoder
    const encodedTracks = limitedTracks.map(track => {
      if (typeof track.track === 'string' && track.track.length > 0) {
        // Track is already encoded, just return it
        return track;
      } else {
        // Track needs to be encoded
        return this.trackEncoder.encodeTrack(track.info);
      }
    });

    const playlist: LavalinkPlaylist = {
      info: {
        name: playlistInfo.name,
        selectedTrack: Math.min(playlistInfo.selectedTrack, encodedTracks.length - 1),
      },
      pluginInfo: {},
      tracks: encodedTracks,
    };

    return playlist;
  }

  /**
   * Creates a playlist from track information array
   */
  public createPlaylist(
    name: string,
    trackInfos: TrackInfo[],
    selectedTrack: number = 0
  ): LavalinkPlaylist {
    const tracks: Track[] = trackInfos.map(trackInfo => ({
      track: '', // Will be encoded
      info: trackInfo,
    }));

    return this.encodePlaylist({ name, selectedTrack }, tracks);
  }

  /**
   * Creates a playlist from YouTube playlist data
   */
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
    const trackInfos: TrackInfo[] = videoData.map(video => ({
      identifier: video.videoId,
      title: video.title,
      author: video.author,
      length: video.duration * 1000, // Convert seconds to milliseconds
      uri: `https://www.youtube.com/watch?v=${video.videoId}`,
      isSeekable: video.duration > 0,
      isStream: video.duration === 0,
      position: 0,
      sourceName: 'youtube',
    }));

    return this.createPlaylist(name, trackInfos, selectedTrack);
  }

  /**
   * Creates a playlist from Spotify playlist data
   */
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
    const trackInfos: TrackInfo[] = trackData.map(track => ({
      identifier: track.trackId,
      title: track.title,
      author: track.author,
      length: track.duration,
      uri: `https://open.spotify.com/track/${track.trackId}`,
      isSeekable: track.duration > 0,
      isStream: track.duration === 0,
      position: 0,
      sourceName: 'spotify',
    }));

    return this.createPlaylist(name, trackInfos, selectedTrack);
  }

  /**
   * Creates a playlist from SoundCloud playlist data
   */
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
    const trackInfos: TrackInfo[] = trackData.map(track => ({
      identifier: track.trackId,
      title: track.title,
      author: track.author,
      length: track.duration,
      uri: `https://soundcloud.com/${track.author}/${track.title}`,
      isSeekable: track.duration > 0,
      isStream: track.duration === 0,
      position: 0,
      sourceName: 'soundcloud',
    }));

    return this.createPlaylist(name, trackInfos, selectedTrack);
  }

  /**
   * Merges multiple playlists into one
   */
  public mergePlaylists(playlists: LavalinkPlaylist[], newName?: string): LavalinkPlaylist {
    const allTracks: Track[] = [];
    let totalSelectedTrack = 0;

    playlists.forEach((playlist, index) => {
      allTracks.push(...playlist.tracks);
      if (index === 0) {
        totalSelectedTrack = playlist.info.selectedTrack;
      }
    });

    const name = newName || `Merged Playlist (${playlists.length} playlists)`;
    
    return this.encodePlaylist(
      { name, selectedTrack: totalSelectedTrack },
      allTracks
    );
  }

  /**
   * Splits a playlist into chunks
   */
  public splitPlaylist(playlist: LavalinkPlaylist, chunkSize: number): LavalinkPlaylist[] {
    const chunks: LavalinkPlaylist[] = [];
    const tracks = playlist.tracks;

    for (let i = 0; i < tracks.length; i += chunkSize) {
      const chunkTracks = tracks.slice(i, i + chunkSize);
      const chunkName = `${playlist.info.name} (Part ${Math.floor(i / chunkSize) + 1})`;
      const selectedTrack = i === 0 ? playlist.info.selectedTrack : 0;

      chunks.push(
        this.encodePlaylist(
          { name: chunkName, selectedTrack },
          chunkTracks
        )
      );
    }

    return chunks;
  }

  /**
   * Validates playlist information
   */
  private validatePlaylistInfo(playlistInfo: PlaylistInfo): void {
    if (!playlistInfo.name) {
      throw new Error('Playlist name is required');
    }
    if (typeof playlistInfo.selectedTrack !== 'number' || playlistInfo.selectedTrack < 0) {
      throw new Error('Selected track must be a non-negative number');
    }
  }

  /**
   * Validates tracks array
   */
  private validateTracks(tracks: Track[]): void {
    if (!Array.isArray(tracks)) {
      throw new Error('Tracks must be an array');
    }
    if (tracks.length === 0) {
      throw new Error('Playlist must contain at least one track');
    }
    if (this.options.maxTracks > 0 && tracks.length > this.options.maxTracks) {
      console.warn(`Playlist contains ${tracks.length} tracks, but maxTracks is set to ${this.options.maxTracks}`);
    }
  }

  /**
   * Updates encoder options
   */
  public updateOptions(options: Partial<PlaylistEncoderOptions>): void {
    this.options = { ...this.options, ...options };
    this.trackEncoder.updateOptions({
      includeArtwork: this.options.includeArtwork,
      includeISRC: this.options.includeISRC,
      sourceName: this.options.sourceName,
      validate: this.options.validate,
    });
  }

  /**
   * Gets current encoder options
   */
  public getOptions(): Required<PlaylistEncoderOptions> {
    return { ...this.options };
  }
}
