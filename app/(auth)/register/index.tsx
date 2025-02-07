import { useState } from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import KunlaInput from "../../../components/forms/KunlaInput";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { styles } from "./styles";

const RegisterScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const router = useRouter();

  const handleRegister = () => {
    if (!username || !password || !confirmPassword) {
      setError("Todos os campos são obrigatórios.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    // Aqui, poderíamos chamar uma API para registrar o usuário
    // Como ainda não temos um backend, apenas simulamos o login
    Alert.alert("Cadastro realizado!", `Bem-vindo, ${username}!`);
    login(username);
    router.replace("/home" as any);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>

      <KunlaInput
        label="Usuário"
        placeholder="Digite seu nome de usuário"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      <KunlaInput
        label="Senha"
        placeholder="Digite sua senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <KunlaInput
        label="Confirmar Senha"
        placeholder="Confirme sua senha"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Button title="Cadastrar" onPress={handleRegister} />

      <Text style={styles.loginText} onPress={() => router.replace("/login" as any)}>
        Já tem uma conta? Faça login!
      </Text>
    </View>
  );
};

export default RegisterScreen;
