import { useState } from "react";
import useFetch from "./hooks/useFetch";
import usePost from "./hooks/usePost";
import usePatch from "./hooks/usePatch";
import useDelete from "./hooks/useDelete";
import type { Todo } from "./types/Todo";

function App() {
  const [newTodo, setNewTodo] = useState("");
  const [filter, setFilter] = useState<"all" | "completed" | "not-completed">(
    "all"
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<string>("");

  const {
    data: todos,
    loading,
    error,
    refetch,
  } = useFetch<Todo[]>(
    filter === "all" ? `/todos` : `/todos?completed=${filter === "completed"}`
  );
  const { mutate: addTodo } = usePost<Todo>();
  const { mutate: updateTodo } = usePatch<Todo>();
  const { mutate: deleteTodo } = useDelete<{ id: string }>();

  const handleAddTodo = async () => {
    if (!newTodo.trim()) return;
    await addTodo(`/todos`, { title: newTodo, completed: false });
    setNewTodo("");
    if (refetch) refetch();
  };

  const handleToggleTodo = async (id: string, completed: boolean) => {
    await updateTodo(`/todos/${id}`, { completed: !completed });
    if (refetch) refetch();
  };

  const handleDeleteTodo = async (id: string) => {
    await deleteTodo(`/todos/${id}`);
    if (refetch) refetch();
  };

  const handleEditTodo = (id: string, currentTitle: string) => {
    setEditingId(id);
    setEditingText(currentTitle);
  };

  const handleSaveEdit = async (id: string) => {
    if (!editingText.trim()) return;
    await updateTodo(`/todos/${id}`, { title: editingText });
    setEditingId(null);
    setEditingText("");
    if (refetch) refetch();
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingText("");
  };

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
        <div className="bg-red-100 dark:bg-red-900 border-l-4 border-red-500 dark:border-red-400 text-red-700 dark:text-red-200 p-4">
          <p className="font-bold">Error</p>
          <p>{error.message}</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 space-y-6 border border-gray-100 dark:border-gray-700">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 text-center mb-8">
          My Todo List
        </h1>

        {/* Add Todo Form */}
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddTodo()}
            className="flex-1 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            placeholder="What do you need to do?"
          />
          <button
            onClick={handleAddTodo}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition duration-200 transform hover:scale-105"
          >
            Add Task
          </button>
        </div>

        {/* Filters */}
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-5 py-2.5 rounded-full transition duration-200 font-medium ${
              filter === "all"
                ? "bg-gray-800 text-white shadow-md dark:bg-gray-100 dark:text-gray-900"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-5 py-2.5 rounded-full transition duration-200 font-medium ${
              filter === "completed"
                ? "bg-green-600 text-white shadow-md dark:bg-green-400 dark:text-gray-900"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setFilter("not-completed")}
            className={`px-5 py-2.5 rounded-full transition duration-200 font-medium ${
              filter === "not-completed"
                ? "bg-yellow-500 text-white shadow-md dark:bg-yellow-300 dark:text-gray-900"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            Active
          </button>
        </div>

        {/* Todo List or Skeletons */}
        <ul className="space-y-3">
          {loading && !todos ? (
            // Skeleton Loading State
            Array.from({ length: 5 }).map((_, index) => (
              <li
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg animate-pulse"
              >
                <div className="flex items-center space-x-3 w-full">
                  <div className="w-5 h-5 rounded-full bg-gray-300 dark:bg-gray-600"></div>{" "}
                  {/* Checkbox placeholder */}
                  <div className="flex-1 h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>{" "}
                  {/* Text placeholder */}
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-12 h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>{" "}
                  {/* Edit button placeholder */}
                  <div className="w-14 h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>{" "}
                  {/* Delete button placeholder */}
                </div>
              </li>
            ))
          ) : todos?.length === 0 ? (
            // Empty State
            <li className="text-center py-8 text-gray-500 dark:text-gray-400">
              No todos yet. Add one above! ✨
            </li>
          ) : (
            // Actual Todo List
            todos?.map((todo: Todo) => (
              <li
                key={todo.id}
                className="group flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200"
              >
                <div className="flex items-center space-x-3 w-full">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggleTodo(todo.id, todo.completed)}
                    className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:ring-2 focus:ring-offset-2 transition duration-200 cursor-pointer bg-white dark:bg-gray-900"
                  />
                  {editingId === todo.id ? (
                    <input
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      className="flex-1 px-3 py-2 rounded border border-blue-300 dark:border-blue-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveEdit(todo.id);
                        if (e.key === "Escape") handleCancelEdit();
                      }}
                      autoFocus
                    />
                  ) : (
                    <span
                      className={`flex-1 text-gray-800 dark:text-gray-100 transition duration-200 ${
                        todo.completed
                          ? "line-through text-gray-400 dark:text-gray-500"
                          : "text-gray-800 dark:text-gray-100"
                      }`}
                    >
                      {todo.title}
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {editingId === todo.id ? (
                    <>
                      <button
                        onClick={() => handleSaveEdit(todo.id)}
                        className="px-3 py-1 bg-green-500 dark:bg-green-400 text-white dark:text-gray-900 rounded hover:bg-green-600 dark:hover:bg-green-500 transition"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-3 py-1 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-600 transition"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEditTodo(todo.id, todo.title)}
                        className="opacity-0 group-hover:opacity-100 text-blue-500 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-400 px-3 py-1 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900 transition duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTodo(todo.id)}
                        className="opacity-0 group-hover:opacity-100 text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 px-3 py-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900 transition duration-200"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

export default App;
