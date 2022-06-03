// components/song-menu/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String
    },
    songMenu: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: { 
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onSongMenuItemClick: function(event) {
      const item = event.currentTarget.dataset.item
      wx.navigateTo({
        url: `/pages/song-list/index?id=${item.id}&type=menu`,
      })
    }
  }
})
