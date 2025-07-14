import { useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Animated,
  useAnimatedValue,
} from "react-native";

// V C F
const Values = () => {
  const position = useAnimatedValue(0);
  const basePosition = useAnimatedValue(50);
  const positionOcilaration = useAnimatedValue(0);
  const combineOcilaration = Animated.add(basePosition, positionOcilaration);

  //   const position = useRef(new Animated.Value(0)).current;
  const positionXY = useRef(new Animated.ValueXY({ x: 0, y: 20 })).current;

  const startPositionXY = () => {
    Animated.timing(positionXY, {
      toValue: { x: 200, y: 100 },
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  //   const startPosition = () => {
  //     Animated.timing(position, {
  //       toValue: 200,
  //       duration: 1000,
  //       useNativeDriver: true,
  //     }).start(() => {
  //       Animated.timing(position, {
  //         toValue: 0,
  //         duration: 1000,
  //         useNativeDriver: true,
  //       }).start();
  //     });
  //   };

  const startOcilaration = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(positionOcilaration, {
          toValue: 50,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(positionOcilaration, {
          toValue: -50,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
      { iterations: 5 }
    ).start();
  };
  useEffect(() => {
    startOcilaration();
    // startPositionXY();
  }, []);

  return (
    <View>
      <Animated.View
        style={[styles.box, { transform: [{ translateX: position }] }]}
      />
      {/* <Animated.View
        style={[styles.box2, positionXY.getTranslateTransform()]}
      /> */}
      <Animated.View
        style={[
          styles.circle,
          { transform: [{ translateX: combineOcilaration }] },
        ]}
      />
    </View>
  );
};

export default Values;

const styles = StyleSheet.create({
  box: {
    height: 150,
    width: 150,
    backgroundColor: "orange",
  },
  box2: {
    height: 150,
    width: 150,
    backgroundColor: "yellow",
    marginTop: 20,
  },
  circle: {
    height: 150,
    width: 150,
    borderRadius: 250,
    backgroundColor: "green",
    marginTop: 20,
  },
});
