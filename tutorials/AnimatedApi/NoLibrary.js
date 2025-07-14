import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";

const NoLibrary = () => {
  const [positions, setPosition] = useState(0);

  useEffect(() => {
    let interval;
    interval = setInterval(() => {
      setPosition((prev) => (prev < 300 ? prev + 5 : 0));
    }, 10);

    return () => clearInterval(interval);
  }, []);

  return <View style={[styles.box,{marginLeft:positions}]} />;
};

export default NoLibrary;

const styles = StyleSheet.create({
  box: {
    height: 50,
    width: 50,
    backgroundColor: "yellow",
  },
});
