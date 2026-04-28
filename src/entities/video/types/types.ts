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
  channel_username?: string;
}

export type StoryVideo = {
  avatar: string;
  id: number;
  title: string;
  poster?: string;
  user?: string;
  productId?: number;
  productName?: string;
  productPhoto?: string;
  productPrice?: number;
};

export interface VideosMyResponse {
  limit: number;
  offset: number;
  total: number;
  items: VideoItem[];
  error?: string;
}

export interface VideosMyQueryParams {
  user_chatting_nickname?: string;
  limit?: number;
  offset?: number;
}
