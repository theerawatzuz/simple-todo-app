export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: number;
}
