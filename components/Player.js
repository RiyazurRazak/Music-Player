import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ImageBackground, BackHandler } from 'react-native'
import {Audio} from 'expo-av'
import Bg from '../assets/bg.png'
import { Icon } from 'react-native-elements'
import Droplets from '../assets/droplets.png'
import { Image } from 'react-native';
import { img1 } from '../assets/default-1'
import Slider from '@react-native-community/slider';


function Player({item, back, icon, play, pause, status, next, previous}) {


    useEffect(()=>{
        let clean = false
        clean == false && status.setOnPlaybackStatusUpdate(playBackStatus)
       clean ==false &&  BackHandler.addEventListener("hardwareBackPress", backHandller);
        return ()=> {
            clean = true
            BackHandler.removeEventListener("hardwareBackPress", backHandller) 
        }
    })

    const[duration, setDuration]=useState(0)
    const[position, setPosition]=useState(0)


    const backHandller = ()=> back()

    const playAudio = async (songToPlay)=>{
        play(songToPlay) 
     }
   
     const pauseAudio = async (song)=>{
          pause(song)
     }

     const playBackStatus = status =>{
         setDuration(status.durationMillis)
         setPosition(status.positionMillis)
     }

     const timeHandller = (millis)=>{
        var minutes = Math.floor(millis / 60000);
        var seconds = ((millis % 60000) / 1000).toFixed(0);
        if(minutes == NaN){
            minutes = 0
        }if (seconds == NaN){
            seconds = 0
        }
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
     }

     const changeDurationHandller = (millis)=>{
         status.setPositionAsync(millis)
     }

     const nextSong = ()=> next()

     const previousSong = ()=> previous()


    return (
        <View style={styles.root}>
             <ImageBackground blurRadius={8} source={Bg} style={styles.bg}>
              <ImageBackground blurRadius={0.5} source={Droplets} style={styles.bg}>
              <Icon iconStyle={{width: '100%', marginLeft:25, marginTop:20}} color="red" style={styles.backIco} name="chevron-left" size={30} type="font-awesome" onPress={backHandller} />
               <Text style={styles.text}>Now Playing..</Text>
               <Image source={{ uri : item.picture == undefined ? img1() : item.picture.pictureData}} style={styles.thumbnail} />
               <Text style={styles.songName}>{item.album? item.album.slice(0,20)+"..." : item.filename? item.filename.slice(0,20)+"..." : "Untitled "}</Text>
               <Slider

                 style={{width: "100%", height: 20}}
                 minimumValue={0}
                 maximumValue={duration}
                 value={position}
                 onValueChange={(value)=> changeDurationHandller(value)}
                 minimumTrackTintColor="red"
                 maximumTrackTintColor="#FFFFFF"
                 thumbTintColor={"red"}
                />
                <View style={styles.trackInfo}>
                    <Text style={{color:"#ffffff"}}>{timeHandller(position)}</Text>
                    <Text style={{color:"#ffffff"}}>{timeHandller(duration)}</Text>
                </View>
                <View style={styles.control}>
                  <Icon  color="white" style={styles.backIco} name="backward" size={30} type="font-awesome" onPress={previousSong} />
                  <Icon  color="white" style={styles.backIco} name={icon.id == item.id ? icon.ico : "play"} size={30} type="font-awesome" onPress={icon.id == item.id ? icon.ico  == "play" ?  ()=> playAudio(item): ()=>pauseAudio(item) : ()=> playAudio(item)} />
                  <Icon  color="white" style={styles.backIco} name="forward" size={30} type="font-awesome" onPress={nextSong}/>
                </View>
            </ImageBackground>
            </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    root:{
        position:"absolute",
        bottom:0,
        width:'100%',
        height:'86%',
        borderTopLeftRadius:10,
        borderTopRightRadius:10,
        backgroundColor:"#ffffff3d"
    },
    bg:{
        width: '100%',
        height:"100%"
    },
    text:{
        textAlign:'center',
        color:"#ffffff",
        fontSize: 20,
    },
    thumbnail:{
        marginTop:30,
        width: "70%",
        height:300,
        borderTopRightRadius:20,
        borderBottomRightRadius:20
    },
    songName:{
        color:'#ffffff',
        marginTop:50,
        marginLeft:40,
        marginBottom:40,
        fontSize:25,
    },
    trackInfo:{
        marginLeft:20,
        marginRight: 20,
        marginBottom:10,
        flex:1,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    control:{
        flex:3,
        flexDirection: "row",
        justifyContent: "space-evenly"
    }

})

export default Player
