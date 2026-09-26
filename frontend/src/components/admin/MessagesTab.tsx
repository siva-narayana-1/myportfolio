"use client";

import { useState, useEffect } from "react";
import { Trash2, AlertCircle, Loader } from "lucide-react";

type Message = {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read?: boolean;
  createdAt?: string;
};

export default function MessagesTab() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("auth_token") || "";
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/admin/messages`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      setError("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id || !confirm("Delete this message?")) return;

    try {
      const token = localStorage.getItem("auth_token") || "";
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      await fetch(`${apiUrl}/api/admin/messages/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      await fetchMessages();
      setSelectedMessage(null);
    } catch (err) {
      setError("Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="text-slate-400 mt-1">
          Messages from your portfolio contact form
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3 text-red-400 text-sm">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader className="animate-spin" size={32} />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-slate-800/50 border border-white/10 rounded-xl overflow-hidden">
              <div className="max-h-[600px] overflow-y-auto">
                {messages.length === 0 ? (
                  <div className="p-6 text-center text-slate-400">
                    No messages yet
                  </div>
                ) : (
                  messages.map((msg) => (
                    <button
                      key={msg.id}
                      onClick={() => setSelectedMessage(msg)}
                      className={`w-full text-left p-4 border-b border-white/5 hover:bg-white/5 transition-colors ${
                        selectedMessage?.id === msg.id
                          ? "bg-cyan-500/20 border-l-2 border-l-cyan-500"
                          : ""
                      }`}
                    >
                      <p className="font-medium truncate">{msg.name}</p>
                      <p className="text-xs text-slate-400 truncate">
                        {msg.subject}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {new Date(msg.createdAt || "").toLocaleDateString()}
                      </p>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            {selectedMessage ? (
              <div className="bg-slate-800/50 border border-white/10 rounded-xl p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedMessage.name}</h2>
                    <p className="text-slate-400 text-sm mt-1">
                      {selectedMessage.email}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="p-2 text-red-400 hover:bg-red-500/20 rounded transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="mb-4">
                  <h3 className="font-bold mb-2">Subject</h3>
                  <p className="text-slate-300">{selectedMessage.subject}</p>
                </div>

                <div className="mb-4 pb-4 border-b border-white/10">
                  <h3 className="font-bold mb-2">Message</h3>
                  <p className="text-slate-300 whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>

                <p className="text-xs text-slate-400">
                  {new Date(selectedMessage.createdAt || "").toLocaleString()}
                </p>
              </div>
            ) : (
              <div className="bg-slate-800/50 border border-white/10 rounded-xl p-12 text-center">
                <p className="text-slate-400">Select a message to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

