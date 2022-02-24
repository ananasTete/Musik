// pages/home-video/index.js
import {getTopMVs} from '../../service/api_video'

Page({
  data: {
    topMVs: [],
    hasMore: true
  },
  // 生命周期钩子：页面加载完成
  onLoad: async function (options) {
    this.getTopMVData(0)
  },

  // 请求mv
  getTopMVData: async function(offset) {
    if(!this.data.hasMore && offset !== 0) return
    const res = await getTopMVs(offset)
    let newData = this.data.topMVs
    if(offset === 0) {
      newData = res.data
    } else {
      newData = newData.concat(res.data)
    }
    this.setData({
      topMVs: newData,
      hasMore: res.hasMore
    })
    wx.stopPullDownRefresh()
  },
  // 上拉加载更多
  onReachBottom: async function() {
    this.getTopMVData(this.data.topMVs.length)
  },
  // 下拉加载刷新
  onPullDownRefresh: async function() {
    this.getTopMVData(0)
  },

  // video点击事件
  handleVideoItemClick: function(event) {
    console.log(event.currentTarget.dataset.item.id);

    wx.navigateTo({
      url: `/pages/detail-video/index?id=&{id}`,
    })
  }
})