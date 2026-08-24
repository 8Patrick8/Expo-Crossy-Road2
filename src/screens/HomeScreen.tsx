import React from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Hand from "@/components/HandCTA";
import Footer from "@/components/Home/Footer";
import GameContext from "@/context/GameContext";
import { getTodayKey } from "@/utils/prng";

let hasShownTitle = false;

function Screen(props) {
  const { setMode, highscore } = React.useContext(GameContext);
  const animation = new Animated.Value(0);

  const handlePlayClassic = () => {
    setMode("classic");
    props.onPlay();
  };

  const handlePlayDaily = () => {
    setMode("daily");
    props.onPlayDaily();
  };

  React.useEffect(() => {
    function onKeyUp({ keyCode }) {
      // Space, up-arrow
      if ([32, 38].includes(keyCode)) {
        handlePlayClassic();
      }
    }

    window.addEventListener("keyup", onKeyUp, false);
    return () => {
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  React.useEffect(() => {
    if (!hasShownTitle) {
      hasShownTitle = true;

      Animated.timing(animation, {
        useNativeDriver: process.env.EXPO_OS !== "web",
        toValue: 1,
        duration: 800,
        delay: 0,
      }).start();
    }
  }, []);

  const { top, bottom, left, right } = useSafeAreaInsets();

  const animatedTitleStyle = {
    transform: [
      {
        translateX: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [-Dimensions.get("window").width, 0],
        }),
      },
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [-100, 0],
        }),
      },
    ],
  };
  // console.log(props);
  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: top,
          paddingBottom: bottom,
          paddingLeft: left,
          paddingRight: right,
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={1.0}
        style={[
          StyleSheet.absoluteFill,
          { justifyContent: "center", alignItems: "center" },
        ]}
        onPressIn={() => {
          Animated.timing(animation, {
            toValue: 0,
            duration: 400,
            useNativeDriver: process.env.EXPO_OS !== "web",
            easing: Easing.in(Easing.qubic),
            onComplete: ({ finished }) => {
              if (finished) {
                handlePlayClassic();
              }
            },
          }).start();
        }}
      >
        <Text style={styles.coins}>{props.coins}</Text>
        <Animated.Image
          source={require("../../assets/images/title.png")}
          style={[styles.title, animatedTitleStyle]}
        />

        <Text style={styles.highscore}>TOP {highscore}</Text>

        <View
          style={{
            justifyContent: "center",
            alignItems: "stretch",
            position: "absolute",
            bottom: Math.max(bottom, 8),
            left: Math.max(left, 8),
            right: Math.max(right, 8),
          }}
        >
          <View style={{ height: 64, marginBottom: 48, alignItems: "center" }}>
            {/* {!__DEV__ && <Hand style={{ width: 36 }} />} */}
          </View>
          {/* <Footer
            onCharacterSelect={() => {
              props.onShowCharacterSelect?.();
            }}
            onShop={() => {}}
            onMultiplayer={() => {}}
            onCamera={() => {}}
          /> */}
        </View>
      </TouchableOpacity>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Tages-Challenge ${getTodayKey()}`}
        onPress={handlePlayDaily}
        style={({ pressed }) => [
          styles.dailyEntry,
          pressed && styles.dailyEntryPressed,
        ]}
      >
        <View style={styles.dailyEntryText}>
          <Text style={styles.dailyEntryLabel}>Tages-Challenge</Text>
          <Text style={styles.dailyEntryDate}>{getTodayKey()}</Text>
        </View>
        <Text style={styles.dailyEntryChevron}>›</Text>
      </Pressable>
    </View>
  );
}

export default Screen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  title: {
    // color: 'white',
    // fontSize: 48,
    // backgroundColor: 'transparent',
    // textAlign: 'center',
    resizeMode: "contain",
    maxWidth: 600,
    width: "80%",
    height: 300,
  },
  coins: {
    fontFamily: "retro",
    position: "absolute",
    right: 8,
    color: "#f8e84d",
    fontSize: 36,
    letterSpacing: 0.9,
    backgroundColor: "transparent",
    textAlign: "right",
    shadowColor: "black",
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
  },
  highscore: {
    fontFamily: "retro",
    color: "#f8e84d",
    fontSize: 20,
    letterSpacing: 0.9,
    backgroundColor: "transparent",
    textAlign: "center",
    marginTop: 8,
    shadowColor: "black",
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
  },
  dailyEntry: {
    position: "absolute",
    top: "50%",
    marginTop: 200,
    width: "80%",
    maxWidth: 420,
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1A1A22",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#2E2E3A",
    paddingVertical: 16,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  dailyEntryPressed: {
    backgroundColor: "#23232E",
    transform: [{ translateY: 1 }],
  },
  dailyEntryText: {
    flex: 1,
    flexDirection: "column",
  },
  dailyEntryLabel: {
    fontFamily: "retro",
    color: "#F5F1E8",
    fontSize: 20,
    fontWeight: "700",
    backgroundColor: "transparent",
  },
  dailyEntryDate: {
    fontFamily: "retro",
    color: "#FFB454",
    fontSize: 16,
    letterSpacing: 0.9,
    backgroundColor: "transparent",
  },
  dailyEntryChevron: {
    color: "#9A97A3",
    fontSize: 20,
    marginLeft: 8,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#34495e",
  },
});
