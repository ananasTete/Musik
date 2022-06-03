import request from './index'

// 热门搜索
export function getSearchHot() {
  return request.get("/search/hot")
}

// 搜索联想
export function getSearchSuggest(keywords) {
  return request.get("/search/suggest", {
    keywords,
    type: "mobile"
  })
}

// 搜索内容结果
export function getSearchResult(keywords) {
  return request.get("/search", {
    keywords
  })
}