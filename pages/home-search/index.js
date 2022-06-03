// pages/home-search/index.js
import {getSearchHot, getSearchSuggest, getSearchResult} from '../../service/api_search'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hots: [],
    searchValue: "",
    suggest: [],
    searchResult: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 请求热门搜索数据
    getSearchHot().then(res => {
      console.log(res);
      this.setData({ hots: res.result.hots })
    })
  },
  onSearchChange: function(event) {
    // 获取搜索内容
    let searchValue = event.detail
    this.setData({ searchValue })
    if(searchValue.startsWith(" ")) {
      searchValue = searchValue.trim()
    }
    if(!searchValue.length) {
      this.setData({ suggest: [], searchResult: [] })
      return
    } 
    getSearchSuggest(searchValue).then(res => {
      const data = res.result.allMatch || [];
      if(data.length > 0) {
        data.forEach(item => {
          if(item.keyword.startsWith(searchValue)) {
            item.hightLight = searchValue
            item.commonWord = item.keyword.replace(searchValue, "")
          }
        })
      }
      this.setData({ suggest: data})
    })
  },
  onSearchEnter: function() {
    getSearchResult(this.data.searchValue).then(res => {
      this.setData({ searchResult: res.result.songs })
    })
  },
  onKeywordClick: function(event) {
    const newValue = event.currentTarget.dataset.item
    this.setData({ searchValue: newValue})
    this.onSearchEnter()
  }
})