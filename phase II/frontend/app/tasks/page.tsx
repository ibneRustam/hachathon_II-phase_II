"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const API_URL = "http://127.0.0.1:8000";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isImportant, setIsImportant] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [userId, setUserId] = useState("");
  const router = useRouter();

  useEffect(() => {
    const savedId = localStorage.getItem("userId");
    if (!savedId) router.push("/login");
    else { setUserId(savedId); fetchTasks(savedId); }
  }, []);

  const fetchTasks = async (uid: string) => {
    try {
      const res = await fetch(`${API_URL}/api/${uid}/tasks`);
      const data = await res.json();
      setTasks(data);
    } catch (err) { console.error("Fetch error", err); }
  };

  const handleSave = async () => {
    if (!title) return alert("Title required");
    
    // Yahan API_URL ke sath slash ka masla hal kiya hai
    const base_url = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
    const endpoint = editingId 
      ? `/api/${userId}/tasks/${editingId}/update` 
      : `/api/${userId}/tasks`;
    
    const method = editingId ? "PATCH" : "POST";

    try {
      const res = await fetch(`${base_url}${endpoint}`, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title: title, 
          description: description, 
          is_important: isImportant
        }),
      });

      if (res.ok) {
        setTitle(""); setDescription(""); setIsImportant(false); setEditingId(null);
        fetchTasks(userId);
      } else {
        alert("Server error. Check terminal.");
      }
    } catch (err) {
      alert("Still getting Network Error? Please restart your FastAPI terminal.");
    }
  };

  const startEdit = (task: any) => {
    setEditingId(task.id);
    setTitle(task.title);
    setDescription(task.description);
    setIsImportant(task.is_important);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleComplete = async (id: number) => {
    await fetch(`${API_URL}/api/${userId}/tasks/${id}/complete`, { method: "PATCH" });
    fetchTasks(userId);
  };

  const deleteTask = async (id: number) => {
    if (confirm("Delete this task?")) {
      await fetch(`${API_URL}/api/${userId}/tasks/${id}`, { method: "DELETE" });
      fetchTasks(userId);
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-zinc-100 p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="flex justify-between items-center bg-[#09090b] border border-zinc-800 p-6 rounded-2xl shadow-xl">
          <h1 className="text-2xl font-black italic tracking-tighter text-white">SMART TODO</h1>
          <button onClick={() => {localStorage.clear(); router.push("/")}} className="text-red-500 text-xs font-bold border border-red-900/30 px-4 py-2 rounded-xl hover:bg-red-900/10 transition-all">Logout</button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Panel */}
          <div className="bg-[#09090b] border border-zinc-800 p-6 rounded-3xl h-fit sticky top-8 shadow-2xl">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-6">{editingId ? "Modify Task" : "Add Task"}</h3>
            <input placeholder="Task Title" value={title} onChange={(e)=>setTitle(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 mb-4 text-sm outline-none focus:border-zinc-500 text-white"/>
            <textarea placeholder="Description (Optional)" value={description} onChange={(e)=>setDescription(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 mb-4 h-32 text-sm outline-none focus:border-zinc-500 text-white resize-none"/>
            
            <label className="flex items-center gap-3 mb-8 cursor-pointer group">
              <input type="checkbox" checked={isImportant} onChange={(e)=>setIsImportant(e.target.checked)} className="w-4 h-4 rounded accent-white bg-zinc-900 border-zinc-800"/>
              <span className="text-sm text-zinc-400 group-hover:text-white transition-colors">High Priority ⭐</span>
            </label>

            <button onClick={handleSave} className="w-full bg-white text-black font-black py-4 rounded-2xl hover:bg-zinc-200 transition-all active:scale-95 shadow-lg shadow-white/5 uppercase text-xs tracking-widest">
              {editingId ? "Update Task" : "Create Task"}
            </button>
            {editingId && <button onClick={() => {setEditingId(null); setTitle(""); setDescription(""); setIsImportant(false);}} className="w-full mt-3 text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Cancel Edit</button>}
          </div>

          {/* List Panel */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-2 px-2">
              <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Your Pipeline ({tasks.length})</span>
            </div>
            {tasks.map((task: any) => (
              <div key={task.id} className={`group bg-[#09090b] border ${task.is_important ? 'border-zinc-500' : 'border-zinc-800'} p-6 rounded-3xl flex items-center justify-between transition-all hover:bg-zinc-900/50`}>
                <div className="flex items-center gap-5">
                  <button onClick={() => toggleComplete(task.id)} className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all ${task.completed ? 'bg-white border-white text-black' : 'border-zinc-800 hover:border-zinc-400'}`}>
                    {task.completed && <span className="font-bold text-[10px]">✓</span>}
                  </button>
                  <div>
                    <h4 className={`text-sm font-bold tracking-tight ${task.completed ? 'line-through text-zinc-600' : 'text-zinc-100'}`}>
                        {task.is_important && <span className="text-zinc-400 mr-2">⭐</span>}
                        {task.title}
                    </h4>
                    <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">{task.description}</p>
                  </div>
                </div>
                <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => startEdit(task)} className="text-[10px] font-black text-zinc-500 hover:text-white transition-colors uppercase tracking-tighter">Edit</button>
                  <button onClick={() => deleteTask(task.id)} className="text-[10px] font-black text-zinc-500 hover:text-red-500 transition-colors uppercase tracking-tighter">Delete</button>
                </div>
              </div>
            ))}
            {tasks.length === 0 && <div className="text-center py-24 text-zinc-700 border-2 border-dashed border-zinc-900 rounded-[40px] text-xs font-medium italic">Empty. Add something important.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}