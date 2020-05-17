import React from "react";
import { Accelerometer} from "expo-sensors";
import { 
  StyleSheet, 
  Text, 
  View
 } from "react-native";


export default class Accelerator extends React.Component {

  state = {
    accelerometerData: {x:0, y:0, z:0},
  };

  componentDidMount() {
    this._subscribeAccelerator();
  }

  componentWillUnmount() {
    this._unsubscribe();
  }
  
  _subscribeAccelerator = () => {
    this._accelerometersubscription = Accelerometer.addListener(
      accelerometerData => this.setState({ accelerometerData })
    );
  };

  _unsubscribe = () => {
    this._acceleratorsubscription && this._acceleratorsubscription.remove();
    this._acceleratorsubscription = null;
  };

  render() {
    return (
      <View style={{padding: 50}}>
        <View style={styles.debug}>
          <Text>x: {this.state.accelerometerData.x}</Text>
          <Text>y: {this.state.accelerometerData.y}</Text>
          <Text>z: {this.state.accelerometerData.z}</Text>
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