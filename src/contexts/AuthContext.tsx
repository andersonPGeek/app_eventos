import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';

interface AuthContextType {
  isAuthenticated: boolean;
  userId: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; requirePasswordCreation: boolean }>;
  createPassword: (email: string, password: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const storedAuth = localStorage.getItem('isAuthenticated');
    return storedAuth === 'true';
  });
  
  const [userId, setUserId] = useState<string | null>(() => {
    return localStorage.getItem('userId');
  });

  // Persiste o estado de autenticação
  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated.toString());
    if (userId) {
      localStorage.setItem('userId', userId);
    } else {
      localStorage.removeItem('userId');
    }
  }, [isAuthenticated, userId]);

  const login = async (email: string, password: string) => {
    try {
      console.log('Iniciando processo de login...');
      console.log('URL da API:', API_ENDPOINTS.auth.login);
      console.log('Dados enviados:', { email });

      const response = await fetch(API_ENDPOINTS.auth.login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Email: email, senha: password }),
      });

      console.log('Status da resposta:', response.status);
      
      if (!response.ok) {
        console.error('Erro na resposta da API:', response.status, response.statusText);
        throw new Error('Erro na autenticação');
      }

      const data = await response.json();
      console.log('Dados recebidos:', {
        autenticado: data.autenticado,
        primeiroAcesso: data.primeiroAcesso,
        temIdUsuario: !!data.id_usuario
      });
      
      if (!data.autenticado) {
        console.log('Autenticação falhou - usuário não autenticado');
        throw new Error('Usuário ou senha inválidos');
      }

      console.log('Login bem-sucedido, atualizando estado...');
      setIsAuthenticated(true);
      setUserId(data.id_usuario);
      console.log('Estado atualizado - usuário autenticado');

      return {
        success: true,
        requirePasswordCreation: data.primeiroAcesso
      };
    } catch (error) {
      console.error('Erro detalhado no login:', error);
      return {
        success: false,
        requirePasswordCreation: false
      };
    }
  };

  const createPassword = async (email: string, password: string) => {
    try {
      console.log('Iniciando criação de senha...');
      console.log('URL da API:', API_ENDPOINTS.auth.criarSenha);
      console.log('Dados enviados:', { email });

      const response = await fetch(API_ENDPOINTS.auth.criarSenha, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Email: email, senha: password }),
      });

      console.log('Status da resposta:', response.status);

      if (!response.ok) {
        console.error('Erro na resposta da API:', response.status, response.statusText);
        throw new Error('Erro ao criar senha');
      }

      console.log('Senha criada com sucesso');
      return true;
    } catch (error) {
      console.error('Erro detalhado ao criar senha:', error);
      return false;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      console.log('🔄 Iniciando recuperação de senha no AuthContext...');
      console.log('📍 URL da API:', API_ENDPOINTS.auth.recuperarSenha);
      console.log('📧 Email a ser enviado:', email);
      console.log('📦 Payload:', JSON.stringify({ Email: email }, null, 2));

      const response = await fetch(API_ENDPOINTS.auth.recuperarSenha, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Email: email }),
      });

      console.log('📥 Status da resposta:', response.status);
      console.log('📥 Status text:', response.statusText);
      
      const responseData = await response.text();
      console.log('📥 Corpo da resposta:', responseData);

      if (!response.ok) {
        console.error('❌ Erro na resposta da API:', {
          status: response.status,
          statusText: response.statusText,
          body: responseData
        });
        throw new Error(`Erro ao enviar email de recuperação: ${response.status} - ${responseData}`);
      }

      console.log('✅ Email de recuperação enviado com sucesso');
      return true;
    } catch (error) {
      console.error('❌ Erro detalhado na recuperação de senha:', error);
      console.error('Tipo do erro:', error instanceof Error ? 'Error' : typeof error);
      if (error instanceof Error) {
        console.error('Mensagem do erro:', error.message);
        console.error('Stack trace:', error.stack);
      }
      return false;
    }
  };

  const logout = () => {
    console.log('Realizando logout...');
    setIsAuthenticated(false);
    setUserId(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userId');
    console.log('Logout concluído - estado limpo');
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      userId, 
      login, 
      createPassword, 
      resetPassword,
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export default AuthContext; 