import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    margin: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: "#fff",
  },
  input: {
    width: 300,
    height: 40,
    borderWidth: 1,
    borderColor: "#fff",
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: "#25292e",
    color: "#fff",
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 3,
  },
});

export default styles;
