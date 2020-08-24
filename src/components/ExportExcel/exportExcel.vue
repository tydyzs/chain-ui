<!-- 表格导出组件 -->
<template>
  <div>
    <el-button type="primary" icon="el-icon-download" :headerArr="headerArr" :excelContent="excelContent" :excelTitle="excelTitle"
      @click="export2Excel()">导出</el-button>
  </div>
</template>

<script>
import { export_json_to_excel } from '@/utils/Export2Excel.js'
export default {
  name: 'exportExcel',
  data () {
    return {
    }
  },
  watch: {
    excelTableData: {
      deep: true,
      handler (newValue, oldValue) {
        // console.log('newValue:', newValue, 'oldValue:', oldValue);
        if (newValue) {
          this.excelTableData = newValue
        }
      }
    }
  },
  props: ['headerArr', 'excelContent', 'excelTableData', 'excelTitle'],
  created () { },
  methods: {
    export2Excel () {
      this.$emit('getExcelDatas')
      if (this.excelTableData.length > 0) {
        require.ensure([], () => {
          let _this = this
          const tHeader = this.headerArr // 对应表格输出的中文title
          const filterVal = this.excelContent // 对应表格输出的数据
          const list = this.excelTableData // 表格data
          const data = _this.formatJson(filterVal, list)
          export_json_to_excel(tHeader, data, this.excelTitle) // 对应下载文件的名字
        })
      }
    },
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
  },
}
</script>

<style lang='scss' scoped>
</style>
