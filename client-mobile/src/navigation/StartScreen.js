import React from "react";
import { Text, TextInput, View, Button, StyleSheet, Pressable, Image } from 'react-native';

function StartScreen({ navigation }) {
  
    return (
        <View style={styles.container}>
            <Image style={styles.logo} source={require('../../assets/yesterday-logo.png')}/>
            <Pressable style={styles.signin_button} onPress={() => navigation.navigate('LogIn')}>
                <Text style={styles.text}>Sign in</Text>
            </Pressable>
            <Pressable style={styles.register_button} onPress={() => navigation.navigate('Register')}>
                <Text style={styles.register_text}>Create a new account</Text>
            </Pressable>
            
        </View>
    );
  }
  export default StartScreen;

  const styles = StyleSheet.create({
    container: {
      justifyContent: 'flex-end',
      alignItems: 'center',
      height: '100%',
    },
    logo: {
        height: '50%',
        width: '80%',
    },
    input: {
        height: 35,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    signin_button: {
        height: '5%',
        width: '90%',
        margin: 12,
        borderWidth: 1,
        borderRadius: 2,
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    register_button: {
        height: '5%',
        width: '90%',
        margin: 12,
        marginBottom: '15%',
        borderRadius: 2,
        justifyContent: 'center',
        backgroundColor: 'black'
    },
    text: {
        fontSize: 14,
        color: 'black',
        textAlign: 'center',
    },
    register_text: {
        fontSize: 14,
        color: 'white',
        textAlign: 'center',
    },

    
  });
  