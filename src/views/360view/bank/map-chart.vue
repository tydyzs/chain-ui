
<template>
  <div class="echart" style="align:center">
    <div ref="oroptionmapjsonr" :style="{width:'95%',height:'500px'}"></div>
  </div>
</template>
<script>


import jxJson from '@/const/map/jiangxi.json'
import echarts from 'echarts'
var oroptionmapjsonr_charts = null;
export default {
  name: 'mapChart',
  props: { data: Array },
  data () {
    return {
      oroptionmapjsonr: {
        backgroundColor: '#FFF',
        layoutCenter: ['50%', '50%'],
        layoutSize: 380,
        title: {
          text: '江西支行分布图 (单位：万元)',
          subtext: '',
          sublink: '',
          x: 'center',
          textStyle: {
            color: '#fff'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: function (params) {
            return params.name + ' : ' + params.value
          }
        },
        geo: {
          map: 'JX',
          label: {
            emphasis: {
              show: false,
              textStyle: { color: 'red', fontSize: 12 }
            },
            normal: {
              show: true,
              textStyle: { color: '#fbfdfe', fontSize: 12 }
            }
          },
          itemStyle: {
            normal: {
              areaColor: '#061d33',
              borderColor: '#0dffff'
            },
            emphasis: {
              areaColor: '#2a333d'
            }
          },
        },
        series: [
          {
            name: 'jiangxi',
            type: 'lines',
            coordinateSystem: 'geo',
            data: this.dataLines(this.data),
            symbolSize: 5, //标注大小
            symbol: 'circle', //标注类型
            label: {
              normal: {
                show: true,
                textStyle: {
                  fontFamily: '微软雅黑',
                  color: '#fff',
                  fontSize: 12,
                  backgroundColor: '#061d33',
                  borderWidth: 1,
                  borderColor: '#0dffff',
                  align: 'left',
                  padding: 10
                },
                formatter: function (params) {
                  if (params.value) {
                    return '{title|' + params.name + '}'
                      + '\n' + '授信额度：' + '{b|' + (params.value.limitCredit == null ? 0 : params.value.limitCredit) + '}'
                      + '\n' + '敞口额度：' + '{b|' + (params.value.approveExpAmount == null ? 0 : params.value.approveExpAmount) + '}'
                      + '\n' + '授信敞口额度：' + '{b|' + (params.value.creditExpBalance == null ? 0 : params.value.creditExpBalance) + '}'
                      + '\n' + '贷款敞口额度：' + '{b|' + (params.value.loanExpBalance == null ? 0 : params.value.loanExpBalance) + '}'
                  } else {
                    return '{title|' + params.name + '}'
                  }
                },
                rich: {
                  title: {
                    fontFamily: '微软雅黑',
                    // color: 'Yellow',
                    color: '#fed81b',
                    fontSize: 16,
                    fontWeight: 'bold',
                    padding: 5
                  },
                  item: {
                    fontFamily: '微软雅黑',
                    color: '#fff',
                    fontSize: 16,
                    padding: 5
                  }
                }
              },
              emphasis: {
                show: false
              }
            },
            lineStyle: {
              type: 'dotted',
              shadowBlur: 3
            },
            itemStyle: {
              emphasis: {
                borderColor: '#fff',
                borderWidth: 1
              }
            }
          }
        ]
      }
    }
  },
  mounted () {
    this.mapInit()
  },
  methods: {
    // 图表
    mapInit () {
      echarts.registerMap('JX', jxJson)
      oroptionmapjsonr_charts = echarts.init(this.$refs.oroptionmapjsonr)
      oroptionmapjsonr_charts.setOption(this.oroptionmapjsonr)
      //this.refresh()
    },
    refresh (data) {
      var option = oroptionmapjsonr_charts.getOption();
      option.series[0].data = this.dataLines(this.refreshData(data));
      oroptionmapjsonr_charts.setOption(option);
    },
    dataLines (mdata) {
      var res = [];
      for (var i in mdata) {
        var node = mdata[i]
        res.push({
          name: node.name,
          value: node.value,
          coords: [node.geoCoordMap, node.linesEndCoords]
        })
      }
      return res
    },
    refreshData (data) {
      let convert = {};
      for (var i in data) {
        let item = data[i]
        convert[item.areaName] = item
      }
      return [
        {
          name: '抚州市',
          geoCoordMap: [116.43, 27.31],
          linesEndCoords: [117.43, 25.91],
          value: convert["抚州市"]
        },
        {
          name: '赣州市',
          geoCoordMap: [115.28, 25.64],
          linesEndCoords: [115.80, 24.90],
          value: convert["赣州市"]
        },
        {
          name: '吉安市',
          geoCoordMap: [114.93, 26.78],
          linesEndCoords: [111.53, 24.28],
          value: convert["吉安市"]
        },
        {
          name: '景德镇市',
          geoCoordMap: [117.3, 29.15],
          linesEndCoords: [118.5, 29.91],
          value: convert["景德镇市"]
        },
        {
          name: '九江市',
          geoCoordMap: [115.43, 29.23],
          linesEndCoords: [111.43, 29.5],
          value: convert["九江市"]
        },
        {
          name: '南昌市',
          geoCoordMap: [116.0, 28.51],
          linesEndCoords: [119.5, 28.71],
          value: convert["南昌市"]
        },
        {
          name: '萍乡市',
          geoCoordMap: [113.95, 27.38],
          linesEndCoords: [110.75, 25.8],
          value: convert["萍乡市"]
        },
        {
          name: '上饶市',
          geoCoordMap: [117.4, 28.6],
          linesEndCoords: [119.25, 27.51],
          value: convert["上饶市"]
        },
        {
          name: '新余市',
          geoCoordMap: [114.95, 27.86],
          linesEndCoords: [110.5, 27.36],
          value: convert["新余市"]
        },
        {
          name: '宜春市',
          geoCoordMap: [115.02, 28.25],
          linesEndCoords: [108.62, 28.86],
          value: convert["宜春市"]
        },
        {
          name: '鹰潭市',
          geoCoordMap: [117.15, 28.09],
          linesEndCoords: [118.15, 27.01],
          value: convert["鹰潭市"]
        }
      ];

    }
  }
}
</script>
