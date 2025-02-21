import { useState, useEffect, useRef } from "react";
import { View, Text, Animated, StyleSheet } from "react-native";

export default function SaveNotification({ trigger }) {
  const [showNotification, setShowNotification] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current; // Valor inicial de opacidade 0

  useEffect(() => {
    if (trigger) {
      setShowNotification(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start(() => setShowNotification(false));
        }, 1000);
      });
    }
  }, [trigger]);

  if (!showNotification) return null;

  return (
    // <Animated.View >
      <Text style={styles.text}>Salvo com sucesso!</Text>
    // </Animated.View>
  );
}

const styles = StyleSheet.create({
  notification: {
    position: "absolute",
    top: 50,
    left: "50%",
    transform: [{ translateX: -100 }],
    backgroundColor: "green",
    padding: 10,
    borderRadius: 8,
    zIndex:30
  },
  text: {
    color: "white",
    fontWeight: "bold",
  },
});
