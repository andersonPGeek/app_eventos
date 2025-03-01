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
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [needsPasswordCreation, setNeedsPasswordCreation] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const { login, resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      if (email === password) {
        setNeedsPasswordCreation(true);
        setLoading(false);
        return;
      }

      const result = await login(email, password);

      if (result.success) {
        if (result.requirePasswordCreation) {
          setNeedsPasswordCreation(true);
        }
      } else {
        setError("Email ou senha inválidos");
      }
    } catch (error) {
      setError("Ocorreu um erro ao fazer login. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const result = await resetPassword(email);
      if (result) {
        setSuccessMessage("Email de recuperação enviado com sucesso! Por favor, verifique sua caixa de entrada.");
        setIsResettingPassword(false);
      } else {
        setError("Não foi possível enviar o email de recuperação. Por favor, tente novamente.");
      }
    } catch (error) {
      setError("Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.");
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
            {isResettingPassword ? "Recuperar Senha" : "Bem-vindo ao Sublime"}
          </h2>
          <p className="text-center text-sm text-gray-600">
            {isResettingPassword 
              ? "Digite seu email para receber o link de recuperação" 
              : "Faça login para acessar o evento"}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={isResettingPassword ? handleResetPassword : handleSubmit}>
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

            {!isResettingPassword && (
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
            )}
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="text-green-500 text-sm text-center bg-green-50 p-2 rounded">
              {successMessage}
            </div>
          )}

          <div className="space-y-4">
            <Button
              type="submit"
              className="w-full py-2 px-4"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                  {isResettingPassword ? "Enviando..." : "Entrando..."}
                </div>
              ) : (
                isResettingPassword ? "Enviar link de recuperação" : "Entrar"
              )}
            </Button>

            <button
              type="button"
              onClick={() => {
                setIsResettingPassword(!isResettingPassword);
                setError("");
                setSuccessMessage("");
              }}
              className="w-full text-sm text-blue-600 hover:text-blue-800 text-center"
            >
              {isResettingPassword 
                ? "Voltar para o login" 
                : "Esqueceu sua senha?"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
