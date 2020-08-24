<template>
  <el-select
    size="small"
    :disabled="props.disabled"
    class="el-select"
    :value="valueTitle"
    @input="change($event)"
    :clearable="clearable"
    @clear="clearHandle"
  >
    <el-input class="selectInput" :placeholder="placeholder" v-model="filterText"></el-input>

    <el-option :value="valueTitle" :label="valueTitle" class="options">
      <el-tree
        id="tree-option"
        ref="selectTree"
        :accordion="accordion"
        :data="options"
        :props="props"
        :node-key="props.value"
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
    props: {
      type: Object,
      default: () => {
        return {
          identifier: [],
          value: 'id', // ID字段名
          label: 'title', // 显示名称
          children: 'children', // 子级字段名
          disabled: false
        }
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
    placeholder: {
      type: String,
      default: () => {
        return '检索关键字'
      }
    }
  },
  data() {
    return {
      filterText: '',
      valueId: this.value, // 初始值
      valueTitle: '',
      defaultExpandedKey: []
    }
  },
  mounted() {
    this.initHandle()
  },
  methods: {
    change(e) {
        this.valueId = this.value
      this.initHandle()
    },
    // 初始化值
    initHandle() {
      if (this.valueId) {
        this.valueTitle = this.$refs.selectTree.getNode(this.valueId).data[
          this.props.label
        ] // 初始化显示
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
      var conditionOne = false
      if (this.props.hasOwnProperty('identifier')) {
        // 判断是否设定选择层级，如果设定就判断选中层级是否符合
        conditionOne =
          this.props.identifier.length > 0 &&
          Object.assign([], this.props.identifier).includes(node.deptLevel)
      }
      //满足设定层级或是未设置层级
      if (conditionOne || this.props.identifier.length == '0') {
        this.valueTitle = node[this.props.label]
        this.valueId = node[this.props.value]
        this.$emit('input', this.valueId)
        this.defaultExpandedKey = []
      }
    },
    // 清除选中
    clearHandle() {
      console.log('1222')
      this.valueTitle = ''
      this.valueId = null
      this.defaultExpandedKey = []
      this.clearSelected()
      this.$emit('input', null)
    },
    /* 清空选中样式 */
    clearSelected() {
      let allNode = document.querySelectorAll('#tree-option .el-tree-node')
      // for (let node in allNode) {
      //   if (node.classList != null) {
      //     node.classList.remove('is-current')
      //   }
      // }
      allNode.forEach((element)=>element.classList.remove('is-current'))
    },
    filterNode(value, data) {
      if (!value) return true
      return data.title.indexOf(value) !== -1
    }
  },
  watch: {
    value() {
      if(this.value){
 this.valueId = this.value
      this.initHandle()
      }

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
  color: #029f4a;
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
