import React from "react";
import { TextInput, View, Button } from 'react-native';
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
        <View>
            <TextInput
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Button title="Login" onPress={() => signIn({ username, password })} />
            <Button title="Sign up" onPress={() => navigation.navigate('Register')} />
        </View>
    );
  }
  export default LoginScreen;