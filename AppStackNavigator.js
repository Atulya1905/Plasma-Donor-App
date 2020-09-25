import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';

import PlasmaDonateScreen from '../screens/PlasmaDonateScreen';
import RecieverDetailsScreen  from '../screens/RecieverDetailsScreen';




export const AppStackNavigator = createStackNavigator({
  PlasmaDonateList : {
    screen : PlasmaDonateScreen,
    navigationOptions:{
      headerShown : false
    }
  },
  RecieverDetails : {
    screen : RecieverDetailsScreen,
    navigationOptions:{
      headerShown : false
    }
  }
},
  {
    initialRouteName: 'PlasmaDonateList'
  }
);
