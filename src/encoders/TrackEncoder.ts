import { Track, TrackInfo, EncoderOptions, LavalinkTrack } from '../types';
import * as base64 from 'base64-js';

/**
 * Core track encoder for Lavalink clients
 */
export class TrackEncoder {
  private options: Required<EncoderOptions>;

  constructor(options: EncoderOptions = {}) {
    this.options = {
      includeArtwork: options.includeArtwork ?? true,
      includeISRC: options.includeISRC ?? true,
      sourceName: options.sourceName ?? 'unknown',
      validate: options.validate ?? true,
    };
  }

  /**
   * Encodes a track info object into a Lavalink-compatible track
   */
  public encodeTrack(trackInfo: TrackInfo): LavalinkTrack {
    if (this.options.validate) {
      this.validateTrackInfo(trackInfo);
    }

    const trackData = {
      identifier: trackInfo.identifier,
      isSeekable: trackInfo.isSeekable,
      author: trackInfo.author,
      length: trackInfo.length,
      isStream: trackInfo.isStream,
      position: trackInfo.position,
      title: trackInfo.title,
      uri: trackInfo.uri,
      sourceName: trackInfo.sourceName || this.options.sourceName,
      ...(this.options.includeArtwork && trackInfo.artworkUrl && { artworkUrl: trackInfo.artworkUrl }),
      ...(this.options.includeISRC && trackInfo.isrc && { isrc: trackInfo.isrc }),
    };

    const encodedTrack = this.encodeTrackData(trackData);
    
    return {
      track: encodedTrack,
      info: trackInfo,
    };
  }

  /**
   * Decodes a Lavalink track string back to track info
   */
  public decodeTrack(encodedTrack: string): TrackInfo {
    try {
      const decoded = this.decodeTrackData(encodedTrack);
      return decoded as TrackInfo;
    } catch (error) {
      throw new Error(`Failed to decode track: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Creates a track from basic information
   */
  public createTrack(
    identifier: string,
    title: string,
    author: string,
    length: number,
    uri: string,
    additionalInfo: Partial<TrackInfo> = {}
  ): LavalinkTrack {
    const trackInfo: TrackInfo = {
      identifier,
      title,
      author,
      length,
      uri,
      isSeekable: length > 0,
      isStream: length === 0,
      position: 0,
      sourceName: this.options.sourceName,
      ...additionalInfo,
    };

    return this.encodeTrack(trackInfo);
  }

  /**
   * Creates a track from YouTube data
   */
  public createYouTubeTrack(
    videoId: string,
    title: string,
    author: string,
    duration: number,
    additionalInfo: Partial<TrackInfo> = {}
  ): LavalinkTrack {
    return this.createTrack(
      videoId,
      title,
      author,
      duration * 1000, // Convert seconds to milliseconds
      `https://www.youtube.com/watch?v=${videoId}`,
      {
        sourceName: 'youtube',
        ...additionalInfo,
      }
    );
  }

  /**
   * Creates a track from Spotify data
   */
  public createSpotifyTrack(
    trackId: string,
    title: string,
    author: string,
    duration: number,
    additionalInfo: Partial<TrackInfo> = {}
  ): LavalinkTrack {
    return this.createTrack(
      trackId,
      title,
      author,
      duration,
      `https://open.spotify.com/track/${trackId}`,
      {
        sourceName: 'spotify',
        ...additionalInfo,
      }
    );
  }

  /**
   * Creates a track from SoundCloud data
   */
  public createSoundCloudTrack(
    trackId: string,
    title: string,
    author: string,
    duration: number,
    additionalInfo: Partial<TrackInfo> = {}
  ): LavalinkTrack {
    return this.createTrack(
      trackId,
      title,
      author,
      duration,
      `https://soundcloud.com/${author}/${title}`,
      {
        sourceName: 'soundcloud',
        ...additionalInfo,
      }
    );
  }

  /**
   * Validates track information
   */
  private validateTrackInfo(trackInfo: TrackInfo): void {
    if (!trackInfo.identifier) {
      throw new Error('Track identifier is required');
    }
    if (!trackInfo.title) {
      throw new Error('Track title is required');
    }
    if (!trackInfo.author) {
      throw new Error('Track author is required');
    }
    if (typeof trackInfo.length !== 'number' || trackInfo.length < 0) {
      throw new Error('Track length must be a non-negative number');
    }
    if (!trackInfo.uri) {
      throw new Error('Track URI is required');
    }
  }

  /**
   * Encodes track data to base64 string
   */
  private encodeTrackData(data: any): string {
    const jsonString = JSON.stringify(data);
    const bytes = new TextEncoder().encode(jsonString);
    return base64.fromByteArray(bytes);
  }

  /**
   * Decodes base64 string to track data
   */
  private decodeTrackData(encoded: string): any {
    const bytes = base64.toByteArray(encoded);
    const jsonString = new TextDecoder().decode(bytes);
    return JSON.parse(jsonString);
  }

  /**
   * Updates encoder options
   */
  public updateOptions(options: Partial<EncoderOptions>): void {
    this.options = { ...this.options, ...options };
  }

  /**
   * Gets current encoder options
   */
  public getOptions(): Required<EncoderOptions> {
    return { ...this.options };
  }
}
