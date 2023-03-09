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
  Image,
  RefreshControl,
} from 'react-native';

const URL = 'http://localhost:3001'

function HomeScreen({navigation}) {

    const [users, setUsers] = useState(null)
    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
      setRefreshing(true);
      getPosts();
      setRefreshing(false)
      
  }, []);

    const getPosts = async () => {
      const curUser = await SecureStore.getItemAsync('userToken')
      Axios.get(URL +`/feed?user=${curUser}`, {})
        .then(res => {
            setUsers([...res.data])
        })
        .catch(err => console.log(err))
    }

    const renderPosts = (names) => {
      console.log("here")
      return names.map(name => <Image key={name} source={{uri: `${URL}/gif?user=${name}`}} alt="" style = {{width: 300, height: 400}} />)
    }

    const Item = ({name}) => (
      <>
        <Image key={name} source={{uri: `${URL}/gif?user=${name}&status=1`}} alt="" style = {styles.image} />
        <Text style={styles.text}>{name}</Text>
      </>
    );

    useEffect(() => {
      getPosts()
    }, [])

    return(
      <SafeAreaView style={styles.container}>
        <FlatList
          data={users}
          renderItem={({item}) => <Item name={item} />}
          keyExtractor={item => item}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      </SafeAreaView>
  )
} export default HomeScreen;

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
      fontSize: 20,
      color: 'gray',
      paddingLeft: 14,
      paddingTop: 5,
  },
  image: {
    height: 480,
    width: 360,
    alignSelf: 'center',
    marginTop: 50,
  },
  post_container: {
    height: 500,
    width: 300,
    justifyContent: 'center'
  }

  
});