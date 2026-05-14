import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { HREF_INDEX } from "@/constants";

export default function NotFoundRoute() {
  return (
    <>
      <Stack.Screen options={{ title: "Not found" }} />
      <View style={styles.container}>
        <Text style={styles.title}>This screen does not exist.</Text>
        <Link href={HREF_INDEX} style={styles.link}>
          Return home
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  link: {
    fontSize: 16,
    color: "#208AEF",
  },
});
