import { TextInputProps } from "react-native";

export interface KunlaInputProps extends TextInputProps {
  label?: string;
  error?: string;
}
