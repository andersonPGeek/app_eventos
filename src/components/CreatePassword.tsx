import React, { useState } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

interface CreatePasswordProps {
  email?: string; // Email opcional para o fluxo de primeiro acesso
}

const CreatePassword = ({ email: firstAccessEmail }: CreatePasswordProps) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { createPassword, login } = useAuth();
  const navigate = useNavigate();
  const { email: recoveryEmail } = useParams();

  // Decodifica o email da URL e usa o email do primeiro acesso ou o email da recuperação de senha
  const email = firstAccessEmail || (recoveryEmail ? decodeURIComponent(recoveryEmail) : '');

  console.log('📧 Email recebido (primeiro acesso):', firstAccessEmail);
  console.log('📧 Email recebido (recuperação):', recoveryEmail);
  console.log('📧 Email decodificado:', email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Email inválido');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      const success = await createPassword(email, password);
      if (success) {
        // Após criar a senha, fazer login automático
        const loginResult = await login(email, password);
        if (loginResult.success) {
          navigate('/');
        } else {
          throw new Error('Erro ao fazer login após criar senha');
        }
      } else {
        throw new Error('Erro ao criar senha');
      }
    } catch (error) {
      setError('Ocorreu um erro ao criar sua senha. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center text-red-500">
            Link de recuperação inválido. Por favor, solicite um novo link.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-6 sm:p-8 rounded-xl shadow-lg">
        <div>
          <img
            src="/icons/icon-72x72.jpg"
            alt="Logo"
            className="mx-auto h-16 w-16 rounded-xl"
          />
          <h2 className="mt-6 text-center text-2xl sm:text-3xl font-bold text-gray-900">
            {firstAccessEmail ? 'Crie sua senha' : 'Crie sua nova senha'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {firstAccessEmail 
              ? 'Para acessar o sistema, crie uma senha segura'
              : 'Digite uma nova senha para sua conta'}
          </p>
          <p className="mt-1 text-center text-sm text-primary">
            {email}
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nova senha"
                className="w-full"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirme a senha"
                className="w-full"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                Criando senha...
              </div>
            ) : (
              firstAccessEmail ? "Criar senha" : "Criar nova senha"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreatePassword; 