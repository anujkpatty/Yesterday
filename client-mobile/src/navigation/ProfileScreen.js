import React, { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { StackActions } from '@react-navigation/native';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';



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
    //relation state 0 == requested, 1 == request pending, 2 == accepted, 3 == not friends, 4 == same user
    const [relation, setRelation] = useState(null)
    const [profilePic, setProfilePic] = useState(null)
    const [refreshing, setRefreshing] = React.useState(false);
    const [posts, setPosts] = React.useState([])


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
            
          } catch (error) {
            console.log(error);
          }
        }
      };

    function getProfile() {
        Axios.get(`http://localhost:3001/${route.params.user}/posts`)
        .then(res => {
            setPosts(res.data)
        })
        .catch(err => console.log(err))       

        setProfilePic(`http://localhost:3001/profile_picture?user=${route.params.user}&hash=${Date.now()}`)
    }

    async function getRelation() {
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
    }

    useEffect(() => {
        getProfile()
        getRelation()
    }, [])


    async function addFriend() {
        Axios.post('http://localhost:3001/add_friend', {
            user_one: await SecureStore.getItemAsync('userToken'), 
            user_two: route.params.user,
        })
        .then(() => getRelation())
    }

    async function removeFriend() {
        Axios.put('http://localhost:3001/remove_friend', {
            user_one: await SecureStore.getItemAsync('userToken'), 
            user_two: route.params.user,
        })
        .then(() => getRelation())
    }

    async function acceptFriend() {
        Axios.put('http://localhost:3001/accept', {
            user_two: await SecureStore.getItemAsync('userToken'), 
            user_one: route.params.user,
        })
        .then(() => getRelation())
    }


    const render_button = () => {
        if (relation == 2 || relation == 0) {
            return(
                <Pressable key={relation} style={styles.request} onPress={removeFriend}>
                    <Text style={styles.request_text}>Remove</Text>
                </Pressable>)
        } else if (relation == 3) {
            return(
                    <Pressable key={relation} style={styles.request} onPress={addFriend}>
                        <Text style={styles.request_text}>Add</Text>
                    </Pressable>)
        } else if (relation == 1) {
            return(
                    <Pressable key={relation} style={styles.request} onPress={acceptFriend}>
                        <Text style={styles.request_text}>Add</Text>
                    </Pressable>)
        } else {
            return <View style={styles.spacer}/>
        }
    }

    function view_post(date) {
        posts.forEach(post => {
            if (post.date == date) {
                navigation.push('View', {id: post.id})
            }
        })
        
    }

    function posts_calender() {

        let marked_dates = {}

        posts.forEach((post) => {
            marked_dates[post.date] = {marked: true, disableTouchEvent: false}
        })


        return(
            <Calendar
                markedDates={marked_dates}
                disabledByDefault={true}
                enableSwipeMonths={true}
                hideExtraDays={true}
                onDayPress={day => {
                    view_post(day.dateString)
                }}
                disableAllTouchEventsForDisabledDays={true}
                style={styles.calendar}
                theme={{
                    backgroundColor: '#ffffff',
                    calendarBackground: '#ffffff',
                    textSectionTitleColor: '#000000',
                    textSectionTitleDisabledColor: '#000000',
                    selectedDayBackgroundColor: '#000000',
                    selectedDayTextColor: '#ffffff',
                    todayTextColor: '#000000',
                    dayTextColor: '#000000',
                    textDisabledColor: '#000000',
                    dotColor: '#000000',
                    selectedDotColor: '#000000',
                    arrowColor: 'black',
                    disabledArrowColor: 'black',
                    monthTextColor: 'black',
                    indicatorColor: 'black',
                    textDayFontWeight: '100',
                    textMonthFontWeight: 'normal',
                    textDayHeaderFontWeight: '100',
                    textDayFontSize: 20,
                    textMonthFontSize: 16,
                    textDayHeaderFontSize: 12
                }}
            />
        )
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
                    
                    {render_button()}
                    {posts_calender()}
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
        height: '100%'
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
    spacer: {
        height: 25,
    },
    request_text: {
        fontSize: 12,
        color: 'white',
    },
    calendar: {
        width: 360,
        marginTop: 25,
    }
})