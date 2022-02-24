const BASE_URL = "http://123.207.32.32:9001"

class Request {
  request(url, method, data) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: BASE_URL + url,
        method,
        data,
        success: function(res) {
          resolve(res.data)
        },
        fail: function(err) {
          reject(err)
        },
      })
    })
  }
  get(url, data) {
    return this.request(url, 'GET', data)
  }
  post(url, data) {
    return this.request(url, 'POST', data)
  }
}

export default new Request()