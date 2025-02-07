import { View, Text, Button, TextInput } from "react-native";
import { useLogin } from "../../../hooks/useLogin";
import { styles } from "./styles";

const LoginScreen = () => {
  const { username, setUsername, handleLogin } = useLogin();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite seu nome"
        onChangeText={setUsername}
        value={username}
      />
      <Button title="Entrar" onPress={handleLogin} />
    </View>
  );
};

export default LoginScreen;
