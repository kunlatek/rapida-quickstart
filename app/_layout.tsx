import { AuthProvider } from "@/context/AuthContext";
import StackNavigator from "@/components/navigation/StackNavigator";

const RootLayout = () => {
  return (
    <AuthProvider>
      <StackNavigator />
    </AuthProvider>
  );
};

export default RootLayout;
