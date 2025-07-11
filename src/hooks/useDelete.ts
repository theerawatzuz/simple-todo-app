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

interface DeleteMutationState<T> {
  data: T | null;
  loading: boolean;
  error: AxiosError | null;
  mutate: (url: string, options?: AxiosRequestConfig) => Promise<void>;
}

function useDelete<T = any>(): DeleteMutationState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<AxiosError | null>(null);

  const mutate = useCallback(
    async (url: string, options?: AxiosRequestConfig) => {
      setLoading(true);
      setError(null);
      try {
        const response: AxiosResponse<T> = await apiClient.delete(url, options);
        const statusText = getHttpStatusText(response.status);
        if (response.status < 200 || response.status >= 300) {
          toast.error(`Error ${response.status}: ${statusText}`);
        } else {
          toast.success(`Success: ${statusText}`);
        }
        setData(response.data);
      } catch (err: any) {
        toast.error("Network error");
        if (axios.isAxiosError(err)) {
          setError(err);
        } else {
          setError(
            new AxiosError(
              "An unexpected error occurred",
              "UNEXPECTED_ERROR",
              undefined,
              undefined,
              err
            )
          );
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

export default useDelete;
