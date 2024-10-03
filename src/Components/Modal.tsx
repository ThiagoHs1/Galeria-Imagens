// components/Modal.tsx
import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: {
    id: string;
    author: string;
    width: number;
    height: number;
    url: string;
    download_url: string;
  } | null;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, image }) => {
  if (!isOpen || !image) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300"
      onClick={onClose} // Fecha o modal ao clicar no fundo
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-1/2 max-w-3xl relative"
        onClick={(e) => e.stopPropagation()} // Impede que o clique no modal feche-o
      >
        {/* Botão para fechar o modal */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-full p-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <img src={image.download_url} alt={image.author} className="w-full h-auto mb-4 rounded-lg" />
        <div>
          <p className="font-bold">Autor:</p>
          <p>{image.author}</p>
        </div>
        <div>
          <p className="font-bold">Dimensões:</p>
          <p>{image.width} x {image.height}</p>
        </div>
        <div>
          <p className="font-bold">URL:</p>
          <a href={image.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
            {image.url}
          </a>
        </div>
        
      </div>
    </div>
  );
};

export default Modal;