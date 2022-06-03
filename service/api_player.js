import request from './index'

export function getSongDetail(ids) {
  return request.get("/song/detail",{
    ids
  })
}

export function getAudioUrl(id) {
  return `https://music.163.com/song/media/outer/url?id=${id}.mp3`
}

// 获取歌词
export function getSongLyric(id) {
  return request.get("/lyric", {
    id
  })
}