import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SearchScreen from "./SearchScreen";
import { Pressable, Text } from "react-native";
import HomeScreen from "./HomeScreen";

import Ionicons from '@expo/vector-icons/Ionicons';
import ProfileScreen from "./ProfileScreen";
import PostView from "./PostView";
import * as SecureStore from 'expo-secure-store';

const Stack = createNativeStackNavigator();

export default function FeedRoot() {
    return(
        
        <Stack.Navigator screenOptions={{headerBackTitleVisible: false}}>
            <Stack.Screen 
                name="Feed" 
                component={HomeScreen}
                options={({navigation, route}) => ({
                    title: 'Feed',
                    headerRight: () => (
                        <Pressable onPress={() => navigation.navigate('Search')}>
                            <Ionicons name={'person-add-outline'} size={24} color={'black'} />
                        </Pressable>
                    ),
            })}
            />
            <Stack.Screen 
                name="Search" 
                component={SearchScreen}
                options={() => ({
                    title: '',
                })}
                />
            <Stack.Screen 
                name="Profile" 
                component={ProfileScreen}
                options={({ route, navigation }) => ({
                    title: '',
                })}
            />
            <Stack.Screen 
                name="View" 
                component={PostView}
                options={() => ({
                    title: '',
                    headerShown: false,
                })}
            />
        </Stack.Navigator>
    )
}