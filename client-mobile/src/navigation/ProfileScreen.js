import React, { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

import { Text, View, Image, TextInput, Button } from 'react-native';
import Axios from 'axios';

export default function ProfileScreen({ navigation, route }) {
    const [loaded, setLoaded] = useState(false)
    
    //relation state 0 == requested, 1 == request pending, 2 == accepter, 3 == not friends, 4 == same user
    const [relation, setRelation] = useState(null)

    async function getRelation() {
        const curUser = await SecureStore.getItemAsync('userToken') 
        if (curUser == route.params.user) {
            setRelation(4)
        } else {
            Axios.get(`http://localhost:3001/relation?user_1=${curUser}&user_2=${route.params.user}`)
            .then(res => {
                setRelation(res.data.relation)
                console.log(res.data.relation)
            })
            .catch(err => console.log(err))
        }
        
    }

    async function load() {
        await getRelation();
        setLoaded(true);
    }

    async function addFriend() {
        Axios.post('http://localhost:3001/add_friend', {
            user_one: await SecureStore.getItemAsync('userToken'), 
            user_two: route.params.user,
        })
        .then(() => setLoaded(false))
    }

    async function removeFriend() {
        Axios.put('http://localhost:3001/remove_friend', {
            user_one: await SecureStore.getItemAsync('userToken'), 
            user_two: route.params.user,
        })
        .then(() => setLoaded(false))
    }

    async function acceptFriend() {
        Axios.put('http://localhost:3001/accept', {
            user_two: await SecureStore.getItemAsync('userToken'), 
            user_one: route.params.user,
        })
        .then(() => setLoaded(false))
    }
    useEffect(() => {
        load();
      }, [loaded])

    const render = () => {
        if (loaded) {
            if (relation == 0) {
                return(<Button title="Remove Friend" onPress={removeFriend}></Button>)
            } else if (relation == 1) {
                return(<Button title="Accept Friend" onPress={acceptFriend}></Button>)
            } else if (relation == 2) {
                return(<Button title="Remove Friend" onPress={removeFriend}></Button>)
            } else if (relation == 3) {
                return(<Button title="Add Friend" onPress={addFriend}></Button>)
            } else {
                return(<Text>Your profile</Text>)
            }
        }
        return((<Text>Loading</Text>))
    }

    return (
        <View>
            <Text>{route.params.user}</Text>
            {render()}
        </View>
        
    )

}