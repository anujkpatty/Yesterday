import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from '@expo/vector-icons/Ionicons';



import SearchScreen from "./SearchScreen";
import ProfileScreen from "./ProfileScreen";
import RequestsScreen from "./RequestsScreen";
import { Pressable, Text } from "react-native";
import SettingsScreen from "./SettingsScreen";
import PostView from "./PostView";



const Stack = createNativeStackNavigator();



export default  function ProfileRoot({navigation, route}) {

    return(
        
        <Stack.Navigator screenOptions={{headerBackTitleVisible: false}}>
            <Stack.Screen 
              name="ProfileScreen" 
              component={ProfileScreen} 
              initialParams={{ user: route.params.user }}
              options={({ route, navigation }) => ({
                title: '',
                headerRight: () => (
                    <Pressable onPress={() => navigation.navigate('Requests')}>
                        <Ionicons name={'notifications-outline'} size={24} color={'black'}/>
                    </Pressable>
                ),
                headerLeft: () => (
                    <Pressable onPress={() => navigation.navigate('Settings')}>
                        <Ionicons name={'settings-outline'} size={24} color={'black'}/>
                    </Pressable>
                ),
              })}
            />
            <Stack.Screen name="Requests" component={RequestsScreen}/>
            <Stack.Screen name="Settings" component={SettingsScreen}/>
            <Stack.Screen 
              name="Profile2" 
              component={ProfileScreen} 
              options={() => ({title: ''})}
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