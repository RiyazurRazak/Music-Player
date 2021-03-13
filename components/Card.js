import React from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import { Icon } from 'react-native-elements'
import {img1} from '../assets/default-1'
import Bg from '../assets/droplets.png'
import { ImageBackground, StyleSheet, Text, View, Image } from 'react-native';


const RenderItem = ({item, play, icon, pause})=>{

  
  const playAudio = async (songToPlay)=>{
     play(songToPlay) 
  }

  const pauseAudio = async (song)=>{
       pause(song)
  }

 
  return(
  <>
  <View style={styles.root}>
    <LinearGradient colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255,0.115)']} style={[styles.glass]} >
    <ImageBackground blurRadius={0.3} source={Bg} style={styles.bg1}>
    <Image source={{ uri : item.picture == undefined ? img1() : item.picture.pictureData}}
      style={styles.img} />
    <View style={styles.name_cont}>
    <Text style={styles.songName} >{item.album? item.album : item.filename? item.filename.slice(0,18) : "Untitled "}</Text>
    <Icon color="red" name={icon.id == item.id ? icon.ico : "play"} size={30} type="ant-design" onPress={icon.id == item.id ? icon.ico  == "play" ?  ()=> playAudio(item): ()=>pauseAudio(item) : ()=> playAudio(item)}/>
    </View>
    </ImageBackground>
    </LinearGradient>
    </View> 
  </>
)

}

const styles = StyleSheet.create({
      root:{
      marginLeft:20,
      marginBottom:30,
    },
    bg1:{
      width:380,
      height:281,
      borderRadius:20,
    },
    glass:{
      width: 380,
      height:281,
      borderRadius: 20,
    },
    img : {
    width : 340,
    height : 210,
    borderTopLeftRadius: 20,
    },
    name_cont :{
      flex: 1,
      flexDirection: 'row',
      justifyContent: "space-between",
      alignItems: "center",
      marginLeft: 20,
      marginRight : 20,
    },
    songName : {
      color : "#ffffff",
      fontSize : 20,
      fontWeight : "900",
      flex : 0.9,
      flexWrap: "wrap"
    },
});

export default RenderItem

