import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, TextInput, View, Button, Text, Image, ScrollView } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import Axios from 'axios';
import { useIsFocused } from "@react-navigation/native";





export default function PostHome({ navigation }) {

    const [today, setToday] = useState(null)
    const [yesterday, setYesterday] = useState(null)
    const isFocused = useIsFocused();


    const getPosts = async () => {
        const user = await SecureStore.getItemAsync('userToken')
        Axios.get(`http://localhost:3001/post_status?user=${user}`)
        .then(res => {
            if (res.data.today == 1) {
                setToday(`http://localhost:3001/gif?user=${user}&status=0`)
            } else setToday(null)
            if (res.data.yesterday == 1) {
                setYesterday(`http://localhost:3001/gif?user=${user}&status=1`)
            } else setYesterday(null)
        })
        .catch(err => {
            console.log(err)
        })
        
    }

    useEffect(() => {
        isFocused && getPosts()
    }, [isFocused])

    return (
        <ScrollView contentContainerStyle={styles.container}>

            <View style={styles.title_container}>
                <Text style={styles.title}>Today</Text>
            </View>
               
            {today ? 
                <Image key={Date.now()} source={{uri: today}} alt="" style = {styles.image} /> 
                : (
                    <Pressable onPress={() => navigation.navigate('PostCreate')} >
                        <Text style={styles.text}>New Post</Text>
                    </Pressable>)
            }
            <View style={styles.title_container}>
                <Text style={styles.title}>Yesterday</Text>
            </View>
            {yesterday ? 
                <Image key={Date.now() + 1} source={{uri: yesterday}} alt="" style = {styles.image} /> 
                : <Text style={styles.text}>No post</Text>
                    
            }
        </ScrollView>
        
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        alignItems: 'center',
    },
    button: {
        height: 50,
        width: 50,
        margin: 10,
        borderWidth: 2,
    },
    text: {
        fontSize: 16,
        color: 'gray',
        alignSelf: 'flex-start',
        marginLeft: 15
        
    },
    title: {
        fontSize: 24,
        marginTop: 10,
        alignSelf: 'flex-start',

    },
    title_container: {
        height: 40,
        width: 360,
        borderBottomWidth: 1,
        marginBottom: 10,
        padding: 0,
    },
    image: {
        height: 480,
        width: 360,

    }


});