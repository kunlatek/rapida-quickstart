import React from "react";
import { TextInput, View, Text } from "react-native";
import { KunlaInputProps } from "./types";
import styles from "./styles";

const KunlaInput: React.FC<KunlaInputProps> = ({ label, error, ...props }) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput style={[styles.input, error && styles.inputError]} {...props} />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default KunlaInput;
