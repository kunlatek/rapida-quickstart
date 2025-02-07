import { useState } from "react";
import { useAuth } from "./useAuth";

export const useLogin = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");

  const handleLogin = () => {
    if (username.trim() !== "") {
      login(username);
    }
  };

  return { username, setUsername, handleLogin };
};
