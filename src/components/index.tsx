"use client";

import { useState, useEffect } from "react";
import { Task } from "@/types";
import TaskModal from "./tax-add.modal";
import DeleteConfirmModal from "./task-delete.modal";
import {
  FiSearch,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiCheckCircle,
} from "react-icons/fi";
import { BsKanban, BsCalendarDate } from "react-icons/bs";
import { MdOutlineWavingHand } from "react-icons/md";

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      try {
        const parsedTasks = JSON.parse(storedTasks);
        setTasks(parsedTasks);
      } catch (err) {
        console.error("Error loading tasks:", err);
        setTasks([]);
      }
    }
  }, []);

  // Persist tasks to localStorage
  const saveToLocalStorage = (updatedTasks: Task[]) => {
    try {
      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
      setTasks(updatedTasks);
    } catch (err) {
      console.error("Error saving tasks:", err);
    }
  };

  // Task management handlers
  const handleAddTask = (task: Task) => {
    const timestamp = new Date().toISOString();
    const newTasks = [
      ...tasks,
      {
        ...task,
        id: Date.now(),
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    ];
    saveToLocalStorage(newTasks);
    setIsAddModalOpen(false);
  };

  const handleEditTask = (task: Task) => {
    const newTasks = tasks.map((t) =>
      t.id === task.id
        ? {
            ...task,
            updatedAt: new Date().toISOString(),
          }
        : t
    );
    saveToLocalStorage(newTasks);
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId: number) => {
    const taskToDelete = tasks.find((t) => t.id === taskId);
    if (!taskToDelete) return;

    const newTasks = tasks.filter((t) => t.id !== taskId);
    saveToLocalStorage(newTasks);
    setDeletingTask(null);
  };

  // Search and filter tasks
  const filteredTasks = tasks
    .filter((task) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        task.title?.toLowerCase().includes(searchLower) ||
        task.description?.toLowerCase().includes(searchLower) ||
        task.priority?.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      // Sort by priority first
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      const priorityDiff =
        (priorityOrder[a.priority || "low"] || 2) -
        (priorityOrder[b.priority || "low"] || 2);
      if (priorityDiff !== 0) return priorityDiff;

      // Then by creation date
      return (
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime()
      );
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 animate-gradient-x">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-12 text-center animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 animate-text">
            Welcome
            <MdOutlineWavingHand className="inline-block text-yellow-400 animate-wave" />
          </h1>
        </header>

        <main className="max-w-6xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20 transform hover:shadow-3xl transition-all duration-500">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="relative w-full md:w-96 group">
                <input
                  type="search"
                  placeholder="Search your tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 text-gray-700 placeholder-gray-400 outline-none transition-all duration-300 group-hover:shadow-xl"
                />
                <FiSearch className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
              </div>

              <button
                onClick={() => setIsAddModalOpen(true)}
                className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 group transform hover:scale-105 active:scale-95"
              >
                <FiPlus className="w-6 h-6 transform group-hover:rotate-180 transition-transform duration-500" />
                Create Task
              </button>
            </div>

            <div className="grid gap-8 sm:grid-cols-1 lg:grid-cols-2">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="group p-8 bg-white rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                >
                  <div className="flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <FiCheckCircle
                          className={`w-6 h-6 ${
                            task.completed ? "text-green-500" : "text-blue-500"
                          } transition-colors duration-500 group-hover:scale-110`}
                        />
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                          {task.title}
                        </h3>
                      </div>
                      <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <button
                          onClick={() => setEditingTask(task)}
                          className="p-3 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all duration-300 transform hover:scale-110 hover:rotate-12"
                        >
                          <FiEdit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setDeletingTask(task)}
                          className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-300 transform hover:scale-110 hover:-rotate-12"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {task.description && (
                      <p className="text-gray-600 mb-4 flex-grow line-clamp-3 hover:line-clamp-none transition-all duration-500">
                        {task.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-2 group-hover:text-blue-500 transition-colors duration-300">
                        <BsCalendarDate className="w-4 h-4" />
                        <span>
                          {new Date(task.createdAt || "").toLocaleDateString(
                            undefined,
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </span>
                      </div>
                      {task.updatedAt && (
                        <div className="flex items-center gap-2 group-hover:text-purple-500 transition-colors duration-300">
                          <span>•</span>
                          <span>
                            Updated:{" "}
                            {new Date(task.updatedAt).toLocaleDateString(
                              undefined,
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredTasks.length === 0 && (
              <div className="text-center py-20 bg-gray-50/50 backdrop-blur-sm rounded-xl border border-gray-100 transform hover:scale-105 transition-all duration-500">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-xl mb-6 animate-bounce">
                  <BsKanban className="w-10 h-10 text-blue-500" />
                </div>
                <p className="text-2xl text-gray-600 font-light">
                  No tasks found. Start by creating a new task!
                </p>
              </div>
            )}
          </div>
        </main>

        <footer className="mt-16 text-center">
          <p className="text-gray-600 text-lg">
            Made using{" "}
            <span className="font-semibold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Next.js
            </span>{" "}
            and{" "}
            <span className="font-semibold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              TailwindCSS
            </span>
          </p>
        </footer>
      </div>

      {/* Modals */}
      <TaskModal
        task={null}
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddTask}
      />

      <TaskModal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        onSubmit={handleEditTask}
        task={editingTask}
      />

      <DeleteConfirmModal
        task={deletingTask}
        isOpen={!!deletingTask}
        onClose={() => setDeletingTask(null)}
        onConfirm={() => deletingTask && handleDeleteTask(deletingTask.id || 0)}
      />
    </div>
  );
}
