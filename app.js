// app.js
App({
  globalData: {
    screenWidth: 0,
    screenHeight: 0,
    statusBarHeight: 0,
    NAVBAR_HEIGHT: 44,
    deviceRadio: 0
  },
  onLaunch: function() {
    const info = wx.getSystemInfoSync()
    this.globalData.screenWidth = info.screenWidth
    this.globalData.screenHeight = info.screenHeight
    this.globalData.statusBarHeight = info.statusBarHeight
    this.globalData.deviceRadio = info.screenHeight / info.screenWidth
  }
})

Object.assign(global, {
  Array : Array,
  Date : Date,
  Error : Error,
  Function : Function,
  Math : Math,
  Object : Object,
  RegExp : RegExp,
  String : String,
  TypeError : TypeError,
  setTimeout : setTimeout,
  clearTimeout : clearTimeout,
  setInterval : setInterval,
  clearInterval : clearInterval
});