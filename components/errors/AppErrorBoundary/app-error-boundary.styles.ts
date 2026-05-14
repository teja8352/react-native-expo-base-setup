import { StyleSheet } from "react-native";

export function createStyles() {
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 24,
      backgroundColor: "#0B1220",
    },
    title: {
      fontSize: 20,
      fontWeight: "600",
      color: "#F8FAFC",
      marginBottom: 8,
      textAlign: "center",
    },
    message: {
      fontSize: 14,
      color: "#94A3B8",
      textAlign: "center",
      marginBottom: 24,
    },
    button: {
      minHeight: 44,
      minWidth: 120,
      paddingHorizontal: 16,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#38BDF8",
    },
    buttonLabel: {
      fontSize: 16,
      fontWeight: "600",
      color: "#0F172A",
    },
  });
}
