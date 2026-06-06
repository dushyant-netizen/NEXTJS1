"use client";
import React, { useState } from 'react';

export default function SupportWidget({ userEmail }: { userEmail?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([
    { sender: "AI_AGENT", text: "Hello! I am your automated support agent. I can track order updates or file returns instantly. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput("");
    setMessages(prev => [...prev, { sender: "USER", text: userMsg }]);
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://nextjs1-be-render.onrender.com'}/api/support/agent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          message: userMsg,
          email: userEmail || null
        })
      });

      const data = await response.json();
      if (data.success) {
        setSessionId(data.sessionId);
        setMessages(prev => [...prev, { sender: "AI_AGENT", text: data.reply }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { sender: "AI_AGENT", text: "Connection error. Please try again later." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 text-black font-sans">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white rounded-full p-4 shadow-xl hover:bg-blue-700 transition"
        >
          💬 Live Support AI
        </button>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl shadow-2xl w-80 h-96 flex flex-col justify-between">
          {/* Header */}
          <div className="bg-blue-600 text-white p-3 rounded-t-xl flex justify-between items-center">
            <span className="font-semibold">Autonomous Support Agent</span>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200">✕</button>
          </div>

          {/* Messages Area */}
          <div className="p-3 overflow-y-auto flex-1 space-y-2 text-xs">
            {messages.map((msg, idx) => (
              <div key={idx} className={`p-2 rounded-lg max-w-[85%] ${msg.sender === "USER" ? 'bg-blue-100 ml-auto text-right' : 'bg-gray-100'}`}>
                <strong>{msg.sender === "USER" ? 'You' : 'Agent'}:</strong>
                <p className="mt-0.5">{msg.text}</p>
              </div>
            ))}
            {loading && <p className="text-gray-400 italic">Agent is thinking...</p>}
          </div>

          {/* Input Form */}
          <form onSubmit={sendMessage} className="p-2 border-t border-gray-100 flex gap-1">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about orders or returns..." 
              className="flex-1 border border-gray-300 rounded p-1.5 text-xs outline-none focus:border-blue-500"
            />
            <button type="submit" className="bg-blue-600 text-white text-xs px-3 rounded hover:bg-blue-700">Send</button>
          </form>
        </div>
      )}
    </div>
  );
}