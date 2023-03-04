import React, { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { StackActions } from '@react-navigation/native';



import { 
        Text, 
        View, 
        Image, 
        TextInput, 
        Button, 
        StyleSheet, 
        Pressable,  
        RefreshControl,
        SafeAreaView,
        ScrollView, 
    } from 'react-native';
import Axios from 'axios';

export default function ProfileScreen({ navigation, route }) {
    const [loaded, setLoaded] = useState(false)
    //relation state 0 == requested, 1 == request pending, 2 == accepted, 3 == not friends, 4 == same user
    const [relation, setRelation] = useState(null)
    const [profilePic, setProfilePic] = useState(null)
    const [refreshing, setRefreshing] = React.useState(false);


    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setRefreshing(false)
        
    }, []);

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [3, 4],
          quality: 0,
        });
    
        if (!result.canceled) {
          let image = result.assets[0]
          
          image = await manipulateAsync(
            image.localUri || image.uri,
            [{ resize: { height: 200, width: 200 } }],
            { compress: 1, format: SaveFormat.PNG }
          );
          try {
            const curUser = await SecureStore.getItemAsync('userToken') 
            let res = await FileSystem.uploadAsync(`http://localhost:3001/profile_picture?user=${curUser}`, image.uri, {
              fieldName: 'image',
              httpMethod: 'POST',
              uploadType: FileSystem.FileSystemUploadType.MULTIPART,
            });
            setLoaded(false)
            
          } catch (error) {
            console.log(error);
          }
        }
      };

    async function getProfile() {
        const curUser = await SecureStore.getItemAsync('userToken') 
        if (curUser == route.params.user) {
            setRelation(4)
        } else {
            Axios.get(`http://localhost:3001/relation?user_1=${curUser}&user_2=${route.params.user}`)
            .then(res => {
                setRelation(res.data.relation)
            })
            .catch(err => console.log(err))
        }
        setProfilePic(`http://localhost:3001/profile_picture?user=${route.params.user}&hash=${Date.now()}`)
        
    }

    async function load() {
        await getProfile();

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
            if (relation == 2 || relation == 0) {
                return(
                    <Pressable style={styles.request} onPress={removeFriend}>
                        <Text style={styles.request_text}>Remove</Text>
                    </Pressable>)
            } else if (relation == 3) {
                return(
                        <Pressable style={styles.request} onPress={addFriend}>
                            <Text style={styles.request_text}>Add</Text>
                        </Pressable>)
            } else if (relation == 1) {
                return(
                        <Pressable style={styles.request} onPress={acceptFriend}>
                            <Text style={styles.request_text}>Add</Text>
                        </Pressable>)
            }
        } else {
            return((<Text>Loading</Text>))
        }
        
    }

    return (
            <SafeAreaView style={styles.container}>
                <ScrollView
                    contentContainerStyle={styles.scrollView}
                    refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }>

                    {relation == 4 ? (
                        <Pressable onPress={() => pickImage()}>
                            <Image key={Date.now()} source={{uri: profilePic}} alt="" style = {styles.profile} />
                        </Pressable>
                    ) :
                        <Image key={Date.now()} source={{uri: profilePic}} alt="" style = {styles.profile} />
                    }
                    <Text style={styles.profile_name}>{route.params.user}</Text>
                    
                    {render()}
                </ScrollView>
            </SafeAreaView>
            
        
    )

}

const styles = StyleSheet.create({
    profile: {
        height: 100,
        width: 100,
        borderRadius: 50,
        margin: 20,
        marginTop: 30,
    },
    profile_name: {
        fontSize: 16,
    },
    container: {
        
    },
    scrollView: {
        alignItems: 'center',
    },
    request: {
        height: 25,
        width: 100,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 15,
        backgroundColor: 'black',
        borderRadius: 2,

    },
    request_text: {
        fontSize: 12,
        color: 'white',
    }
})