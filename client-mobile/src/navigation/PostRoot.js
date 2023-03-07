import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import PostHome from "./Post/PostHome";
import PostCreate from './Post/PostCreate';
import { Pressable, Text } from "react-native";

import Ionicons from '@expo/vector-icons/Ionicons';




const Stack = createNativeStackNavigator();


export default function PostRoot() {
    return(
        
        <Stack.Navigator screenOptions={{headerBackTitleVisible: false}}>
            <Stack.Screen 
                name="PostHome" 
                component={PostHome}
                options={({navigation, route}) => ({
                    title: '',
                    headerRight: () => (
                        <Pressable onPress={() => navigation.navigate('PostCreate')}>
                            <Ionicons name={'add-outline'} size={24} color={'black'}/>
                        </Pressable>
                    ),
            })}
            />
            <Stack.Screen 
                name="PostCreate" 
                component={PostCreate}
                options={() => ({
                    title: 'Create'
                })}
            />
        </Stack.Navigator>
    )
}