export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
    eventos: `${API_BASE_URL}/api/eventos`,
    agenda: `${API_BASE_URL}/api/agenda/evento`,
    palestras: `${API_BASE_URL}/api/detalhes-palestra`,
    categoriasProduto: `${API_BASE_URL}/api/categorias-produto`,
    produtos: `${API_BASE_URL}/api/produtos`
}; 