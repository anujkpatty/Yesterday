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
      <>
        <Image key={name} source={{uri: `http://localhost:3001/gif?user=${name}`}} alt="" style = {styles.image} />
        <Text style={styles.text}>{name}</Text>
      </>
    );

    useEffect(() => {
      console.log("mount")
      getPosts()
    }, [])

    return(
      <SafeAreaView style={styles.container}>
        <FlatList
          data={users}
          renderItem={({item}) => <Item name={item} />}
          keyExtractor={item => item}
        />
      </SafeAreaView>
  )
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingBottom: 0,
    backgroundColor: 'white',
    height: '100%',
    justifyContent: 'center',
  },
  input: {
      height: 35,
      margin: 12,
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: 'gray'
  },
  button: {
      height: 35,
      margin: 12,
      borderWidth: 1,
      borderRadius: 2,
      backgroundColor: 'black',
      justifyContent: 'center',
  },
  text: {
      fontSize: 14,
      color: 'gray',
      paddingLeft: 44,
      paddingTop: 5,
  },
  image: {
    height: 400,
    width: 300,
    alignSelf: 'center',
    marginTop: 50,
  },
  post_container: {
    height: 500,
    width: 300,
    justifyContent: 'center'
  }

  
});