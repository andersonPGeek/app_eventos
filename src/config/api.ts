export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://events-br-render.onrender.com';

export const API_ENDPOINTS = {
    eventos: `${API_BASE_URL}/api/eventos`,
    agenda: `${API_BASE_URL}/api/agenda/evento`,
    palestras: `${API_BASE_URL}/api/detalhes-palestra`,
    categoriasProduto: `${API_BASE_URL}/api/categorias-produto`,
    produtos: `${API_BASE_URL}/api/produtos`,
    categoriasPatrocinio: `${API_BASE_URL}/api/categorias-patrocinio`,
    empresas: `${API_BASE_URL}/api/empresas`,
    checkins: `${API_BASE_URL}/api/checkins`,
    auth: {
        login: `${API_BASE_URL}/api/auth/login`,
        criarSenha: `${API_BASE_URL}/api/auth/criar-senha`,
        resetarSenha: `${API_BASE_URL}/api/auth/resetar-senha`,
        recuperarSenha: `${API_BASE_URL}/api/auth/recuperar-senha`
    }
}; 