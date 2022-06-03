// pages/song-list/index.js

import {rankingStore} from '../../store/ranking-store'
import {getSongMenuDetail} from '../../service/api_music'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    rankingName: "",
    songList: {},
    type: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const type = options.type
    this.setData({ type })
    if(type === 'menu') {
      const id = options.id
      getSongMenuDetail(id).then(res => {
        this.setData({ songList: res.playlist })
      })
    } else if (type === 'ranking') {
      const rankingName = options.ranking
      this.setData({ songList: rankingName })
      rankingStore.onState(rankingName, this.getRankingData)
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    if(this.data.rankingName) {
      rankingStore.offState(this.data.rankingName, this.getRankingData)
    }
  },
  getRankingData: function(res) {
    this.setData({ songList: res })
  },
  onSongListItemClick: function(event) {
    const index = event.currentTarget.dataset.index
    playerStore.setState( "playListIndex", index )
    playerStore.setState( "playList", this.data.songList.tracks)
  }
})