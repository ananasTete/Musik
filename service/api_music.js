import request from './index'

// 请求轮播图
export function getBanners() {
  return request.get("/banner",{
    type:2
  })
}