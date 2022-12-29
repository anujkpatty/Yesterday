import React, { useState } from 'react';
import { View, Image, Button, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

const SERVER_URL = 'http://localhost:3001';

const UploadScreen = () => {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);
  const [image5, setImage5] = useState(null);

  const pickImage = async (setImage) => {
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
      setImage(image);
    }
  };

  async function handleUploadPhoto() {

    if (image1 && image2 && image3 && image4 && image5) {
      
      files = []
      files[0] = image1
      files[1] = image2
      files[2] = image3
      files[3] = image4
      files[4] = image5

      for (var i = 0; i < 5; i++) {        
        const image = files[i];
    
        try {
          await FileSystem.uploadAsync(`http://localhost:3001/upload_single`, image.uri, {
            fieldName: 'image',
            httpMethod: 'POST',
            uploadType: FileSystem.FileSystemUploadType.MULTIPART,
            parameters: {id: i}
          });
        } catch (error) {
          console.log(error);
        }

      }

    } else {
      alert('Must upload 5 images')
    }
      
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {image1 && (
        <>
          <Image
            source={{ uri: image1.uri }}
            style={{ width: 30, height: 40 }}
          />
        </>
      )}
      <Button title="Choose Photo 1" onPress={()=> pickImage(setImage1)} />
      {image2 && (
        <>
          <Image
            source={{ uri: image2.uri }}
            style={{ width: 30, height: 40 }}
          />
        </>
      )}
      <Button title="Choose Photo 2" onPress={()=> pickImage(setImage2)} />
      {image3 && (
        <>
          <Image
            source={{ uri: image3.uri }}
            style={{ width: 30, height: 40 }}
          />
        </>
      )}
      <Button title="Choose Photo 3" onPress={()=> pickImage(setImage3)} />
      {image4 && (
        <>
          <Image
            source={{ uri: image4.uri }}
            style={{ width: 30, height: 40 }}
          />
        </>
      )}
      <Button title="Choose Photo 4" onPress={()=> pickImage(setImage4)} />
      {image5 && (
        <>
          <Image
            source={{ uri: image5.uri }}
            style={{ width: 30, height: 40 }}
          />
        </>
      )}
      <Button title="Choose Photo 5" onPress={()=> pickImage(setImage5)} />
      <Button title="Upload Photos" onPress={handleUploadPhoto} />

    </View>
  );
};

export default UploadScreen;