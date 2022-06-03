import {HYEventStore} from 'hy-event-store'
import {getRankings} from '../service/api_music'

const rankingArray = ["newRanking", "hotRanking", "originRanking", "upRanking"]

// 保存榜单的store

const rankingStore =  new HYEventStore({
  state: {
    newRanking: {},  // 0
    hotRanking: {},  // 1
    originRanking: {},  // 2
    upRanking: {},  // 3
  },
  actions: {
    // 0:新歌榜 1：热歌榜 2：原创榜 3：飙升榜
    getRankingData(ctx) {
      for (let index = 0; index < 4; index++) {
        getRankings(index).then(res => {
          const rankingName = rankingArray[index]
          ctx[rankingName] = res.playlist
        })
      }
    }
  }
})

export {
  rankingArray,
  rankingStore
} 