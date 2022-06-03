// pages/music-player/index.js

import {innerAudioContext, playerStore} from '../../store/player-store'

const {screenHeight, statusBarHeight, NAVBAR_HEIGHT, deviceRadio} = getApp().globalData
const playModes = ["order", "repeat", "random"]

Page({

  data: {
    currentSong: {},
    duration: 0,
    lyrics: [],

    currentTime: 0,
    currentLyric: "",
    currentLyricIndex: 0,

    currentPage: 0,
    contentHeight: 0,
    isLyricShow: true,

    sliderValue: 0,
    isSliderChanging: false,
    lyricScrollLength: 0,

    playModeIndex: 0,
    playModeName: "order",
    isPlaying: false,
  },

  onLoad: function (options) {
    // 进入播放页面后的一些与设备相关的值的初始化
    this.setData({
      contentHeight: (screenHeight - statusBarHeight - NAVBAR_HEIGHT),
      isLyricShow: deviceRadio >= 2      // 当设备高宽比大于等于2时才显示播放页面歌词
    })

    // 获取歌曲详情和歌词信息
    playerStore.onStates(["currentSong", "duration", "lyrics"], ({
      currentSong, duration, lyrics
    }) => {
      if(currentSong) this.setData({currentSong})
      if(duration) this.setData({duration})
      if(lyrics) this.setData({lyrics})
    })

    // 监听currentTime/currentLyric/currentLyricIndex
    playerStore.onStates(["currentTime", "currentLyric", "currentLyricIndex"], ({
      currentTime, currentLyric, currentLyricIndex
    }) => {
      // 在slider没有手动滑动时，才随着时间设置currentTime、sliderValue,避免在滑动过程中重复设置
      if(currentTime && !this.data.isSliderChanging) {
        this.setData({
          currentTime,
          sliderValue: currentTime / this.data.duration * 100
        })
      } 
      if(currentLyric) this.setData({currentLyric})
      if(currentLyricIndex !== undefined) this.setData({currentLyricIndex, lyricScrollLength: currentLyricIndex * 35})
    })

    // 监听操作歌曲播放相关的数据
    playerStore.onStates(["playModeIndex", "isPlaying"], ({playModeIndex, isPlaying}) => {
      if(playModeIndex !== undefined) this.setData({playModeIndex, playModeName: playModes[playModeIndex]})
      if(isPlaying !== undefined) this.setData({ isPlaying })
    })
  },

  // 播放页面子页切换
  onSwiperChange:  function(event) {
    const currentPage = event.detail.current
    this.setData({ currentPage })
  },

  // nav-bar中左边按钮事件
  onLeftClick: function() {
    wx.navigateBack()
  },

  // slider位置改变完成
  onSliderChange: function(event) {
    const value = event.detail.value
    const currentTime = this.data.duration * (value / 100)
    this.setData({ currentTime, isSliderChanging: false, sliderValue: value }) 
    innerAudioContext.seek(currentTime / 1000)       // 跳转到指定位置
  },

  // slider位置改变中
  onSliderChanging: function(event) {
    const value = event.detail.value
    const currentTime = this.data.duration * value / 100
    this.setData({ currentTime, isSliderChanging: true })
  },

  // scroll-view滚动结束事件
  onScrollDragend: function(event) {
    const newIndex = parseInt(event.detail.scrollTop / 35) 
    const currentTime = this.data.lyrics[newIndex].time
    innerAudioContext.seek(currentTime / 1000)       // 跳转到指定位置
  },

  // 切换播放模式
  onModeBtnClick: function() {
    let playModeIndex = this.data.playModeIndex
    if(++playModeIndex === 3) playModeIndex = 0
    // 更新到playerStore
    playerStore.setState("playModeIndex", playModeIndex)
  },

  // 切换播放与暂停
  onPauseClick: function() {
    playerStore.dispatch("changePlayStatus", !this.data.isPlaying)
  },

  // 切换上一首/下一首歌曲
  onPreClick: function() {
    playerStore.dispatch("changeMusic", false)
  },
  onNextClick: function() {
    playerStore.dispatch("changeMusic", true)
  }
})