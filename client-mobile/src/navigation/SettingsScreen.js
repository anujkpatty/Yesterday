import React from "react";
import { TextInput, View, Button } from 'react-native';
import { AuthContext } from './../AuthContext.js';

function SettingsScreen({ navigation }) {
    const { signOut } = React.useContext(AuthContext);

    return (
        <Button title="Log Out" onPress={signOut} ></Button>
    )
}
export default SettingsScreen;