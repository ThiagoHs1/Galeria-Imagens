import axios from 'axios';

// Função para buscar a lista de imagens da API Picsum
export const fetchImages = async (limit = 30) => {
  try {
    const response = await axios.get(`https://picsum.photos/v2/list?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar as imagens:', error);
    throw error;
  }
};
