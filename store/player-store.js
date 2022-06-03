

import {HYEventStore} from 'hy-event-store'
import { parseLyric } from '../utils/parse-lyric'
import {getSongDetail, getAudioUrl, getSongLyric} from '../service/api_player'


const innerAudioContext = wx.getBackgroundAudioManager()

const playerStore = new HYEventStore({
  state: {
    isFirstPlay: true,

    currentId: 0,

    currentSong: {},
    duration: 0,
    lyrics: [],

    currentTime: 0,
    currentLyric: "",
    currentLyricIndex: 0,

    playModeIndex: 0, // 0:顺序播放 1:单曲循环 2:随机播放

    isPlaying: false,

    playList: [],
    playListIndex: 0
  },
  actions: {
    playMusicWithSongID(ctx, {id, isRefresh = false}) {
      
      if(ctx.currentId === id && !isRefresh) {   // 1. 前后两首歌是一首，并且没有强制刷新，继续播放
        return
      } else if(ctx.currentId !== id) {        // 2. 前后两首歌不是一首
        ctx.currentId = id
        ctx.isPlaying = true

        // 清空上一首歌的数据
        ctx.currentSong = {}
        ctx.duration = 0
        ctx.lyrics = []
        ctx.currentTime = 0
        ctx.currentLyric = ""
        ctx.currentLyricIndex = 0

        // 请求歌曲详情
        getSongDetail(id).then(res => {
          ctx.currentSong = res.songs[0];
          ctx.duration = res.songs[0].dt
          innerAudioContext.title = res.songs[0].name
        })
        // 请求歌词信息
        getSongLyric(id).then(res => {
          const lyricString = res.lrc.lyric
          ctx.lyrics = parseLyric(lyricString)
        })
      }

      // 3. 前后两首歌是一首，强制刷新，重新播放

      // 播放
      innerAudioContext.stop()
      innerAudioContext.src = getAudioUrl(id) 
      innerAudioContext.title = id
      innerAudioContext.autoplay = true

      // 给audioContext注册一些事件,这些事件只需要注册一次
      if(ctx.isFirstPlay) {
        this.dispatch("setupAudioContextListener")
        ctx.isFirstPlay = false
      }
    },
    
    //
    setupAudioContextListener(ctx) {
      // 1.监听歌曲可以播放的事件
      innerAudioContext.onCanplay(() => {
        innerAudioContext.play()
        if(!ctx.isPlaying) ctx.isPlaying = true
      })
      // 2.歌曲播放后监听时间改变的事件
      innerAudioContext.onTimeUpdate(() => {
        // 2.1 实时获取歌曲的当前播放时间
        const currentTime = innerAudioContext.currentTime * 1000
        ctx.currentTime = currentTime
  
        // 2.2 实时获取当前时间对应的歌词
        const lyrics = ctx.lyrics
        for (let i = 0; i < lyrics.length; i++) {
          const lyricInfo = lyrics[i];
          if(currentTime < lyricInfo.time) {
            const index = i - 1
            if(ctx.currentLyricIndex !== index) {
              ctx.currentLyric = lyrics[index].text
              ctx.currentLyricIndex = index  // 保存索引是为了不给currentLyric设置重复的值
              console.log(lyrics[i-1]);
            }
            break            // 不再往后判断，进入下一次循环
          }
        }
      }),
      // 3.监听歌曲播放完成
      innerAudioContext.onEnded(() => {
        // 播放下一首歌曲
        this.dispatch("changeMusic", true)
      })
      // 4.监听歌曲暂停/播放
      innerAudioContext.onPlay(() => {
        ctx.isPlaying = true
      })
      innerAudioContext.onPause(() => {
        ctx.isPlaying = false
      })  
      innerAudioContext.onStop(() => {
        ctx.isPlaying = false
      })
    },
    // 切换播放与暂停
    changePlayStatus: function(ctx, isPlaying) {
      ctx.isPlaying = isPlaying
      ctx.isPlaying ? innerAudioContext.play() : innerAudioContext.pause()
    },

    // 播放上一首/下一首歌曲
    changeMusic: function(ctx, isNext = true) {
      let index = ctx.playListIndex
      const playList = ctx.playList

      switch (ctx.playModeIndex) {
        case 0:  // 顺序播放
          index = isNext ? index + 1 : index - 1
          if(index === -1) index = playList.length - 1
          if(index === playList.length) index = 0
          break;
        case 1:  // 单曲循环
          break;
        case 2:  // 随机播放
          index = Math.floor(Math.random() * playList.length)
          break;
      }

      ctx.playListIndex = index
      let newSong = playList[index]
      if(!newSong) newSong = ctx.currentSong

      this.dispatch("playMusicWithSongID", {id: newSong.id, isRefresh: true})
    }
  }
})

export {
  innerAudioContext,
  playerStore
}