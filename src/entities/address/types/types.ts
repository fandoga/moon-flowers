export interface AddressSuggestionsResponse {
  suggestions: string[];
  count?: number;
  error?: string;
}

export interface AddressSuggestionsQueryParams {
  query: string;
}

export interface SavedAddressForm {
  address: string;
  apartment: string;
  entrance: string;
  floor: string;
}
