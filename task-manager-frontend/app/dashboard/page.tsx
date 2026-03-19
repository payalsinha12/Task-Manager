"use client";

import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { getAccessToken, clearTokens } from "../../utils/auth";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [toast, setToast] = useState("");
  const [token, setToken] = useState<string | null>(null);

  const router = useRouter();

  // ✅ TOAST
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  // ✅ FETCH TASKS
  const fetchTasks = async (t: string) => {
    try {
      const res = await api("/tasks", "GET", null, t);
      setTasks(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error("FETCH ERROR:", err);
    }
  };

  // ✅ ADD TASK
  const addTask = async () => {
    try {
      if (!title.trim() || !token) return;

      await api("/tasks", "POST", { title }, token);

      setTitle("");
      fetchTasks(token);
      showToast("✅ Task added");
    } catch (err) {
      console.error("ADD ERROR:", err);
    }
  };

  // ✅ DELETE
  const deleteTask = async (id: number) => {
    if (!token) return;

    await api(`/tasks/${id}`, "DELETE", null, token);
    fetchTasks(token);
    showToast("🗑️ Task deleted");
  };

  // ✅ TOGGLE
  const toggleTask = async (id: number) => {
    if (!token) return;

    await api(`/tasks/${id}/toggle`, "PATCH", null, token);
    fetchTasks(token);
    showToast("🔄 Task updated");
  };

  // ✅ START EDIT
  const startEdit = (task: any) => {
    setEditingId(task.id);
    setEditText(task.title);
  };

  // ✅ SAVE EDIT
  const saveEdit = async (id: number) => {
    if (!token) return;

    await api(`/tasks/${id}`, "PUT", { title: editText }, token);

    setEditingId(null);
    fetchTasks(token);
    showToast("✏️ Task updated");
  };

  // ✅ LOGOUT
  const handleLogout = () => {
    clearTokens();
    router.push("/login");
  };

  // ✅ INIT TOKEN + FETCH
  useEffect(() => {
    const t = getAccessToken();

    if (!t) {
      router.push("/login");
      return;
    }

    setToken(t);
    fetchTasks(t);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6">

      {/* TOAST */}
      {toast && (
        <div className="fixed top-5 right-5 bg-black text-white px-4 py-2 rounded-lg shadow-lg">
          {toast}
        </div>
      )}

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">✨ Task Dashboard</h1>

        <button
          onClick={handleLogout}
          className="bg-black/70 hover:bg-black text-white px-5 py-2 rounded-xl"
        >
          Logout
        </button>
      </div>

      {/* ADD TASK */}
      <div className="bg-white/20 backdrop-blur-lg p-4 rounded-2xl mb-4 flex gap-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task..."
          className="flex-1 p-3 rounded-xl bg-white text-black outline-none"
        />

        <button
          onClick={addTask}
          className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-xl"
        >
          Add
        </button>
      </div>

      {/* 🔍 SEARCH */}
      <input
        type="text"
        placeholder="🔍 Search tasks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-6 p-3 rounded-xl bg-white text-black outline-none"
      />

      {/* TASK LIST */}
      <div className="space-y-4">
        {tasks
          .filter((task) =>
            task.title.toLowerCase().includes(search.toLowerCase())
          )
          .map((task) => (
            <div
              key={task.id}
              className="bg-white/20 backdrop-blur-lg p-4 rounded-2xl flex justify-between items-center"
            >
              {/* EDIT MODE */}
              {editingId === task.id ? (
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="p-2 rounded text-black"
                />
              ) : (
                <span
                  className={`text-white ${
                    task.completed ? "line-through opacity-50" : ""
                  }`}
                >
                  {task.title}
                </span>
              )}

              <div className="flex gap-2">

                {/* TOGGLE */}
                <button
                  onClick={() => toggleTask(task.id)}
                  className="bg-green-500 px-3 py-1 rounded"
                >
                  {task.completed ? "Undo" : "Done"}
                </button>

                {/* EDIT / SAVE */}
                {editingId === task.id ? (
                  <button
                    onClick={() => saveEdit(task.id)}
                    className="bg-yellow-500 px-3 py-1 rounded"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => startEdit(task)}
                    className="bg-yellow-400 px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                )}

                {/* DELETE */}
                <button
                  onClick={() => deleteTask(task.id)}
                  className="bg-red-500 px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* EMPTY */}
      {tasks.length === 0 && (
        <p className="text-center text-white mt-10 opacity-70">
          No tasks yet 🚀
        </p>
      )}
    </div>
  );
}