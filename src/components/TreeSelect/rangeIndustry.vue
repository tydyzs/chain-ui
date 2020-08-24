<template>
  <el-select
    multiple
    size="small"
    :placeholder="placeholderSel"
    :disabled="propsVal.disabled"
    class="el-select"
    :value="labelarr2"
    :clearable="clearable"
    @clear="clearHandle"
  >
    <el-input class="selectInput" :placeholder="placeholderInp" v-model="filterText"></el-input>

    <el-option :value="valueTitle" :label="valueTitle" class="options">
      <el-tree
        id="tree-option"
        ref="selectTree"
        :accordion="accordion"
        :data="options"
        :props="defaultProps"
        :node-key="propsVal.value"
        :default-expanded-keys="defaultExpandedKey"
        :filter-node-method="filterNode"
        @node-click="handleNodeClick"
      ></el-tree>
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: 'TreeSelect',
  props: {
    /* 配置项 */
    propsVal: {
      type: Object,
      default: () => {
        return {
          value: 'id', // ID字段名
          label: 'title', // 显示名称
          children: 'children', // 子级字段名
          disabled: false
        }
      }
    },
    identifier: {
      type: Array,
      default: () => {
        return []
      }
    },
    /* 选项列表数据(树形结构的对象数组) */
    options: {
      type: Array,
      default: () => {
        return []
      }
    },
    /* 初始值 */
    value: {
      type: String,
      default: () => {
        return null
      }
    },
    /* 可清空选项 */
    clearable: {
      type: Boolean,
      default: () => {
        return true
      }
    },
    /* 自动收起 */
    accordion: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    placeholderInp: {
      type: String,
      default: () => {
        return '检索关键字'
      }
    },
    placeholderSel: {
      type: String,
      default: () => {
        return ''
      }
    }
  },
  data() {
    return {
      newArr: [],
      filterText: '',
      valueId: this.value, // 初始值
      valueTitle: '',
      defaultExpandedKey: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      labelarr: [],
      idarr: [],
      labelarr2: [],
      idarr2: []
    }
  },
  mounted() {
    console.log(this.options)
    this.initHandle()
  },
  methods: {
    // 初始化值
    initHandle() {
      if (this.valueId) {
        this.valueTitle = this.$refs.selectTree.getNode(this.valueId) // 初始化显示
        this.$refs.selectTree.setCurrentKey(this.valueId) // 设置默认选中
        this.defaultExpandedKey = [this.valueId] // 设置默认展开
      }
      this.initScroll()
    },
    // 初始化滚动条
    initScroll() {
      this.$nextTick(() => {
        let scrollWrap = document.querySelectorAll(
          '.el-scrollbar .el-select-dropdown__wrap'
        )[0]
        let scrollBar = document.querySelectorAll(
          '.el-scrollbar .el-scrollbar__bar'
        )
        scrollWrap.style.cssText =
          'margin: 0px; max-height: none; overflow: hidden;'
        for (var index in scrollBar) {
          if (scrollBar[index].style != null) {
            scrollBar[index].style.width = 0
          }
        }
        // scrollBar.forEach(ele => ele.style.width = 0)
      })
    },
    // 切换选项
    handleNodeClick(node) {
      // 如果设定层级，是否满足设定的层级
      console.log(node.id)
      if (node.dictKey !== '01') {
            var conditionOne =
        this.identifier.length > 0 &&
        Object.assign([], this.identifier).includes(node.deptLevel)
      if (conditionOne || this.identifier.length == '0') {
        this.labelarr.push(node.label)
        this.idarr.push(node.dictKey)
        this.labelarr2 = Array.from(new Set(this.labelarr))
        this.idarr2 = Array.from(new Set(this.idarr))
        this.$emit('getValue', this.idarr2)

        this.$emit('handleChange5Change', this.idarr2)
        this.defaultExpandedKey = []
      }
      }

    },
    // 清除选中
    clearHandle() {
      this.valueTitle = ''
      this.valueId = null
      this.defaultExpandedKey = []
      this.clearSelected()
      this.$emit('getValue', null)
    },
    /* 清空选中样式 */
    clearSelected() {
      let allNode = document.querySelectorAll('#tree-option .el-tree-node')
      for (let node in allNode) {
        if (node.classList != null) {
          node.classList.remove('is-current')
        }
      }
      // allNode.forEach((element)=>element.classList.remove('is-current'))
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    }
  },
  watch: {
    value() {
      this.valueId = this.value
      this.initHandle()
    },
    filterText(val) {
      this.$refs.selectTree.filter(val)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-select {
  width: 100%;
}
.el-scrollbar .el-scrollbar__view .el-select-dropdown__item {
  height: auto;
  max-height: 274px;
  padding: 0;
  overflow: hidden;
  overflow-y: auto;
}
.el-select-dropdown__item.selected {
  font-weight: normal;
}
ul li >>> .el-tree .el-tree-node__content {
  height: auto;
  padding: 0 20px;
}
.el-tree-node__label {
  font-weight: normal;
}
.el-tree >>> .is-current .el-tree-node__label {
  color: #409eff;
  font-weight: 700;
}
.el-tree >>> .is-current .el-tree-node__children .el-tree-node__label {
  color: #606266;
  font-weight: normal;
}
.selectInput {
  padding: 0 5px;
  box-sizing: border-box;
}
</style>
