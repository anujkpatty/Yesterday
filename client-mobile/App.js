import * as React from 'react';
import * as SecureStore from 'expo-secure-store';
import Axios from "axios";

import { Text, View } from 'react-native';
import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from './src/AuthContext';

import HomeScreen from './src/navigation/HomeScreen';
import UploadScreen from './src/navigation/UploadScreen';
import LoginScreen from './src/navigation/LoginScreen';
import RegisterScreen from './src/navigation/RegisterScreen';
import SettingsScreen from './src/navigation/SettingsScreen';
import PostRoot from './src/navigation/PostRoot';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function App() {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await SecureStore.getItemAsync('userToken');
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (data) => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `SecureStore`
        // In the example, we'll use a dummy token

        const { username, password } = data

        Axios.post("http://localhost:3001/login", { username: username, password: password })
        .then(res => {
          SecureStore.setItemAsync('userToken', res.data.user)
          dispatch({ type: 'SIGN_IN', token: res.data.user});
        })
        .catch(err => console.log(err));

        
      },
      signOut: async () => {
        SecureStore.deleteItemAsync('userToken')
        dispatch({ type: 'SIGN_OUT' })
      },
      signUp: async (data) => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `SecureStore`
        // In the example, we'll use a dummy token
        const { username, password } = data

        Axios.post("http://localhost:3001/register", { username: username, password: password })
        .then(res => {
          SecureStore.setItemAsync('userToken', res.data.user)
          dispatch({ type: 'SIGN_IN', token: res.data.user});
      })
        .catch(err => alert('Username unavailable'));

      },
    }),
    []
  );

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        {state.userToken == null ? (
          <Stack.Navigator>
            <Stack.Screen name="LogIn" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </Stack.Navigator>
        ) :(
          <Tab.Navigator>
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Upload" options={{ headerShown: false }} component={PostRoot} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
          </Tab.Navigator>
        )}
        
      </NavigationContainer>
    </AuthContext.Provider>
  );
  
  
}