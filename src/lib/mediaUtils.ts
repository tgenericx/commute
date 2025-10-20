import { ResourceType } from "@/graphql/graphql";

export interface MediaCreateInput {
  publicId: string;
  secureUrl: string;
  format: string;
  bytes: number;
  resourceType: ResourceType;
  width?: number | null;
  height?: number | null;
  duration?: number | null;
  playbackUrl?: string | null;
  eager?: Record<string, unknown> | null;
  [key: string]: unknown;
}

export interface CloudinaryUploadResponse {
  filename: string;
  success: boolean;
  data: CloudinaryAssetData;
}

export interface CloudinaryAssetData {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width?: number;
  height?: number;
  format: string;
  resource_type: 'image' | 'video';
  created_at: string;
  bytes: number;
  duration?: number;
  playback_url?: string;
  secure_url: string;
  url: string;
  asset_folder: string;
  display_name: string;
  audio?: {
    codec: string;
    bit_rate: string;
    frequency: number;
    channels: number;
    channel_layout: string;
  };
  video?: {
    pix_format: string;
    codec: string;
    level: number;
    profile: string;
    bit_rate: string;
    time_base: string;
  };
  frame_rate?: number;
  bit_rate?: number;
  nb_frames?: number;
  rotation?: number;
  tags?: string[];
  eager?: any;
}

export function mapToMediaCreateInput(
  data: CloudinaryAssetData,
  resourceType: ResourceType
): MediaCreateInput {
  return {
    publicId: data.public_id,
    secureUrl: data.secure_url,
    format: data.format,
    bytes: data.bytes,
    resourceType,
    width: data.width ?? null,
    height: data.height ?? null,
    duration: data.duration ?? null,
    playbackUrl: data.playback_url ?? null,
    eager: data.eager ?? null,
  };
}
