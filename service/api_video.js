import request from './index'

// 请求mv
export function getTopMVs(offset, limit = 10) {
  return request.get('/top/mv', {offset, limit})
}

// 请求mv的播放地址
export function getMVURL(id) {
  return request.get("/mv/url", {
    id
  })
}

// 请求mv的详情
export function getMVDetail(mvid) {
  return request.get("/mv/detail", {
    mvid
  })
}

// 请求mv的关联视频
export function getRelatedVideo(id) {
  return request.get("/related/allvideo", {
    id
  })
}