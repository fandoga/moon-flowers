import { useQuery } from "@tanstack/react-query";
import { getMyVideos } from "../api/api";
import { VideosMyQueryParams, VideosMyResponse } from "../types/types";

export const useMyVideos = (params?: VideosMyQueryParams) => {
  return useQuery<VideosMyResponse>({
    queryKey: ["videos", "my", params],
    queryFn: () => getMyVideos(params),
  });
};
