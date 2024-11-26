"use client";

import { useState, useEffect } from "react";
import { Task } from "@/types";
import { BiTask, BiCalendar, BiFlag } from "react-icons/bi";
import { MdDescription } from "react-icons/md";
import { IoClose } from "react-icons/io5";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: Task) => void;
  task: Task | null;
}

export default function TaskModal({
  isOpen,
  onClose,
  onSubmit,
  task = null,
}: TaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [dueDate, setDueDate] = useState("");
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setPriority(task.priority || "medium");
      setDueDate(task.dueDate || "");
    } else {
      setTitle("");
      setDescription("");
      setPriority("medium");
      setDueDate("");
    }
  }, [task, isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: task?.id || 0,
      title,
      description,
      priority,
      dueDate,
      createdAt: task?.createdAt || new Date().toISOString(),
      completed: task?.completed || false,
    });
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 bg-white/20 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 md:p-8 z-50 transition-all duration-700 ${
        isClosing ? "opacity-0" : "opacity-100"
      }`}
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div
        className={`relative bg-white rounded-3xl shadow-[0_20px_70px_-10px_rgba(0,0,0,0.15)] max-w-lg w-full transform transition-all duration-700 ${
          isClosing
            ? "scale-90 translate-y-20 rotate-2 opacity-0"
            : "scale-100 translate-y-0 rotate-0 opacity-100"
        } hover:scale-[1.02] animate-modal-float`}
      >
        <div className="absolute -top-3 -right-3 z-10">
          <button
            onClick={handleClose}
            className="p-2 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 group hover:rotate-180"
          >
            <IoClose className="w-5 h-5 text-gray-400 group-hover:text-rose-500 transition-colors" />
          </button>
        </div>

        <div className="relative overflow-hidden rounded-3xl">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-sky-400 via-violet-400 to-fuchsia-400 animate-gradient" />

          <div className="p-8 space-y-8">
            <div className="relative">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-40 h-40 bg-gradient-to-r from-sky-100 to-violet-100 rounded-full blur-3xl animate-pulse-slow" />
              <h2 className="relative text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-violet-600 text-center animate-fade-in">
                {task ? "Edit Task" : "Create New Task"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div
                className="space-y-2 animate-slide-up"
                style={{ animationDelay: "0.1s" }}
              >
                <div className="flex items-center gap-2 text-gray-600">
                  <BiTask className="w-5 h-5" />
                  <label className="font-medium">Title</label>
                </div>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="Form-input"
                  required
                  maxLength={20}
                  placeholder="What needs to be done?"
                />
              </div>

              <div
                className="space-y-2 animate-slide-up"
                style={{ animationDelay: "0.2s" }}
              >
                <div className="flex items-center gap-2 text-gray-600">
                  <MdDescription className="w-5 h-5" />
                  <label className="font-medium">Description</label>
                </div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="Form-input"
                  rows={4}
                  placeholder="Add more details about this task..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div
                  className="space-y-2 animate-slide-up"
                  style={{ animationDelay: "0.3s" }}
                >
                  <div className="flex items-center gap-2 text-gray-600">
                    <BiFlag className="w-5 h-5" />
                    <label className="font-medium">Priority</label>
                  </div>
                  <select
                    value={priority}
                    onChange={(e) =>
                      setPriority(e.target.value as "low" | "medium" | "high")
                    }
                    className="Form-input"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>

                <div
                  className="space-y-2 animate-slide-up"
                  style={{ animationDelay: "0.4s" }}
                >
                  <div className="flex items-center gap-2 text-gray-600">
                    <BiCalendar className="w-5 h-5" />
                    <label className="font-medium">Due Date</label>
                  </div>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="Form-input"
                  />
                </div>
              </div>

              <div
                className="flex flex-col sm:flex-row justify-end gap-4 pt-6 animate-slide-up"
                style={{ animationDelay: "0.5s" }}
              >
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full sm:w-auto px-8 py-3.5 text-gray-600 bg-gray-50 rounded-xl font-medium hover:bg-gray-100 focus:ring-2 focus:ring-gray-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-sky-500 to-violet-500 hover:from-sky-600 hover:to-violet-600 text-white rounded-xl font-medium shadow-xl shadow-violet-200 hover:shadow-2xl hover:shadow-violet-300 focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 transform hover:scale-105 hover:-translate-y-1 active:scale-95 transition-all duration-300"
                >
                  {task ? "Save Changes" : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
