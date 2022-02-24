import request from './index'

// 请求mv
export function getTopMVs(offset, limit = 10) {
  return request.get('/top/mv', {offset, limit})
}