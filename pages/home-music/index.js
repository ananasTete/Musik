// pages/home-music/index.js
import { getBanners } from '../../service/api_music'
import  queryRect  from '../../utils/selector-rect'
import _ from 'lodash'

const throttleQueryRect = _.throttle(queryRect, 1000, { 'trailing': false })

Page({
  data: {
    banners: [],
    swiperHeight: 0
  },
  onLoad: function(){
    this.getPageData()
  },
  // 获取页面数据
  getPageData: function() {
    getBanners().then(res => {
      this.setData({
        banners: res.banners
      })
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
  }
})