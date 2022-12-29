import React from "react";
import { TextInput, View, Button } from 'react-native';
import Axios from "axios";
import { AuthContext } from './../AuthContext.js';

function RegisterScreen({ navigation }) {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
  
    // function handleRegister() {
    //     const data = new FormData();
    //     data.append("username", username);
    //     data.append("password", password);
    //     console.log(username, password)

    //     const article = { username: username,
    //                       password: password }
        
    //     Axios.post("http://localhost:3001/register", article)
    //     .then(res => console.log(res))
    //     .catch(err => console.log(err));
    // }

    const { signUp } = React.useContext(AuthContext);
  
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
            <Button title="Create Account" onPress={() => signUp({ username, password })} />
        </View>
    );
  }
  export default RegisterScreen;