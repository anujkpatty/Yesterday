import React, { useState } from 'react';
import { Pressable, Text, View, Image, Button, Platform, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as SecureStore from 'expo-secure-store';

import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import Axios from 'axios';
import { StackActions } from '@react-navigation/native';


const SERVER_URL = 'http://localhost:3001';

const PostCreate = ({navigation}) => {
  const [images, setImages] = useState([])

  const pickImage = async (index) => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [3, 4],
      quality: 0,
    });

    if (!result.canceled) {
      let image = result.assets[0]
      if (image.width > image.height) {
        image = await manipulateAsync(
          image.localUri || image.uri,
          [{ rotate: 90 }],
          { compress: 1, format: SaveFormat.PNG }
        );
      }
      image = await manipulateAsync(
        image.localUri || image.uri,
        [{ resize: { height: 1200, width: 900 } }],
        { compress: 1, format: SaveFormat.PNG }
      );
      console.log(index)
      if (index != undefined) {
        images[index] = image
        setImages([...images])
      } else {
        setImages([...images, image]);
      }
      
    }
  };

  async function createPost() {
    let response = await Axios.post('http://localhost:3001/create_post', { user: await SecureStore.getItemAsync('userToken') })
    return response.data.postid;
  }

  async function uploadPhotos() {

    if (images[0] && images[1]) {

      const postid = await createPost();

      for (i = 0; i < images.length; i++) {        

        let image = images[i]

        const user = await SecureStore.getItemAsync('userToken')
    
        try {
          await FileSystem.uploadAsync(`http://localhost:3001/upload_single`, image.uri, {
            fieldName: 'image',
            httpMethod: 'POST',
            uploadType: FileSystem.FileSystemUploadType.MULTIPART,
            parameters: {id: i, user: user, postid: postid}
          });
        } catch (error) {
          console.log(error);
        }

      }

      await Axios.get(`http://localhost:3001/make_gif?postid=${postid}`)

      navigation.dispatch(StackActions.popToTop())

    } else {
      alert('Post must contain at least 2 images')
    }
      
  };

  function renderImages() {
    return images.map((image, index) => (
      <Pressable key={index} onPress={() => pickImage(index)}>
        <Image style={styles.image} key={image.uri} source={{ uri: image.uri }} />
      </Pressable>
    ))
  }

  return (
    <View >
      <View style={styles.photos_container}>
        {renderImages()}

        {images.length < 10 ? (
          <Pressable style={styles.button} onPress={() => pickImage()}>
            <Text style={styles.text}>+</Text>
          </Pressable>
        ) : <></>}
      </View>
      <Pressable style={styles.post_button} onPress={() => uploadPhotos()}>
        <Text style={styles.post_text}>Post</Text>
      </Pressable>
    </View>
  );
};

export default PostCreate;

const styles = StyleSheet.create({
  container: {
    flex: 2,
  },
  photos_container: {
    paddingTop: 20,
    backgroundColor: 'white',
    height: '92%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  input: {
      height: 35,
      margin: 12,
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: 'gray'
  },
  button: {
      height: 120,
      width: 90,
      margin: 20,
      borderRadius: 2,
      backgroundColor: 'gray',
      justifyContent: 'center',
      opacity: .6,
  },
  post_button: {
    height: '8%',
    backgroundColor: 'black',
    justifyContent: 'center',
    borderWidth: 2,
  },
  text: {
      fontSize: 40,
      color: 'white',
      textAlign: 'center',
  },
  post_text: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
  },
  image: {
    height: 120,
    width: 90,
    margin: 20,
    borderRadius: 2,

  }

  
});