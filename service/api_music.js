import request from './index'

// 请求轮播图
export function getBanners() {
  return request.get("/banner",{
    type:2
  })
}

// 请求榜单
export function getRankings(idx) {
  return request.get("/top/list", {
    idx
  })
}

// 请求歌单
export function getSongMenu(cat="全部", limit=6, offset=0) {
  return request.get("/top/playlist", {
    cat,
    limit,
    offset
  })
}

// 请求歌单详情
export function getSongMenuDetail(id) {
  return request.get("/playlist/detail/dynamic", {
    id
  })
}
