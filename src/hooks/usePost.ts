import { useState, useCallback } from "react";
import axios, {
  type AxiosRequestConfig,
  type AxiosResponse,
  AxiosError,
} from "axios";
import { getHttpStatusText } from "../services/httpStatus";
import { toast } from "react-toastify";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// apiClient.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     } else {
//       delete config.headers.Authorization;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

interface PostMutationState<T> {
  data: T | null;
  loading: boolean;
  error: AxiosError | null;
  mutate: (
    url: string,
    body?: any,
    options?: AxiosRequestConfig
  ) => Promise<void>;
}

function usePost<T = any>(): PostMutationState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<AxiosError | null>(null);

  const mutate = useCallback(
    async (url: string, body?: any, options?: AxiosRequestConfig) => {
      setLoading(true);
      setError(null);
      try {
        const response: AxiosResponse<T> = await apiClient.post(
          url,
          body,
          options
        );
        const statusText = getHttpStatusText(response.status);
        toast.success(`Success: ${statusText}`);
        setData(response.data);
      } catch (err: any) {
        if (axios.isAxiosError(err)) {
          const statusText = getHttpStatusText(err.response?.status ?? 0);
          toast.error(`Error ${err.response?.status}: ${statusText}`);
          setError(err);
        } else {
          const unknownError = new AxiosError(
            "An unexpected error occurred",
            "UNEXPECTED_ERROR",
            undefined,
            undefined,
            err
          );
          toast.error("Network error");
          setError(unknownError);
        }
        setData(null);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { data, loading, error, mutate };
}

export default usePost;
