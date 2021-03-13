import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { ImageBackground, StyleSheet, Text, View, ActivityIndicator, FlatList } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import * as Permissions from 'expo-permissions';
import {Audio} from 'expo-av'



import BgImage from './assets/bg.png'

import RenderItem from './components/Card';
import MusicInfo from 'expo-music-info';
import MiniPlayer from './components/MiniPlayer';
import Player from './components/Player';






export default function App() {

  const [permission, askPermission, getPermission] = Permissions.usePermissions(Permissions.MEDIA_LIBRARY, {ask : true });
  
  const[songs, setSongs]= useState([])
  const[endCursor, setEndCursor] = useState("")

  const [songPlay, setSongPlay] = useState()
  const[icon, setIcon]= useState({id:0, ico:"play"})
  const[currentSong, setCurrentSongData]=useState()
  const[fullPlayer, SetFullPlayer]=useState(false)


  
  useEffect(() => {
    MediaLibrary.getAssetsAsync({
     mediaType : MediaLibrary.MediaType.audio,
   }).then(res =>{
       setEndCursor(res.endCursor)
       getParsec(res.assets)
     })
  }, [songs.length == 0])



    useEffect(() => {
        return songPlay != undefined
          ? () => {
              songPlay.unloadAsync(); }
          : undefined;
      }, [songPlay])
    
      Audio.setAudioModeAsync({
        staysActiveInBackground : true,
      })


      const playAudio = async (songToPlay)=>{
        const {sound} = await Audio.Sound.createAsync(songToPlay)
        setCurrentSongData(songToPlay)
        setSongPlay(sound)
        sound.setOnPlaybackStatusUpdate(_onPlaybackStatusUpdate)
        await sound.playAsync()
        setIcon({id: songToPlay.id, ico:"pause"}) 
      }
      const pauseAudio = async ()=>{
        await songPlay.pauseAsync()
        setIcon({id: currentSong.id, ico:"play"})
      }
  

     const _onPlaybackStatusUpdate = playbackStatus => {
         if(playbackStatus.didJustFinish){
          setIcon({id: currentSong && currentSong.id, ico:"play"})
         }
         
      }

      const nextSongHandller = ()=>{
        playAudio(songs[songs.indexOf(currentSong) + 1])
      }

      const previousSongHandller = ()=>{
        playAudio(songs[songs.indexOf(currentSong) - 1])
      }

     
 

  const meta = uri =>{
    const data = MusicInfo.getMusicInfoAsync(uri,{
      title:true,
      album:true,
      picture:true,
    })

    return data
  }


  const getAsync = async(item)=>{
    return meta(item)
  }


  const getData = async(files)=>{
  return await Promise.all(files.map((song)=>getAsync(song.uri)
  ))}

const getParsec = (files)=>{
   getData(files).then(data =>{
    const tem = [...files]
     tem.map((value,index)=>{
      tem[index] = {
        ...tem[index],
        ...data[index],
      }
    })
    setSongs(tem)
  })
}

const getUpdatedParsec = (files)=>{
  getData(files).then(data =>{
   const tem = [...files]
    tem.map((value,index)=>{
     tem[index] = {
       ...tem[index],
       ...data[index],
     }
   })
   setSongs((prev)=> [...prev,...tem])
 })
}


 const loadMoreHandller = async()=>{
    MediaLibrary.getAssetsAsync({
      mediaType: MediaLibrary.MediaType.audio,
      after:endCursor,
    }).then(res=>{
      setEndCursor(res.endCursor)
      getUpdatedParsec(res.assets)
    })
  }

  const fullPlayerHandller = ()=> SetFullPlayer(true)

  const fullPlayerBackHandller = ()=> SetFullPlayer(false)


 
 
   
  return (
    <View style={styles.container}>
      <ImageBackground source={BgImage} style={styles.bg}>
      <Text style={styles.heading}>Welcome Back</Text>
      {songs.length > 0 ?
       <FlatList 
       data={songs} 
       renderItem={({item})=> <RenderItem item={item} play={playAudio} pause={pauseAudio} icon={icon} />} 
       keyExtractor={(item, index)=> index.toString()}
       onEndReached={loadMoreHandller}
       ListFooterComponent={<ActivityIndicator color={"red"} />}
       />
      :
      <View style={styles.loader}>
       <ActivityIndicator size={'large'} color={"red"} />
      </View>}
   
      </ImageBackground>
      <StatusBar style="light" />
      {songPlay && fullPlayer == false &&
      <MiniPlayer 
       item={currentSong} 
       play={playAudio} 
       pause={pauseAudio} 
       icon={icon} 
       fullPlayer={fullPlayerHandller}
      />
      }
      {fullPlayer && 
      <Player 
       item={currentSong} 
       back={fullPlayerBackHandller} 
       icon={icon} 
       play={playAudio} 
       pause={pauseAudio} 
       status={songPlay} 
       next={nextSongHandller}
       previous={previousSongHandller}
       />
      }
     
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex : 1,
  },
  bg : {
    flex : 1,
  },
  heading : {
    marginTop : 50,
    marginLeft : 30,
    fontSize : 30,
    marginBottom:32,
    fontWeight : "900",
    color : "#ffffff"
  },
  row:{
    marginTop: 30,
  },
  loader : {
    flex : 1,
    justifyContent: "center",
    alignItems : "center"
  },
});
