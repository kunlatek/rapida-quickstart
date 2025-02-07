import { Stack } from "expo-router";
import { useAuth } from "../../../context/AuthContext";
import { Button } from "react-native";

const StackNavigator = () => {
  const { user, logout } = useAuth();

  return (
    <Stack>
      {/* Rotas Logadas */}
      {user ? (
        <>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="profile" options={{ title: "Perfil" }} />
          <Stack.Screen name="settings" options={{ title: "Configurações" }} />
          <Stack.Screen
            name="logout"
            options={{
              title: "Sair",
              headerRight: () => <Button title="Logout" onPress={logout} />,
            }}
          />
        </>
      ) : (
        // Rotas para Usuários Deslogados
        <>
          <Stack.Screen name="(auth)/login" options={{ title: "Login" }} />
          <Stack.Screen name="(auth)/register" options={{ title: "Cadastro" }} />
        </>
      )}

      {/* Página de erro */}
      <Stack.Screen name="+not-found" />
    </Stack>
  );
};

export default StackNavigator;
