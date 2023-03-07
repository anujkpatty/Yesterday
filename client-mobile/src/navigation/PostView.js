import React, { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

import { Text, View, Image, StyleSheet } from 'react-native';
import Axios from 'axios';

function PostView({ navigation, route }) {

  const [gif, setGif] = useState(null)

  const getGif = async () => {
    setGif(`http://localhost:3001/gif/${route.params.id}`)
  }

  useEffect(() => {
    getGif();
  }, [])

    return (
      <View style={styles.container}>
        {gif ? 
          <Image key={Date.now()} source={{uri: gif}} alt="" style = {{width: 360, height: 480,}} /> :
          <></>
        }
        
      </View>
    );
}

export default PostView;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    height: '100%',
    alignItems: 'center'
  }
})