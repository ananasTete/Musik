// pages/home-music/index.js
import { getBanners, getSongMenu } from '../../service/api_music'
import  queryRect  from '../../utils/selector-rect'
import {rankingStore, rankingArray} from '../../store/ranking-store'
import {playerStore} from '../../store/player-store'
import _ from 'lodash'

const throttleQueryRect = _.throttle(queryRect, 1000, { 'trailing': true })

Page({
  data: {
    banners: [],
    swiperHeight: 0,
    recommendSongs: [],
    hotSongMenu: [],
    recommendSongMenu: [],
    rankings: {},
    
    currentSong: {},
    isPlaying: false
  },
  onLoad: function(){
    console.log(126);
    this.getPageData()
  },
  // 获取页面数据
  getPageData: function() {
    playerStore.onStates(["currentSong", "isPlaying"], ({currentSong, isPlaying}) => {
      if(currentSong) this.setData({currentSong})
      if(isPlaying !== undefined) this.setData({isPlaying})
    })
    // 请求轮播图数据
    getBanners().then(res => {
      this.setData({
        banners: res.banners
      })
    })
    // 请求榜单数据
    rankingStore.dispatch("getRankingData")
    rankingStore.onState("hotRanking", (res) => {
      if(!res.tracks) return
      const recommendSongs = res.tracks.slice(0, 6)
      this.setData({ recommendSongs })
    })
    rankingStore.onState("newRanking", this.getRanking(0))
    rankingStore.onState("originRanking", this.getRanking(2))
    rankingStore.onState("upRanking", this.getRanking(3))
    // 请求歌单数据
    getSongMenu().then(res => {
      this.setData({hotSongMenu: res.playlists})
    })
    getSongMenu("华语").then(res => {
      this.setData({recommendSongMenu: res.playlists})
    })
  },
  // 点击搜索框事件
  handleSerchClick: function() {
    wx.navigateTo({
      url: '/pages/home-search/index',
    })
  },
  // 轮播图加载完成事件
  handleSwiperLoaded: function(event) {
    throttleQueryRect(".swiper-image").then(res => {
      this.setData({
        swiperHeight: res
      })
    })
  },
  getRanking: function(idx) {
    return (res) => {
      if(Object.keys(res).length === 0) return
      const data = {
        name: res.name,
        imgUrl: res.coverImgUrl,
        playCount: res.playCount,
        songs: res.tracks.slice(0, 3) 
      }
      const originRankings = {...this.data.rankings, [idx]: data} 
      this.setData({ rankings: originRankings })  
    }
  },
  onHeaderClick: function() {
    wx.navigateTo({
      url: '/pages/song-list/index?ranking=hotRanking&type=ranking',
    })
  },
  onRankingClick: function(event) {
    const index = event.currentTarget.dataset.index
    const rankingName = rankingArray[index]
    wx.navigateTo({
      url: `/pages/song-list/index?ranking=${rankingName}&type=ranking`,
    }) 
  },
  onRecommendSongItemClick: function(event) {
    const index = event.currentTarget.dataset.index
    playerStore.setState( "playListIndex", index )
    playerStore.setState( "playList", this.data.recommendSongs)
  },
  onPauseClick: function() {
    playerStore.dispatch("changePlayStatus", !this.data.isPlaying)
  },
  onPlayBarClick: function() {
    wx.navigateTo({
      url: '/pages/music-player/index?id=' + this.data.currentSong.id,
    })
  }
})