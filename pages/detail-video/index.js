// pages/detail-video/index.js
import {getMVURL, getMVDetail, getRelatedVideo} from '../../service/api_video'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mvURLInfo: {},
    mvDetail: {},
    relatedVideo: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const id = options.id;
    this.getPageData(id)
  },

  getPageData: function(id) {
    console.log(id);
    getMVURL(id).then(res => {
      this.setData({
        mvURLInfo: res.data
      })
    })
    getMVDetail(id).then(res => {
      this.setData({
        mvDetail: res.data
      })
    })
    getRelatedVideo(id).then(res => {
      this.setData({
        relatedVideo: res.data
      })
    })
  }
})