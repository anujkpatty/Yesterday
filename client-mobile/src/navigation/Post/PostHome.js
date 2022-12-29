import React from "react";
import { TextInput, View, Button, Text } from 'react-native';

export default function PostHome({ navigation }) {
    return (
        <>
            <Button title="Create Post" onPress={() => navigation.navigate('PostCreate')} ></Button>
            <Button title="View Post" onPress={() => navigation.navigate('PostView')} ></Button>
            <Button title="Find Friends" onPress={() => navigation.navigate('Search')} ></Button>
            <Button title="Friend Requests" onPress={() => navigation.navigate('Requests')} ></Button>
        </>
        
    )
}
