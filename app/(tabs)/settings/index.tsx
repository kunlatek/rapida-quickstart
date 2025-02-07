import { View, Text, Button, StyleSheet, Alert } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { styles } from "./styles";

const SettingsScreen = () => {
  const { logout, user } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      "Confirmar Logout",
      "Tem certeza de que deseja sair?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sair",
          onPress: () => {
            logout();
            router.replace("/login" as any);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configurações</Text>
      <Text style={styles.userText}>Usuário: {user}</Text>

      <Button title="Sair da Conta" onPress={handleLogout} color="red" />
    </View>
  );
};

export default SettingsScreen;
