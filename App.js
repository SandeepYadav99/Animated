import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import Basic from "./tutorials/AnimatedApi/Basic";
import Values from "./tutorials/AnimatedApi/Values";
import Interpolration from "./tutorials/AnimatedApi/Interpolration";
import AnimTypes from "./tutorials/AnimatedApi/AnimTypes";
import CarGameWithSkia from "./tutorials/Skia/CarGameWithSkia";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <CarGameWithSkia />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  text: {
    color: "#fff",
    fontSize: 22,
    textAlign: "center",
    fontWeight: "700",
    marginVertical: 15,
    textDecorationLine: "underline",
  },
});
