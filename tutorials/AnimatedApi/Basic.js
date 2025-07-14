import { useEffect, useRef } from "react";
import { StyleSheet, Text, View, Animated } from "react-native";

// V C F
const Basic = () => {
  const position = useRef(new Animated.Value(0)).current;

  const startPosition = () => {
    Animated.timing(position, {
      toValue: 200,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(position, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    });
  };

  useEffect(() => {
    startPosition();
  }, []);

  return (
    <View>
      <Animated.View
        style={[styles.box, { transform: [{ translateX: position }] }]}
      />
    </View>
  );
};

export default Basic;

const styles = StyleSheet.create({
  box: {
    height: 150,
    width: 150,
    backgroundColor: "orange",
  },
});
