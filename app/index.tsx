import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { View, ActivityIndicator } from "react-native";

const Index = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      router.replace(user ? "/home" as any : "/login" as any);
    }
  }, [user, isLoading]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
};

export default Index;
