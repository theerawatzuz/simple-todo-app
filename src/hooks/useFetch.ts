import { useState, useEffect } from "react";
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

function useFetch<R = any>(
  url: string,
  options?: AxiosRequestConfig
): {
  data: R | null;
  loading: boolean;
  error: AxiosError | null;
  refetch: () => void;
} {
  const [data, setData] = useState<R | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<AxiosError | null>(null);
  const [reloadFlag, setReloadFlag] = useState(0);

  const refetch = () => setReloadFlag((prev) => prev + 1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response: AxiosResponse<R> = await apiClient(url, options);
        const statusText = getHttpStatusText(response.status);
        if (response.status < 200 || response.status >= 300) {
          toast.error(`Error ${response.status}: ${statusText}`);
        } else if (response.status !== 200) {
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
    };

    fetchData();
  }, [url, reloadFlag]);

  return { data, loading, error, refetch };
}

export default useFetch;
