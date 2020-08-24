<template>
  <el-select size="small" multiple :placeholder="placeholder" :style="{'width': width}" :disabled="disabled" class="el-select" :value="valueTitle" :clearable="clearable" @clear="clearHandle" @change="selectChange">
    <el-input class="selectInput" placeholder="请输入检索关键字" v-model="filterText">
    </el-input>

    <el-option value="id" :label="props.label" class="options">
      <el-tree id="tree-option" ref="selectTree" check-strictly :accordion="accordion" :data="options" :props="props" show-checkbox :node-key="props.value" :filter-node-method="filterNode" @check-change="handleNodeClick">
      </el-tree>
      <!-- <el-tree :data="options" show-checkbox node-key="id" ref="selectTree" highlight-current :props="props" @check-change="handleNodeClick" :filter-node-method="filterNode"></el-tree> -->
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: 'MultipleTreeSelect',
  props: {
    disabled: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    width: {
      type: String,
      default: () => {
        return '80%'
      }
    },
    /* 配置项 */
    props: {
      type: Object,
      default: () => {
        return {
          value: 'id', // ID字段名
          key: 'id',
          label: 'label', // 显示名称
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
      type: Array,
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
        return '请选择'
      }
    },

  },
  data() {
    return {
      filterText: '',
      valueId: this.value, // 初始值
      valueTitle: [],
      selNodes: [],
      //defaultExpandedKey: [],
       loadComponent : true
    }
  },
  mounted() {
    if(this.loadComponent){
    this.initHandle()
    }
    this.loadComponent = false
  },
  methods: {
    // 初始化值
    initHandle() {
      if (this.valueId && this.valueId.length) {
        this.valueTitle = []
        let nodes = []
        // this.$nextTick(() => {
          this.valueId.forEach(v => {
            if (this.$refs.selectTree.getNode(v)) {
              let cdata = this.$refs.selectTree.getNode(v).data;
              nodes.push(cdata)
              this.valueTitle.push(cdata[this.props.label]) // 初始化显示
              this.expanded(cdata.parentId)
            }
          })
          this.selNodes = nodes
          this.$refs.selectTree.setCheckedNodes(nodes) // 设置默认选中
          //this.$emit('getValue', this.selNodes)
          //this.defaultExpandedKey = this.valueId // 设置默认展开
        // })
      } else {
        this.valueTitle = []
        this.selNodes = []
        this.$refs.selectTree.setCheckedNodes(this.selNodes)
      }

      this.initScroll()

    },
    expanded(parentId){
      // debugger
        let node = this.$refs.selectTree.getNode(parentId);
        if(node){
          this.$refs.selectTree.store.nodesMap[node.data[this.props.value]].expanded = true
          if(node.data.parentId!=null && node.data.parentId != ""){
            this.expanded(node.data.parentId)
          }
        }
    },
    // 初始化滚动条
    initScroll() {
      this.$nextTick(() => {
        let scrollWrap = document.querySelectorAll('.el-scrollbar .el-select-dropdown__wrap')[0]
        let scrollBar = document.querySelectorAll('.el-scrollbar .el-scrollbar__bar')
        scrollWrap.style.cssText = 'margin: 0px; max-height: none; overflow: hidden;'
        for (var index in scrollBar) {
          if (scrollBar[index].style != null) {
            scrollBar[index].style.width = 0
          }
        }
        // scrollBar.forEach(ele => ele.style.width = 0)
      })
    },
    selectChange(e) {
      let checkNodes = this.$refs.selectTree.getCheckedNodes(false, false)
      let valueIds = [];
      //this.valueTitle = [];
      //this.selNodes =[];
      var dataLength = checkNodes.length
      var eleng = e.length
      for (let i = 0; i < dataLength; i++) {
        for (let j = 0; j < eleng; j++) {
          if (e[j] === checkNodes[i][this.props.label]) {
            //this.selNodes.push(checkNodes[i])
            valueIds.push(checkNodes[i][this.props.value])
            //this.valueTitle.push(checkNodes[i][this.props.label])
          }
        }
      }
      this.valueId =valueIds
      this.initHandle()
      //this.$refs.selectTree.setCheckedNodes(this.selNodes) //设置勾选的值
      this.$emit('getValue', this.selNodes)
    },
    // 切换选项
    handleNodeClick(node) {
      let res = this.$refs.selectTree.getCheckedNodes(false, false)
      let arrLabel = []
      let arrValue = []
      let arrNode = []
      this.selNodes = [];
      res.forEach(item => {
        arrLabel.push(item[this.props.label])
        arrValue.push(item[this.props.value])
        arrNode.push(item)
      })
      this.valueId = arrValue
      this.initHandle()
      // this.valueTitle = arrLabel
      // this.selNodes = arrNode
      this.$emit('getValue', this.selNodes)
      //this.defaultExpandedKey = arrValue
    },
    // 清除选中
    clearHandle() {
      this.valueTitle = ''
      this.valueId = []
      //this.defaultExpandedKey = []
      this.clearSelected()
      this.$emit('getValue', [])
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
      return data[this.props.label].indexOf(value) !== -1
    }
  },
  watch: {
    value() {
      if(JSON.stringify(this.value) != JSON.stringify(this.valueId)  ){
        this.$nextTick(() => {
          this.valueId = this.value
          this.initHandle()
        })
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
