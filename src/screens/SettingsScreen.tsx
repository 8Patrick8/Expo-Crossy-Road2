import React, { Component } from "react";
import { Alert, Share, StyleSheet, Text, View } from "react-native";

import Button from "@/components/Button";
import Characters from "@/Characters";
import Colors from "@/Colors";
import GameContext from "@/context/GameContext";
import Images from "@/Images";

const TitleButton = ({ text, imageStyle, source, onPress, textColor = "white" }) => (
  <View
    style={{
      justifyContent: "center",
      width: 115,
      height: 100,
      alignItems: "center",
      marginHorizontal: 4,
    }}
  >
    <Button imageStyle={imageStyle} source={source} onPress={onPress} />
    <Text
      style={{
        fontFamily: "retro",
        textAlign: "center",
        color: textColor,
        fontSize: 12,
        marginTop: 8,
      }}
    >
      {text.toUpperCase()}
    </Text>
  </View>
);

class Settings extends Component {
  static contextType = GameContext;

  state = {
    currentIndex: 0,
    characters: Object.keys(Characters).map((val) => Characters[val]),
  };
  dismiss = () => {
    this.props.goBack();
  };

  resetHighscore = () => {
    Alert.alert(
      "Bestwert zurücksetzen",
      "Möchtest du deinen Bestwert wirklich auf 0 zurücksetzen? Das kann nicht rückgängig gemacht werden.",
      [
        { text: "Abbrechen", style: "cancel" },
        {
          text: "Zurücksetzen",
          style: "destructive",
          onPress: () => this.context.resetHighscore(),
        },
      ],
      { cancelable: true }
    );
  };

  pickRandom = () => {
    const { characters } = this.state;

    const randomIndex = Math.floor(Math.random() * characters.length);
    const randomCharacter = characters[randomIndex];
    this.props.setCharacter(randomCharacter.id);
    this.dismiss();
  };
  share = () => {
    const { characters, currentIndex } = this.state;
    const character = characters[currentIndex].name;
    Share.share(
      {
        message: `Check out Bouncy Bacon by @baconbrix`,
        url: "https://crossyroad.expo.app",
        title: "Bouncy Bacon",
      },
      {
        dialogTitle: "Share Bouncy Bacon",
        excludedActivityTypes: [
          "com.apple.UIKit.activity.AirDrop", // This speeds up showing the share sheet by a lot
          "com.apple.UIKit.activity.AddToReadingList", // This is just lame :)
        ],
        tintColor: Colors.blue,
      }
    );
  };

  _showResult = (result) => {
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

  select = () => {
    const { characters, currentIndex } = this.state;

    this.props.setCharacter(characters[currentIndex].id);
    this.dismiss();
  };

  render() {
    const imageStyle = { width: 60, height: 48 };

    const buttons = [
      {
        text: "Language",
        source: Images.button.language,
        imageStyle: imageStyle,
        onPress: (_) => {},
      },
      {
        text: "Restore\nPurchases",
        source: Images.button.purchase,
        imageStyle: imageStyle,
        onPress: (_) => {},
      },
      {
        text: "Credits",
        source: Images.button.credits,
        imageStyle: imageStyle,
        onPress: (_) => {},
      },
      {
        text: "Conserve\nBattery",
        source: Images.button.conserve_battery,
        imageStyle: imageStyle,
        onPress: (_) => {},
      },
      {
        text: "Mute",
        source: Images.button.mute,
        imageStyle: imageStyle,
        onPress: (_) => {},
      },
      {
        text: "No Shadows",
        source: Images.button.shadows,
        imageStyle: imageStyle,
        onPress: (_) => {},
      },
      {
        text: "Reminders",
        source: Images.button.alerts,
        imageStyle: imageStyle,
        onPress: (_) => {},
      },
      {
        text: "Save Your Figurines",
        source: Images.button.facebook,
        imageStyle: { width: 120, height: 48 },
        onPress: (_) => {},
      },
      {
        text: "Bestwert\nzurücksetzen",
        source: Images.button.rank,
        imageStyle: imageStyle,
        textColor: "#FF5C5C",
        onPress: () => this.resetHighscore(),
      },
    ];

    return (
      <View style={[styles.container, this.props.style]}>
        <View
          style={{ flexDirection: "row", marginTop: 8, paddingHorizontal: 4 }}
        >
          <Button
            source={Images.button.back}
            imageStyle={imageStyle}
            onPress={(_) => {
              this.dismiss();
            }}
          />
        </View>

        <Text style={styles.highscore}>BESTWERT {this.context.highscore}</Text>

        <View
          key="content"
          style={{
            flex: 1,
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            key="content"
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {buttons.map((val, index) => (
              <TitleButton
                key={index}
                source={val.source}
                text={val.text}
                imageStyle={val.imageStyle}
                textColor={val.textColor}
                onPress={val.onPress}
              />
            ))}
          </View>
        </View>

      </View>
    );
  }
}
export default Settings;
// export default connect(
//   state => ({}),
//   {},
// )(Settings);

Settings.defaultProps = {
  coins: 0,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(105, 201, 230, 0.8)",
    flexWrap: "wrap",
    maxWidth: "100%",
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
});
