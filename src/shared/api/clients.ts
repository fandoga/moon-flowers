import axios, { type AxiosInstance } from "axios";

const TABLE_CRM_BASE_URL = "https://app.tablecrm.com/api/v1";

const attachInterceptors = (client: AxiosInstance) => {
  client.interceptors.request.use(
    (config) => {
      const token = process.env.NEXT_PUBLIC_TABLE_CRM_TOKEN;

      if (token) {
        config.params = {
          ...config.params,
          token,
        };
      }

      return config;
    },
    (error) => {
      console.log("request error", error);
      return Promise.reject(error);
    },
  );

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      console.log("response error", error?.response?.data || error);
      return Promise.reject(error);
    },
  );

  return client;
};

const createApiClient = (baseURL: string | undefined) =>
  attachInterceptors(
    axios.create({
      baseURL,
    }),
  );

export const appApi = createApiClient(process.env.NEXT_PUBLIC_API_URL);

export const tableCrmApi = createApiClient(
  process.env.NEXT_PUBLIC_TABLECRM_API_URL || TABLE_CRM_BASE_URL,
);
