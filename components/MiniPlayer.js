import React from 'react'
import { View, StyleSheet, Text, ImageBackground, Image, Pressable } from 'react-native'
import Bg from '../assets/miniplayer.png'
import { Icon } from 'react-native-elements'
import { img1 } from '../assets/default-1';


function MiniPlayer({item, icon, play, pause, fullPlayer}) {

    const playAudio = async (songToPlay)=>{
        play(songToPlay) 
     }
   
     const pauseAudio = async (song)=>{
          pause(song)
     }

     const ClickHandller = ()=>{
         fullPlayer()
     }
   
    return (
        <View style={styles.root}>
            <Pressable onPress={ClickHandller}>
             <ImageBackground blurRadius={0} source={Bg} style={styles.bg1}>
              <View style={styles.innerView}>
                 <Image source={{ uri : item.picture == undefined ? img1() : item.picture.pictureData}} style={styles.thumbnail}/>
                 <View style={styles.content}>
                 <Text style={styles.songName} >{item.album? item.album.slice(0,15)+"..." : item.filename? item.filename.slice(0,15)+"..." : "Untitled "}</Text>
                 <Icon style={styles.icon} color="red" name={icon.id == item.id ? icon.ico : "play"} size={30} type="font-awesome" onPress={icon.id == item.id ? icon.ico  == "play" ?  ()=> playAudio(item): ()=>pauseAudio(item) : ()=> playAudio(item)}/>
                 </View> 
              </View>  
            </ImageBackground>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
  root:{
      position: 'absolute',
      bottom: 0,
      width: "100%",
      height: 80,
      backgroundColor: "#ffffff99",
      borderTopLeftRadius:10,
      borderTopRightRadius:10,
  },
  bg1:{
    width: "100%",
    height:80,
  },
  innerView:{
      flex:1,
      flexDirection: 'row',
      height:80
  },
  thumbnail:{
     width: 80,
     height:80,
     borderTopLeftRadius : 8,
  },
  content:{
      flex:1,
      flexDirection:"row",
      justifyContent:"space-around",
      margin:20,
  },
  songName:{
      fontWeight: "bold",
      fontSize:20,
      color:"#000000"
  },
})


export default MiniPlayer
