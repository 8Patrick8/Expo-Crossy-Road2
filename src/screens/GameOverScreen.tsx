import React from "react";
import {
  Alert,
  Animated,
  Easing,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Banner from "@/components/GameOver/Banner";
import Footer from "@/components/GameOver/Footer";
import AudioManager from "@/AudioManager";
import Characters from "@/Characters";
import GameContext from "@/context/GameContext";
import Images from "@/Images";

//TODO: Make this dynamic
const banner = [
  {
    color: "#3640eb",
    title: "Get Updates Subscribe Now",
    button: {
      onPress: (_) => {
        Alert.alert(
          "Subscribe to our mailing list",
          "Join our mailing list and discover the latest news from Expo and Evan Bacon.\n\n Read our privacy policy on https://github.com/EvanBacon/Expo-Crossy-Road/privacy.md",
          [
            { text: "Cancel", onPress: () => console.log("Cancel Pressed!") },
            { text: "OK", onPress: () => console.log("OK Pressed!") },
          ],
          {
            cancelable: false,
          }
        );
      },
      source: Images.button.mail,
      style: { aspectRatio: 1.85, height: 40 },
    },
  },
  {
    color: "#368FEB",
    title: "Free Gift in 2h 51m",
  },
  {
    color: "#36D6EB",
    title: "44 Coins To Go",
  },
];

// const AnimatedBanner = Animated.createAnimatedComponent(Banner);

function GameOver({ score = 0, ...props }) {
  const { width } = useWindowDimensions();
  const {
    setCharacter,
    highscore = 0,
    setHighscore,
    mode,
    dailyBest = 0,
    setDailyBest,
  } = React.useContext(GameContext);
  const [wasNewBest] = React.useState(() => score > highscore);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [characters, setCharacters] = React.useState(
    Object.keys(Characters).map((val) => Characters[val])
  );
  const [animations, setAnimations] = React.useState(
    banner.map((val) => new Animated.Value(0))
  );

  React.useEffect(() => {
    if (wasNewBest) {
      setHighscore(score);
    }
  }, []);

  React.useEffect(() => {
    if (mode === "daily" && score > dailyBest) {
      setDailyBest(score);
    }
  }, []);

  const dismiss = () => {
    // props.navigation.goBack();
    props.onRestart();
  };

  const pickRandom = () => {
    const randomIndex = Math.floor(Math.random() * characters.length);
    const randomCharacter = characters[randomIndex];
    setCharacter(randomCharacter.id);
    dismiss();
  };

  React.useEffect(() => {
    setTimeout(() => {
      _animateBanners();

      const playBannerSound = async () => {
        await AudioManager.playAsync(AudioManager.sounds.banner);
        // const soundObject = new Audio.Sound();
        // try {
        //   await soundObject.loadAsync(AudioFiles.banner);
        //   await soundObject.playAsync();
        // } catch (error) {
        //   console.warn('sound error', { error });
        // }
      };
      playBannerSound();
      setTimeout(() => playBannerSound(), 300);
      setTimeout(() => playBannerSound(), 600);
    }, 600);
  });

  const _animateBanners = () => {
    const _animations = animations.map((animation) =>
      Animated.timing(animation, {
        useNativeDriver: true,
        toValue: 1,
        duration: 1000,
        easing: Easing.elastic(),
      })
    );
    Animated.stagger(300, _animations).start();
  };

  const _showResult = (result) => {
    // if (result.action === Share.sharedAction) {
    //   if (result.activityType) {
    //     this.setState({result: 'shared with an activityType: ' + result.activityType});
    //   } else {
    //     this.setState({result: 'shared'});
    //   }
    // } else if (result.action === Share.dismissedAction) {
    //   this.setState({result: 'dismissed'});
    // }
  };

  const select = () => {
    setCharacter(characters[currentIndex].id);
    dismiss();
  };

  const { top, bottom, left, right } = useSafeAreaInsets();

  const imageStyle = { width: 60, height: 48 };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: top || 12, paddingBottom: bottom || 8 },
        props.style,
      ]}
    >
      <View key="content" style={{ flex: 1, justifyContent: "center" }}>
        {wasNewBest && <Text style={styles.newBest}>Neuer Bestwert</Text>}
        {mode === "daily" && (
          <View style={styles.dailyResult}>
            <View style={styles.challengeBadge}>
              <Text style={styles.challengeBadgeText}>Tages-Challenge</Text>
            </View>
            <Text style={styles.dailyBestText}>Heute: {dailyBest}</Text>
          </View>
        )}
        {banner.map((val, index) => (
          <Banner
            animatedValue={animations[index].interpolate({
              inputRange: [0.2, 1],
              outputRange: [-width, 0],
              extrapolate: "clamp",
            })}
            key={index}
            style={{
              backgroundColor: val.color,
              transform: [
                {
                  scaleY: animations[index].interpolate({
                    inputRange: [0, 0.2],
                    outputRange: [0, 1],
                    extrapolate: "clamp",
                  }),
                },
              ],
            }}
            title={val.title}
            button={val.button}
          />
        ))}
      </View>

      <Footer
        style={{ paddingLeft: left || 4, paddingRight: right || 4 }}
        showSettings={props.showSettings}
        setGameState={props.setGameState}
        navigation={props.navigation}
      />
    </View>
  );
}

export default GameOver;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  newBest: {
    alignSelf: "center",
    backgroundColor: "#FFB454",
    color: "#0F0F14",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontWeight: "700",
    fontSize: 12,
    letterSpacing: 1,
    marginBottom: 12,
    overflow: "hidden",
  },
  dailyResult: {
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#2E2E3A",
    paddingTop: 16,
    marginTop: 8,
    marginBottom: 12,
  },
  challengeBadge: {
    backgroundColor: "#23232E",
    borderWidth: 1,
    borderColor: "#4DD0E1",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  challengeBadgeText: {
    color: "#4DD0E1",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  dailyBestText: {
    color: "#FFB454",
    fontFamily: "retro",
    fontSize: 24,
    lineHeight: 27,
    marginTop: 8,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#34495e",
  },
});
