import React, { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

import { Text, View, Image } from 'react-native';
import Axios from 'axios';

function PostView({ navigation }) {

  const [gif, setGif] = useState(null)

  const getGif = async () => {
    let user = await SecureStore.getItemAsync('userToken')
    // Axios.get(`http://localhost:3001/gif?user=${user}`)
    // .then(res => console.log(res.data))
    // .catch(err => console.log(err))
    setGif(`http://localhost:3001/gif?user=${user}`)
  }

  useEffect(() => {
    getGif();
  }, [])

    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {gif ? 
          <Image key={Date.now()} source={{uri: gif}} alt="" style = {{width: 300, height: 400}} /> :
          <></>
        }
        
      </View>
    );
}

export default PostView;