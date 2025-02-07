import { View, Text, ActivityIndicator } from "react-native";
import { useFetch } from "../../../hooks/useFetch";

const HomeScreen = () => {
  const { data, loading } = useFetch<{ message: string }>("https://api.example.com/home");

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {loading ? <ActivityIndicator size="large" /> : <Text>{data?.message}</Text>}
    </View>
  );
};

export default HomeScreen;
