// 电梯导航

export function nav(e) {
  // console.log(e,'打印接收的参数');
  let jump = document.querySelectorAll('.con')
  // console.log('jump:', jump);
  let total = jump[e].offsetTop - 85
  // console.log('total:', total);
  // console.log(total,'锚点');
  // this.scrolls.push(total)
  // this.point = [...new Set(this.scrolls)].sort((a, b) => b - a)
  // console.log(this.point,'11111');
  let distance = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
  // console.log('distance:', distance);
  // 平滑滚动，时长500ms，每10ms一跳，共50跳
  let step = total
  // console.log('step:', step);
  if (total > distance) {
    smoothDown()
  } else {
    let newTotal = distance - total
    step = newTotal
    smoothUp()
  }

  function smoothDown() {
    if (distance < total) {
      distance += step
      document.documentElement.scrollTop = distance
      window.pageYOffset = distance
      document.body.scrollTop = distance
      setTimeout(smoothDown, 10)
    } else {
      document.documentElement.scrollTop = total
      window.pageYOffset = total
      document.body.scrollTop = total
    }
  }

  function smoothUp() {
    if (distance > total) {
      distance -= step
      document.documentElement.scrollTop = distance
      window.pageYOffset = distance
      document.body.scrollTop = distance
      setTimeout(smoothUp, 10)
    } else {
      document.documentElement.scrollTop = total
      window.pageYOffset = total
      document.body.scrollTop = total
    }
  }
}

