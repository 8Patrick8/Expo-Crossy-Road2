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
  const { setCharacter, character, highscore, setMode } =
    React.useContext(GameContext);
  const animation = new Animated.Value(0);
  const todayKey = getTodayKey();

  React.useEffect(() => {
    function onKeyUp({ keyCode }) {
      // Space, up-arrow
      if ([32, 38].includes(keyCode)) {
        setMode("classic");
        props.onPlay();
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
                setMode("classic");
                props.onPlay();
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

      <View style={styles.dailyEntryWrapper} pointerEvents="box-none">
        <Pressable
          onPress={() => {
            setMode("daily");
            props.onPlayDaily();
          }}
          style={({ pressed }) => [
            styles.dailyEntry,
            pressed && styles.dailyEntryPressed,
          ]}
        >
          <View>
            <Text style={styles.dailyLabel}>Tages-Challenge</Text>
            <Text style={styles.dailyDate}>{todayKey}</Text>
          </View>
          <Text style={styles.dailyChevron}>›</Text>
        </Pressable>
      </View>
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
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#34495e",
  },
  dailyEntryWrapper: {
    position: "absolute",
    top: "50%",
    marginTop: 180,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 24,
  },
  dailyEntry: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#1A1A22",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#2E2E3A",
    padding: 16,
    minHeight: 56,
  },
  dailyEntryPressed: {
    backgroundColor: "#23232E",
    transform: [{ translateY: 1 }],
  },
  dailyLabel: {
    color: "#F5F1E8",
    fontSize: 20,
    fontWeight: "700",
  },
  dailyDate: {
    color: "#FFB454",
    fontSize: 16,
    fontFamily: "monospace",
    marginTop: 4,
  },
  dailyChevron: {
    color: "#9A97A3",
    fontSize: 20,
  },
});
