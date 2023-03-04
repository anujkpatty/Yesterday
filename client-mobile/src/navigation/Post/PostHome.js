import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, TextInput, View, Button, Text, Image, ScrollView } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import Axios from 'axios';
import { useIsFocused } from "@react-navigation/native";





export default function PostHome({ navigation }) {

    const [today, setToday] = useState(null)
    const [yesterday, setYesterday] = useState(null)
    const [option, setOption] = useState('today')
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

    const renderPosts = () => {
        if (option == 'today') {
            if (today) {
                return <Image key={Date.now() + 1} source={{uri: today}} alt="" style = {styles.image} />
            } else {
                return <Text style={styles.text}>No post</Text>
            }
        } else if (option == 'yesterday') {
            if (yesterday) {
                return <Image key={Date.now() + 1} source={{uri: yesterday}} alt="" style = {styles.image} />
            } else {
                return <Text style={styles.text}>No post</Text>
            }
        } 
        return <></>
    }

    return (
        <View style={styles.container}>

            <View style={styles.post_container}>
                {renderPosts()}
            </View>
            
            <View style={styles.button_container}>
                <Pressable style={() => option == 'today' ? styles.button_pressed : styles.button} key={'today'} onPress={() => setOption('today')}>
                    <Text style={styles.text}>Today</Text>
                </Pressable>
                <Pressable style={() => option == 'yesterday' ? styles.button_pressed : styles.button} key={'yesterday'} onPress={() => setOption('yesterday')}>
                    <Text style={styles.text}>Yesterday</Text>
                </Pressable>
            </View>
            
        </View>
        
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        justifyContent: 'flex-end',
        alignItems: 'center',
        height: '100%',

    },
    button: {
        width: '50%',
        justifyContent: 'center',
        height: '100%',
        borderTopWidth: 2,
        borderColor: 'lightgray',
    },
    button_pressed: {
        width: '50%',
        justifyContent: 'center',
        height: '100%',
        borderTopWidth: 2,
        borderColor: 'black',
    },
    text: {
        fontSize: 16,
        color: 'black',
        alignSelf: 'center'
        
    },
    image: {
        height: 480,
        width: 360,
        alignSelf: 'center'

    }, 
    button_container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: '8%',
        width: '100%'
 
    },
    post_container: {
        height: 480,
        justifyContent: 'center',
        marginBottom: '24%',
        width: '100%'

 
    }


});