// components/Gallery.tsx
import { useEffect, useState } from 'react';
import { fetchImages } from '../services/picsumAPI';
import Modal from './Modal';
import Vibrant from 'node-vibrant';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [authors, setAuthors] = useState<string[]>([]);

  const [selectedImage, setSelectedImage] = useState<null | {
    id: string;
    author: string;
    width: number;
    height: number;
    url: string;
    download_url: string;
    dominantColor: string | null; 
  }>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Categorias e filtros
  const categories = ['Natureza', 'Pessoas', 'Tecnologia', 'Abstrato'];
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const imageList = await fetchImages(6);
       
        const imagesWithColors = await Promise.all(
          imageList.map(async (image) => {
            const dominantColor = await getDominantColor(image.download_url);
            return { ...image, dominantColor, category: assignCategory(image) };
          })
        );
        setImages(imagesWithColors);
        setLoading(false);
      } catch (error) {
        setError('Erro ao carregar as imagens');
        setLoading(false);
      }
    };

    loadImages();
  }, []);

  const handleImageClick = (image: any) => { 
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  // Funções auxiliares
  const assignCategory = (image: any) => {
    const randomIndex = Math.floor(Math.random() * categories.length);
    return categories[randomIndex];
  };

  const getDominantColor = async (imageUrl: string) => {
    try {
      const palette = await Vibrant.from(imageUrl).getPalette();
      return palette.Vibrant?.hex;
    } catch (error) {
      console.error('Erro ao extrair cor dominante:', error);
      return null;
    }

    const toggleFavorite = (image) => {
        const isFavorited = favorites.find((fav) => fav.id === image.id);
        let updatedFavorites;
        
        if (isFavorited) {
          updatedFavorites = favorites.filter((fav) => fav.id !== image.id);
        } else {
          updatedFavorites = [...favorites, image];
        }
      
        setFavorites(updatedFavorites);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites)); // Armazenar no localStorage
      };
      
  };

  if (loading) {
    return <p>Carregando imagens...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  // Filtrar imagens
  const filteredImages = images.filter((image) => {
    if (selectedCategory && image.category !== selectedCategory) {
      return false;
    }
    if (selectedColor && image.dominantColor !== selectedColor) {
      return false;
    }
    return true;
  });

  return (
    <div className="flex flex-col items-center"> {/* Centralizar verticalmente */}
      {/* Filtros */}
      <div className="flex space-x-4 mb-4">
        <select
          value={selectedCategory || ''}
          onChange={(e) => setSelectedCategory(e.target.value || null)}
          className="border border-gray-300 rounded px-2 py-1"
        >
          <option value="">Todas as categorias</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select
          value={selectedColor || ''}
          onChange={(e) => setSelectedColor(e.target.value || null)}
          className="border border-gray-300 rounded px-2 py-1"
        >
          <option value="">Todas as cores</option>
          {images.reduce((uniqueColors, image) => {
            if (image.dominantColor && !uniqueColors.includes(image.dominantColor)) {
              uniqueColors.push(image.dominantColor);
            }
            return uniqueColors;
          }, [] as string[]).map((color) => (
            <option key={color} value={color}>
              {color}
            </option>
          ))}
        </select>
      </div>

      {/* Galeria */}
      
      <div  className="grid grid-cols-2 md:grid-cols-3 gap-6 p-6 bg-gray-100 rounded-lg shadow-lg max-w-5xl">
        {filteredImages.map((image) => (
          <div
            key={image.id}
            className="relative group"
            onClick={() => handleImageClick(image)}
          >
  
        
            {/* Imagem */}
            <img
              src={image.download_url}
              alt={image.author}
              className="w-full h-64 object-cover rounded-lg group-hover:opacity-80 transition cursor-pointer"
            />
            
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-center py-2 opacity-0 group-hover:opacity-100 transition">
              <p className="text-sm">{image.author}</p>
            </div>
            
          </div>
        ))}
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal} image={selectedImage} />
    </div>
  );
};

export default Gallery;