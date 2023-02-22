import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import * as SecureStore from 'expo-secure-store';

import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  StatusBar,
  Image
} from 'react-native';

function HomeScreen({navigation}) {

    const [users, setUsers] = useState(null)

    const getPosts = async () => {
      const curUser = await SecureStore.getItemAsync('userToken')
      Axios.get(`http://localhost:3001/feed?user=${curUser}`, {})
        .then(res => {
            setUsers([...res.data])
        })
        .catch(err => console.log(err))
    }

    const renderPosts = (names) => {
      console.log("here")
      return names.map(name => <Image key={name} source={{uri: `http://localhost:3001/gif?user=${name}`}} alt="" style = {{width: 300, height: 400}} />)
    }

    const Item = ({name}) => (
      <View>
        <Text>{name}</Text>
        <Image key={name} source={{uri: `http://localhost:3001/gif?user=${name}`}} alt="" style = {{width: 300, height: 400}} />
      </View>
    );

    useEffect(() => {
      console.log("mount")
      getPosts()
    }, [])

    return(
      <SafeAreaView >
        <FlatList
          data={users}
          renderItem={({item}) => <Item name={item} />}
          keyExtractor={item => item}
        />
      </SafeAreaView>
  )
}

export default HomeScreen;