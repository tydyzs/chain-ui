// 千分符
export function thousands(e) {
  e.map(k => {
    for (let i in k) {
      if (typeof k[i] === 'number') {
        k[i] = k[i].toLocaleString()
      }
    }
  })
}
