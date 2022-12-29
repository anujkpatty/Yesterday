import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import PostHome from "./Post/PostHome";
import PostCreate from './Post/PostCreate';
import PostView from './Post/PostView';
import SearchScreen from "./SearchScreen";
import ProfileScreen from "./ProfileScreen";
import RequestsScreen from "./RequestsScreen";



const Stack = createNativeStackNavigator();

export default function PostRoot() {
    return(
        
        <Stack.Navigator>
            <Stack.Screen name="PostHome" component={PostHome}/>
            <Stack.Screen name="PostCreate" component={PostCreate}/>
            <Stack.Screen name="PostView" component={PostView}/>
            <Stack.Screen name="Search" component={SearchScreen}/>
            <Stack.Screen name="Profile" component={ProfileScreen}/>
            <Stack.Screen name="Requests" component={RequestsScreen}/>
        </Stack.Navigator>
    )
}