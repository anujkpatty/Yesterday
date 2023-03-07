import React, { useEffect, useState, useLayoutEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

import { Text, View, Image, TextInput, Button, ScrollView, Pressable, StyleSheet } from 'react-native';
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

    useLayoutEffect(() => {
        navigation.setOptions({
            headerSearchBarOptions: {
                onChangeText: (event) => {
                    getUsers(event.nativeEvent.text)
                },
                hideWhenScrolling: false,
                autoCapitalize: false
            
            
            },
        });
    }, [navigation]);

    const Result = (props) => {
        return(
            <Pressable onPress={() => navigation.push('Profile', {user: props.user})}>
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

    return (
        <ScrollView contentInsetAdjustmentBehavior="automatic">
            
            <View>
                {renderUsers(users)}
            </View>
            
        </ScrollView>
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