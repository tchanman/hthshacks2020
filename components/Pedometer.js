import React from "react";
import { Pedometer } from "expo-sensors";
import { 
  StyleSheet, 
  Text, 
  View
 } from "react-native";

export default class Pedometer extends React.Component {

  state = {
    isPedometerAvailable: "checking",
    currentStepCount: 0
  };

  componentDidMount() {
    this._subscribePedometer();
  }

  componentWillUnmount() {
    this._unsubscribe();
  }
  
  _subscribePedometer = () => {
    Pedometer.isAvailableAsync().then(
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

  _unsubscribe = () => {
    this._pedestriansubscription && this._pedestriansubscription.remove();
    this._pedestriansubscription = null;
  };

  render() {
    return (
      <View style={{padding: 50}}>
        <View style={styles.debug}>
          <Text>Pedometer.isAvailableAsync(): {this.state.isPedometerAvailable}</Text>
          <Text>Walk! And watch this go up: {this.state.currentStepCount}</Text>
        </View>
      </View>
    )}
}

//CSS
const styles = StyleSheet.create({
  debug: {
    // display: "none"
    backgroundColor: "#fff",
    color: "#000"
    
  }
});