import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SearchScreen from "./SearchScreen";
import { Pressable, Text } from "react-native";
import HomeScreen from "./HomeScreen";

import Ionicons from '@expo/vector-icons/Ionicons';




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
            <Stack.Screen name="Search" component={SearchScreen}/>
        </Stack.Navigator>
    )
}