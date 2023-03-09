import React from "react";
import { Text, TextInput, View, Button, Pressable, StyleSheet } from 'react-native';
import Axios from "axios";
import { AuthContext } from './../AuthContext.js';


function RegisterScreen({ navigation }) {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const { signUp } = React.useContext(AuthContext);
  
    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                style={styles.input}
                autoCapitalize='none'
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
            />
            <Pressable style={styles.button} onPress={() => signUp({ username, password })}>
                <Text style={styles.text} >Register</Text>
            </Pressable>    
        </View>
    );
  }
  export default RegisterScreen;

  const styles = StyleSheet.create({
    container: {
      paddingTop: 50,
      paddingBottom: 0,
      backgroundColor: 'white',
      height: '100%',
    },
    input: {
        height: 35,
        margin: 12,
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'gray'
    },
    button: {
        height: 35,
        margin: 12,
        borderWidth: 1,
        borderRadius: 2,
        backgroundColor: 'black',
        justifyContent: 'center',
    },
    text: {
        fontSize: 14,
        color: 'white',
        textAlign: 'center',
    },

    
  });