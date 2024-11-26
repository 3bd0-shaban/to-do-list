import { Task } from "@/types";
import { useEffect, memo, useState } from "react";
import { MdDeleteForever } from "react-icons/md";
import { FiAlertTriangle } from "react-icons/fi";
import { IoClose } from "react-icons/io5";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  task: Task | null;
}

const DeleteConfirmModal = memo(
  ({ isOpen, onClose, onConfirm, task }: DeleteConfirmModalProps) => {
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
      if (!isOpen) return;

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") handleClose();
      };

      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEscape);

      return () => {
        document.body.style.overflow = "unset";
        window.removeEventListener("keydown", handleEscape);
      };
    }, [isOpen, onClose]);

    const handleClose = () => {
      setIsClosing(true);
      setTimeout(() => {
        setIsClosing(false);
        onClose();
      }, 500);
    };

    const handleConfirm = () => {
      setIsClosing(true);
      setTimeout(() => {
        setIsClosing(false);
        onConfirm();
      }, 500);
    };

    if (!isOpen) return null;

    return (
      <div
        className={`fixed inset-0 bg-white/10 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 md:p-8 z-50 transition-all duration-500 ${
          isClosing ? "opacity-0" : "opacity-100"
        }`}
        onClick={(e) => e.target === e.currentTarget && handleClose()}
      >
        <div
          className={`relative bg-white rounded-3xl shadow-[0_20px_70px_-10px_rgba(0,0,0,0.2)] max-w-lg w-full p-8 transform transition-all duration-500 ${
            isClosing
              ? "scale-95 translate-y-10 opacity-0"
              : "scale-100 translate-y-0 opacity-100"
          } hover:scale-[1.02] animate-modal-slide`}
        >
          <div className="absolute -top-3 -right-3">
            <button
              onClick={handleClose}
              className="p-2 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group hover:rotate-90"
            >
              <IoClose className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
            </button>
          </div>

          <div className="text-center space-y-8">
            <div className="relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-32 bg-red-100 rounded-full blur-3xl animate-pulse" />
              <div className="relative">
                <div className="mx-auto flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-tr from-red-500 to-rose-400 shadow-xl shadow-red-200 mb-4 group transform hover:scale-110 transition-all duration-500 hover:rotate-3 hover:shadow-2xl">
                  <MdDeleteForever className="w-12 h-12 text-white group-hover:rotate-12 transition-all duration-500 animate-bounce" />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-600">
                  Delete Task
                </h3>
                <p className="text-gray-500 text-lg">
                  Are you sure you want to delete this task?
                </p>
              </div>

              <div className="relative mx-auto max-w-md transform hover:scale-105 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-red-100 to-rose-100 rounded-2xl transform rotate-1 animate-pulse"></div>
                <div className="relative p-6 bg-white rounded-2xl shadow-sm border border-red-100 backdrop-blur-sm">
                  <p className="text-xl font-medium text-gray-700">
                    &quot;{task?.title}&quot;
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-amber-600">
                <FiAlertTriangle className="w-5 h-5 animate-bounce" />
                <p className="text-sm font-medium">
                  This action cannot be undone
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <button
                onClick={handleClose}
                className="w-full sm:w-auto px-8 py-3.5 text-gray-600 bg-gray-50 rounded-xl font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white rounded-xl font-medium shadow-xl shadow-red-200 hover:shadow-2xl hover:shadow-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transform hover:scale-105 hover:-translate-y-1 active:scale-95 transition-all duration-300"
              >
                Delete Task
              </button>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes modal-slide {
            from {
              opacity: 0;
              transform: scale(0.95) translateY(-40px);
            }
            to {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }

          .animate-modal-slide {
            animation: modal-slide 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
        `}</style>
      </div>
    );
  }
);

DeleteConfirmModal.displayName = "DeleteConfirmModal";

export default DeleteConfirmModal;
