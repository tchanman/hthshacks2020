import Expo from "expo";
import React, { useState } from "react";
import { Accelerometer, Pedometer } from "expo-sensors";
import { 
  StyleSheet, 
  Text, 
  View,
  Image,
  Button,
  StatusBar,
  TouchableOpacity,
  Alert,
  Modal,
  TouchableHighlight,
 } from "react-native";

const SITUPLIMIT = 5;
const STEPLIMIT = 10;
const WINMONEY = 2000;

export default class App extends React.Component {

  static navigationOptions = {
    title: 'App'
   };

  constructor(props) {
    super(props);
    
    this.state = {
      accelerometerData: {x:0, y:0, z:0},
      isPedometerAvailable: "checking",
      currentStepCount: 0,
      pastStepCount: 0,
      modalVisible: false
    };
    this.move = {
      player1: 0,
      player2: 0
    };
    this.money = {
      player1: 500,
      player2: 500,
    }
  }
  
  componentDidMount() {
    this._subscribePedometer();
    //this._subscribeAccelerometer();
  };

  componentWillUnmount() {
    //this._unsubscribeAccelerometer();
    this._unsubscribePedometer();
  };

  // _subscribeAccelerometer() {
  //   console.log("Accelerometer Subscribed")
  //   Accelerometer.isAvailableAsync().then(
  //     this._accelerometerSubscription = Accelerometer.addListener(
  //       accelerometerData => this.setState({ accelerometerData })
  //     ),
  //   )
  // };

  detectRun(){
      if (this.state.currentStepCount >= this.state.pastStepCount + STEPLIMIT){
        console.log("Completed Run")
        this.setModalVisible(false);

        this.state.pastStepCount = this.state.currentStepCount;
        return <Text>completed</Text>;
      }
      return null;
    }
  
  _subscribePedometer() {
    this.state.pastStepCount = 0;
    Pedometer.isAvailableAsync().then(
      console.log("Pedometer Subscribed"),
      this._pedometersubscription = Pedometer.watchStepCount(result => {
        this.setState({
          currentStepCount: result.steps
        });
      },
      
      result => {
        this.setState({
          isPedometerAvailable: String(result)
        });
      },
      error => {
        this.setState({
          isPedometerAvailable: "Could not get isPedometerAvailable: " + error
        });
      }
    ));
  };

  _unsubscribePedometer() {
    console.log("unsubscribing pedometer");
    this._pedometersubscription && this._pedometersubscription.remove();
    this._pedometersubscription = null;
  };

  // _unsubscribeAccelerometer() {
  //   console.log("unsubscribing accelerometer");
  //   this._accelerometersubscription && this._accelerometersubscription.remove();
  //   this._accelerometersubscription = null;
  // };

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  };

  handleFight() {
    const p1move = this.move.player1;
    const p2move = this.move.player2;
    let result = "not complete selection";

    switch(String(p1move) + String(p2move)) {
      case ("11" || "22" || "33"):
        result = "It's a tie!";
        break;
      case "12":
        result = "Player 2 successfully defends against Player 1's attack.";
        this.money.player1 -= 400;
        break;
      case "21":
        result = "Player 1 successfully defends against Player 2's attack.";
        this.money.Player2 -= 400;
        break;
      case "23":
        result = "Player 2 steals $200 from under Player 1's defense.";
        this.money.player2 += 200;
        this.money.player1 -= 200;
        break;
      case "32":
        result = "Player 1 steals $200 from under Player 2's defense.";
        this.money.player1 += 200;
        this.money.player2 -= 200;
        break;
      case "13":
        result = "Player 1 boldly attacks Player 2's stealing.";
        this.money.player1 += 400;
        break;
      case "31":
        result = "Player 2 boldly attacks Player 1's stealing.";
        this.money.player2 += 400;
        break;
      default:
        console.log("no selection")
        break;
    }

    if(this.money.player1 > WINMONEY) {
      result = "Player 1 wins!"
    } else if (this.money.player2 > WINMONEY){
      result = "Player 2 wins!"
    }

    this.handleResult(result);

    this.move.player1 = 0;
    this.move.player2 = 0;
  }

  handleResult(result) {
    Alert.alert("BATTLE RESULT",
      result,
      [
        { text: "OK", onPress: () => console.log("OK Pressed") }
      ],
      { cancelable: false }
    );
  }

  render() {
    const { modalVisible } = this.state;
  return (
    <View style={{flex:1, padding: 40, backgroundColor: "#CEB793"}}>
      <StatusBar hidden={true}></StatusBar>
      <View style={styles.Player1}>
        <Text style={styles.moneyText}>{this.money.player1}</Text>
        <Button color="#35727B" title="ATTACK" onPress={() => {
          this.move.player1 = 1;
          this.setModalVisible(!modalVisible);}}></Button>
        <Button color="#35727B" title="DEFEND" onPress={() => {
          this.move.player1 = 2;
          this.setModalVisible(!modalVisible);}}></Button>
        <Button color="#35727B" title="STEAL" onPress={() => {
          this.move.player1 = 3;
          this.setModalVisible(!modalVisible); }}></Button>
      </View>
      
      <TouchableOpacity 
        activeOpacity={0.5}
        onPress={() => {
          console.log(String(this.move.player1) + String(this.move.player2))
          this.handleFight();
        }}>
        <Image 
          style={styles.image} 
          source={require("./assets/gold_pile.png")}>
        </Image>
      </TouchableOpacity>
      
      <View style={styles.Player2}>
        <Text style={styles.moneyText}>{this.money.player2}</Text>
        <Button color="#93312A" title="ATTACK" onPress={() => {
          this.move.player2 = 1; 
          this.setModalVisible(!modalVisible);}}></Button>
        <Button color="#93312A" title="DEFEND" onPress={() => {
          this.move.player2 = 2; 
          this.setModalVisible(!modalVisible);}}></Button>
        <Button color="#93312A" title="STEAL" onPress={() => {
          this.move.player2 = 3; 
          this.setModalVisible(!modalVisible);}}></Button>
      </View>
      
      <View style={styles.debug}>
        <Text>Pedometer.isAvailableAsync(): {this.state.isPedometerAvailable}</Text>
        <Text>Walk! And watch this go up: {this.state.pastStepCount + STEPLIMIT}</Text>
      </View>
      
      <View style={styles.debug}>
        <Text>x: {this.state.accelerometerData.x.toFixed(2)}</Text>
        <Text>y: {this.state.accelerometerData.y.toFixed(2)}</Text>
        <Text>z: {this.state.accelerometerData.z.toFixed(2)}</Text>
      </View>
      
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>WALK YOUR STEPS!</Text>
              <Text>Walk! And watch this go up: {this.state.currentStepCount}</Text>
              <Text>Reach {this.state.pastStepCount + STEPLIMIT} to submit</Text>

              <TouchableHighlight
                style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                onPress={() => {
                  this.detectRun()
                }}
              >
                <Text style={styles.textStyle}>Submit Run</Text>
              </TouchableHighlight>
              
            </View>
          </View>
        </Modal>
      </View>
      
    </View>
    )
  }
}


//CSS
const styles = StyleSheet.create({
  Player1: {
    padding: 10,
    marginTop:20,
    transform: [{rotate: "180deg"}],
    color: "#fff",
  },
  Player2: {
    padding: 10,
    marginTop: 10,
    color: "#fff"
  },
  image: {
    padding: 10,
    margin: 20,
    alignItems: "center",
    justifyContent: "center"
  },
  debug: {
    display: "none",
    backgroundColor: "#fff",
    color: "#000"
    
  },
  //Modal things
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  moneyText: {
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 30
  }
});

