import api from "@/shared/api/axios";
import { VideosMyQueryParams, VideosMyResponse } from "../types/types";

export const getMyVideos = async (
  params?: VideosMyQueryParams,
): Promise<VideosMyResponse> => {
  try {
    const response = await api.get<VideosMyResponse>(
      "/videos/recommendations",
      {
        params: {
          ...params,
          user_chatting_nickname: params?.user_chatting_nickname,
        },
      },
    );
    return response.data;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch videos";
    return {
      limit: params?.limit ?? 0,
      offset: params?.offset ?? 0,
      total: 0,
      items: [],
      error: errorMessage,
    };
  }
};
