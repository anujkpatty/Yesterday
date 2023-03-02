import React, { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

import { Text, View, Image, TextInput, Button } from 'react-native';
import Axios from 'axios';

export default function SearchScreen({navigation}) {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('')

    const getUsers = async (text) => {
        const curUser = await SecureStore.getItemAsync('userToken')
        Axios.get(`http://localhost:3001/search?search=${text}&user=${curUser}`, {})
        .then(res => {
            setUsers([...res.data])
        })
        .catch(err => console.log(err))
    }

    const renderUsers = (names) => {
        return names.map(name => <Text key={name} onPress={() => navigation.push('ProfileScreen', {user: name})}>{name}</Text>)
            
    }

    return (
        <View>
            <TextInput
                placeholder="Search"
                value={search}
                onChangeText={(text) => {
                    setSearch(text);
                    getUsers(text);
                }}
            />
            <View>
                {renderUsers(users)}
            </View>
            
        </View>
    )

}