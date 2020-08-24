<template>
  <div v-bind:id="id" v-bind:data="data"></div>
</template>

<script>
// import echarts from 'echarts'
export default {
  name: "echartsShow",
  data () {
    return {
      ChartLineGraph: null,
    }
  },
  //  深度监听 父组件刚开始没有值，只有图标的配置项
  //  父组件ajax请求后改变数据的值，传递过来，图标已生成，监听传过来的值的改变
  watch: {
    data: {
      deep: true,
      handler (newvalue, oldvalue) {
        // this.drawLineGraph(this.id, newvalue);
        // console.log(newvalue, '---newvalue');
        // console.log(oldvalue,'---oldvalue');
        if (newvalue) {
          this.drawLineGraph(this.id, newvalue)
        } else {
          this.drawLineGraph(this.id, oldvalue)
        }
      }
    }
  },
  props: ["id", "data"],
  mounted () {
    this.drawLineGraph(this.id, this.data)
    // console.log(this.id, '打印id值')
    // console.log(this.data, '打印data值')
  },
  methods: {
    drawLineGraph (id, data) {
      let _this = this
      let myChart = document.getElementById(id)
      this.ChartLineGraph = this.$echarts.init(myChart)
      this.ChartLineGraph.clear()
      this.ChartLineGraph.setOption(data, true)
      window.addEventListener("resize", function () {
        _this.ChartLineGraph.resize()
      })
    }
  },
  beforeDestroy () {
    if (this.ChartLineGraph) {
      this.ChartLineGraph.clear();
    }
  }
}
</script>

<style scoped>
</style>
