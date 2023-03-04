import React, { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

import { Text, View, Image, TextInput, Button, StyleSheet, Pressable } from 'react-native';
import Axios from 'axios';

export default function RequestsScreen({navigation}) {

    const [requests, setRequests] = useState([])

    async function getRequests() {
        const curUser = await SecureStore.getItemAsync('userToken')
        Axios.get(`http://localhost:3001/requests?user=${curUser}`)
        .then(res => setRequests([...res.data]))
        .catch(err => console.log(err))
    }

    const Result = (props) => {
        return(
            <Pressable onPress={() => navigation.push('Profile2', {user: props.user})}>
                <View style={styles.result}>
                    <Image source={{uri: `http://localhost:3001/profile_picture?user=${props.user}`}} alt="" style = {styles.profile} />
                    <Text style={styles.username}>{props.user}</Text>
                </View>
            </Pressable> 
            
        )
    }

    const renderUsers = (names) => {
        return names.map(name => <Result key={name} user={name}/>)
    }

    useEffect(() => {
        getRequests()
    }, [])

    return(
        <View>
            {renderUsers(requests)}
        </View>
    )
}


const styles = StyleSheet.create({
    result: {
        height: 70,
        alignItems: 'center',
        flexDirection: 'row',
    },
    profile: {
        height: 50,
        width: 50,
        margin: 5,
        borderRadius: 25,
    },
    username: {
        fontSize: 16,
        margin: 5,
    },
})