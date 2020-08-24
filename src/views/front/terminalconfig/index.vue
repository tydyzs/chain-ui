<!-- 接口管理-- 终端配置页面 -->
<template>
  <div class="container">
    <div class="navigation">
      <!-- <h3 v-for="(item, i) in steps" :key="i" :class="item.current">
        <a href="javascript:;" @click="jump(i)">{{ item.label }}</a>
      </h3> -->
      <el-steps :active="active" align-center>
        <el-step v-for="(item, i) in steps" :key="i" :title="item.label" @click.native="jump(i)"></el-step>
      </el-steps>
    </div>
    <div class="floors">
      <div v-for="(item, i) in steps" :key="i" class="con">{{ item.label }}</div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      steps: [
        {
          label: '产品详情',
          value: 'box1',
        }, {
          label: '预定须知',
          value: 'box2',
        }, {
          label: '费用明细',
          value: 'box3',
        }, {
          label: '温馨提示',
          value: 'box4',
        }
      ],
      active: 0,
      scrolls: [],
      point: [],
      points: [1740, 1160, 580, 0],
      b: {},
      obj: {
        '农业': false,
        '工业': false
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      window.addEventListener('scroll', this.onScroll)
    })
  },
  // created() {
  //   for (let i = 0, len = this.steps.length; i < len; i++) {
  //     let ele = document.getElementById('i')
  //   }
  // },
  created() {
  },
  methods: {
    // 锚点连接平滑滚动
    jump (e) {
      let jump = document.querySelectorAll('.con')
      let total = jump[e].offsetTop - 100
      this.scrolls.push(total)
      this.point = [...new Set(this.scrolls)].sort((a, b) => b - a)
      // console.log(this.point,'11111');
      let distance = document.documentElement.scrollTop || document.body.scrollTop || window.pageYOffset
      // 平滑滚动，时长500ms，每10ms一跳，共50跳
      let step = total / 50
      if (total > distance) {
        smoothDown()
      } else {
        let newTotal = distance - total
        step = newTotal / 50
        smoothUp()
      }
      function smoothDown () {
        if (distance < total) {
          distance += step
          document.body.scrollTop = distance
          document.documentElement.scrollTop = distance
          window.pageYOffset = distance
          setTimeout(smoothDown, 10)
        } else {
          document.body.scrollTop = total
          document.documentElement.scrollTop = total
          window.pageYOffset = total
        }
      }
      function smoothUp () {
        if (distance > total) {
          distance -= step
          document.body.scrollTop = distance
          document.documentElement.scrollTop = distance
          window.pageYOffset = distance
          setTimeout(smoothUp, 10)
        } else {
          document.body.scrollTop = total
          document.documentElement.scrollTop = total
          window.pageYOffset = total
        }
      }
    },
    onScroll () {
      // console.log(this.point,'0000');
      let scrolled = document.documentElement.scrollTop || document.body.scrollTop || window.pageYOffset
      // var len = this.points.length
      // if (scrolled >= this.points[0]) {
      //   this.active = len - 1
      // } else if (scrolled < this.points[0] && scrolled >= this.points[1]) {
      //   this.active = len - 2
      // } else if (scrolled < this.points[1] && scrolled >= this.points[2]) {
      //   this.active = len - 3
      // } else if (scrolled < this.points[2] && scrolled >= this.points[3]) {
      //   this.active = len - 4
      // }
     this.points.forEach((item, i) => {
      //  console.log(item, i, '000');
     })
      // if (scrolled >= 1740) {
      //   this.active = 3
      // } else if (scrolled < 1740 && scrolled >= 1160) {
      //   this.active = 2
      // } else if (scrolled >= 580 && scrolled < 1160) {
      //   this.active = 1
      // } else {
      //   this.active = 0
      // }
    },
    // 返回顶部功能
    // scrollTop () {
    //   let distance = document.documentElement.scrollTop || document.body.scrollTop || window.pageYOffset
    //   let step = distance / 50
    //   let total = 0
    //   if (total < distance) {
    //     let newTotal = distance - total
    //     step = newTotal / 50
    //     smoothUp()
    //   }
    //   function smoothUp () {
    //     if (distance > 1) {
    //       distance -= step
    //       document.body.scrollTop = distance
    //       document.documentElement.scrollTop = distance
    //       window.pageYOffset = distance
    //       setTimeout(smoothUp, 10)
    //     } else {
    //       document.body.scrollTop = 1
    //       document.documentElement.scrollTop = 1
    //       window.pageYOffset = 1
    //     }
    //   }
    // }
  }
}
</script>

<style lang="scss" scoped>
.container {
  .navigation /deep/ {
    display: flex;
    justify-content: flex-start;
    position: fixed;
    z-index: 99999;
    // background-color: #ccc;
    width: 100%;
    border-bottom: 1px solid #ccc;
    .el-steps {
      width: 40%;
      .el-step {
        .el-step__head.is-finish {
          color: #000;
          border-color: #000;
        }
        .el-step__title.is-finish {
          color: #000;
        }
        .el-step__head.is-process {
          color: #029f4a;
          border-color: #029f4a;
        }
        .el-step__title.is-process {
          color: #029f4a;
        }
        .el-step__head.is-wait {
          color: #000;
          border-color: #000;
        }
        .el-step__title.is-wait {
          color: #000;
        }
      }
    }
    // h3.active {
    //   background-color: orange;
    // }
    // h3 {
    //   margin-right: 30px;
    //   padding: 5px 10px;
    // }
  }
  .floors {
    padding-top: 100px;
    .con {
      width: 100%;
      height: 400px;
      margin-bottom: 180px;
    }
    .box1 {
      background-color: skyblue;
    }
    .box2 {
      background-color: red;
    }
    .box3 {
      background-color: green;
    }
    .box4 {
      background-color: yellow;
    }
  }
}
</style>
