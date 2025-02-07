import { View, Text, Button } from "react-native";
import { useAuth } from "../../../context/AuthContext";

const ProfileScreen = () => {
  const { user, logout } = useAuth();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Bem-vindo, {user}!</Text>
      <Button title="Sair" onPress={logout} />
    </View>
  );
};

export default ProfileScreen;
