import React from "react";
import { Text, TextInput, View, Button, StyleSheet, Pressable } from 'react-native';

function StartScreen({ navigation }) {
  
    return (
        <View style={styles.container}>
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
      paddingTop: 650,
      paddingBottom: 0,
      backgroundColor: 'white',
      height: '100%',
    },
    input: {
        height: 35,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    signin_button: {
        height: 35,
        margin: 12,
        borderWidth: 1,
        borderRadius: 2,
        justifyContent: 'center',
    },
    register_button: {
        height: 35,
        margin: 12,
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
  