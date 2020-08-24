<template>
  <el-select placeholder="请选择当前机构" :value="value" @input="change($event)">
    <el-input placeholder="输入关键字进行搜索" v-model="filterText" style="padding: 0 20px;"></el-input>
    <el-option :value="orgValue" style="height: auto">
      <!-- 搜索框 -->
      <el-tree class="filter-tree" :data="orgData" :props="defaultProps" :filter-node-method="filterNode" ref="orgTree" @node-click="handleNodeClick"></el-tree>
    </el-option>
  </el-select>
</template>

<script>
export default {
  props: ['value', 'orgData'],
  data () {
    return {
      // 搜索区 机构选择框中过滤搜索内容
      filterText: '',
      // 搜索区 机构选择下拉框的数据
      orgValue: '',
      // 搜索区 机构选择树的数据
      defaultProps: {
        children: 'children',
        label: 'title'
      }
    }
  },
  watch: {
    filterText (val) {
      this.$refs.orgTree.filter(val);
      // console.log(this.filterText,'监听变化111');
    }
  },
  methods: {
    // 搜索区 选择下拉框中的过滤函数
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    change: function (val) {
      this.$emit('input', val)
    },
    // 搜索区 选中机构，触发该函数
    handleNodeClick (e) {
      if (e.deptLevel === '1' || e.deptLevel === '3') {
        this.$emit('input', e.title)
        this.orgValue = e.title
      }
    }
  }}
</script>
