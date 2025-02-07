import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthContextType {
  user: string | null;
  isLoading: boolean;
  login: (username: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Criando o contexto
export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) setUser(storedUser);
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (username: string) => {
    try {
      await AsyncStorage.setItem("user", username);
      setUser(username);
    } catch (error) {
      console.error("Erro ao salvar usuário:", error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("user");
      setUser(null);
    } catch (error) {
      console.error("Erro ao remover usuário:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Exportando o hook personalizado
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
