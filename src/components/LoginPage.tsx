import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import CreatePassword from "./CreatePassword";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [needsPasswordCreation, setNeedsPasswordCreation] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Iniciando tentativa de login...');
    console.log('Email fornecido:', email);
    
    setError("");
    setLoading(true);

    try {
      // Verifica se email e senha são iguais
      if (email === password) {
        console.log('Email e senha são iguais, redirecionando para criação de senha');
        setNeedsPasswordCreation(true);
        setLoading(false);
        return;
      }

      console.log('Chamando função de login...');
      const result = await login(email, password);
      console.log('Resultado do login:', result);

      if (result.success) {
        console.log('Login bem-sucedido');
        if (result.requirePasswordCreation) {
          console.log('Usuário precisa criar senha');
          setNeedsPasswordCreation(true);
        }
      } else {
        console.log('Login falhou');
        setError("Email ou senha inválidos");
      }
    } catch (error) {
      console.error('Erro durante o login:', error);
      setError("Ocorreu um erro ao fazer login. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (needsPasswordCreation) {
    return <CreatePassword email={email} />;
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-blue-50 to-white px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-6 sm:p-8 rounded-xl shadow-lg">
        <div className="space-y-4">
          <img
            src="/icons/icon-72x72.jpg"
            alt="Logo"
            className="mx-auto h-16 w-16 rounded-xl"
          />
          <h2 className="mt-4 text-center text-2xl sm:text-3xl font-bold text-gray-900">
            Bem-vindo ao Sublime
          </h2>
          <p className="text-center text-sm text-gray-600">
            Faça login para acessar o evento
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="w-full px-4 py-2"
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Senha
              </label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Senha"
                required
                className="w-full px-4 py-2"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full py-2 px-4"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                Entrando...
              </div>
            ) : (
              "Entrar"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
