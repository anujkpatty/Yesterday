import React, { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

import { Text, View, Image, TextInput, Button } from 'react-native';
import Axios from 'axios';

export default function RequestsScreen({navigation}) {

    const [requests, setRequests] = useState([])

    async function getRequests() {
        const curUser = await SecureStore.getItemAsync('userToken')
        Axios.get(`http://localhost:3001/requests?user=${curUser}`)
        .then(res => setRequests([...res.data]))
        .catch(err => console.log(err))
    }

    const renderUsers = (names) => {
        return names.map(name => <Text key={name} onPress={() => navigation.navigate('Profile', {user: name})}>{name}</Text>)
            
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