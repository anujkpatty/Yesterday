import React from "react";
import { Text, TextInput, View, Button, StyleSheet, Pressable } from 'react-native';
import Axios from "axios";
import { AuthContext } from './../AuthContext.js';

function LoginScreen({ navigation }) {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
  
    // function handleLogin() {
    //     const data = { username: username,
    //                    password, password}
        
    //     Axios.post("http://localhost:3001/login", data)
    //     .then(res => console.log(res.data.user))
    //     .catch(err => alert('Invalid username or password'));
    // }

    const { signIn } = React.useContext(AuthContext);

  
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize='none'
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Pressable style={styles.button} onPress={() => signIn({ username, password })}>
                <Text style={styles.text}>Sign in</Text>
            </Pressable>    
        </View>
    );
  }
  export default LoginScreen;

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
  