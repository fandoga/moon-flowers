export interface VideoItem {
  video_id: number;
  title?: string;
  post_image?: string;
  preview_image?: string;
  duration_sec: number;
  seo_url?: string;
  video_url?: string;
  public_url?: string;
  preview_url?: string;
  channel_avatar?: string;
}

export type StoryVideo = {
  avatar: string;
  id: number;
  title: string;
  src: string;
  poster?: string;
};

export interface VideosMyResponse {
  limit: number;
  offset: number;
  total: number;
  items: VideoItem[];
  error?: string;
}

export interface VideosMyQueryParams {
  limit?: number;
  offset?: number;
}
