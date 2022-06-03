const timeRegExp = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/


export function parseLyric(lyricString) {
  const lyrics = []
  const lyric = lyricString.split("\n") 

  for (const item of lyric) {
    const timeResult = timeRegExp.exec(item)
    if(!timeResult) continue
    const minute = timeResult[1] * 60 * 1000
    const second = timeResult[2] * 1000
    const millsecond = (timeResult[3] + 0).slice(0, 3) * 1
    const time = minute + second + millsecond

    const text = item.replace(timeRegExp, "")
    lyrics.push({time, text}) 
  }

  return lyrics
} 