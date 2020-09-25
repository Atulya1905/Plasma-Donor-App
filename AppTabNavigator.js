import React from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { AppStackNavigator } from './AppStackNavigator'
import PlasmaRequestScreen from '../screens/PlasmaRequestScreen';


export const AppTabNavigator = createBottomTabNavigator({
  DonatePlasma : {
    screen: AppStackNavigator,
    navigationOptions :{
      tabBarIcon : <Image source={require("../assets/request-list.png")} style={{width:20, height:20}}/>,
      tabBarLabel : "Donate Plasma",
    }
  },
PlasmaRequest: {
    screen: PlasmaRequestScreen,
    navigationOptions :{
      tabBarIcon : <Image source={require("../assets/request-book.png")} style={{width:20, height:20}}/>,
      tabBarLabel : "Plasma Request",
    }
  }
});
