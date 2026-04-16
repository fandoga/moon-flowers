import { tableCrmApi } from "@/shared/api/clients";
import {
  AddressSuggestionsQueryParams,
  AddressSuggestionsResponse,
} from "../types/types";

export const getAddressSuggestions = async (
  params: AddressSuggestionsQueryParams,
): Promise<AddressSuggestionsResponse> => {
  try {
    const response = await tableCrmApi.get<AddressSuggestionsResponse>(
      "/autosuggestions/geolocation",
      {
        params,
      },
    );
    return response.data;
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to load address suggestions";

    return {
      suggestions: [],
      count: 0,
      error: message,
    };
  }
};
