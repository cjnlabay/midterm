import React from 'react';
import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Register from './Register';
import Login from './Login';
import Navigationbar from './NavigationBar';

const Stack = createStackNavigator();

const Index = () => {
  return (
    <NavigationIndependentTree>
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Navigationbar" component={Navigationbar} />
        </Stack.Navigator>
    </NavigationIndependentTree>
  );
};

export default Index;