import React from "react";
import { XCircle } from "lucide-react"; // Icône moderne, nécessite lucide-react

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-40 backdrop-blur-sm z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 animate-fade-in relative border border-gray-200">
        <div className="flex flex-col items-center text-center space-y-4">
          <XCircle className="text-red-500 w-10 h-10" />
          <p className="text-gray-800 text-base font-medium">{message}</p>
          <button
            onClick={onClose}
            className="mt-2 px-5 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
