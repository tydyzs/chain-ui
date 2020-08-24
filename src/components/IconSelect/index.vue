<template>
    <div class="ui-fas" @click="_popoverShowFun">
        <!-- 弹出框 -->
        <el-popover :disabled="disabled" ref="popover" :placement="myPlacement" popper-class="el-icon-popper" :width="width" v-model="visible" trigger="manual">
            <el-input v-model="name" placeholder="请选择图标" ref="input" v-popover:popover :style="styles" :clearable="clearable" :disabled="disabled" :readonly="readonly" @input="_change" @clear="_initIcon(false)" slot="reference" :size="size">
                <el-button ref="button" slot="append" :icon="prefixIcon" :size="size"></el-button>
            </el-input>
            <el-scrollbar ref="e-scrollbar" tag="div" wrap-class="el-select-dropdown__wrap" view-class="el-select-dropdown__list" class="is-empty">
                <ul class="fas-icon-list" v-if="dataList&&dataList.length > 0">
                    <li v-for="(item, index) in dataList" :key="index" @click="_selectedIcon(item)">
                        <i :class="item" :title="item" />
                    </li>
                </ul>
                <span v-else class="fas-no-data">暂无可选图标</span>
            </el-scrollbar>
        </el-popover>
    </div>
</template>

<script>
import iconList, { iconData } from './iconList'
import { off, on } from '@/utils/dom'

export default {
  name: 'icon-select',
  props: {
    size: {
      type: String,
      default() {
        return 'medium'
      }
    },
    // 是否禁用文本框
    disabled: {
      type: Boolean,
      // false
      default() {
        return false
      }
    },
    readonly: {
      type: Boolean,
      // false
      default() {
        return false
      }
    },
    clearable: {
      type: Boolean,
      // true
      default() {
        return true
      }
    },
    // e-icon-picker 样式
    styles: {
      type: Object,
      default() {
        return {}
      }
    },
    // 弹出框位置
    placement: {
      type: String,
      //  bottom
      default() {
        return 'bottom'
      }
    },
    value: {
      type: String,
      default() {
        return ''
      }
    },
    options: {}
  },
  data() {
    return {
      iconList: [],
      visible: false, // popover v-model
      width: 200,
      prefixIcon: 'el-icon-search',
      name: '',
      icon: {},
      myPlacement: 'bottom'
    }
  },
  methods: {
    _change(val) {
      this.iconList = this.icon.list.filter(function(i) {
        return i.indexOf(val) !== -1
      })
    },
    _initIcon(type) {
      this.prefixIcon = this.value && type && true === type ? this.value : 'el-icon-search'
      this.name = type === true ? this.value : ''
      this.icon = Object.assign({}, iconList) //复制一个全局对象，避免全局对象污染
      this.icon.list = [] //重新给图标集合复制为空
      this.icon.addIcon(iconData)
      this.iconList = this.icon.list
      if (this.placement && (this.placement === 'bottom' || this.placement === 'top')) {
        this.myPlacement = this.placement
      }
      if (type === false) {
        this._emitFun('')
      }
    },

    addIcon(item = []) {
      //组件内增加图标
      //组件内添加图标
      if (item !== undefined && item && item.length > 0) {
        this.icon.addIcon(item)
        this.iconList = this.icon.list
      }
    },
    removeIcon(item = []) {
      //组件内删除图标
      //组件内删除图标
      if (item !== undefined && item && item.length > 0) {
        this.icon.removeIcon(item)
        this.iconList = this.icon.list
      }
    },
    _selectedIcon(item) {
      this.visible = false
      this.name = item
      this.prefixIcon = this.name
      this._emitFun(this.prefixIcon)
      this.$refs.input.focus()
      this.$refs.input.blur()
    },
    // 更新宽度
    _updateW() {
      this.$nextTick(() => {
        this.width = this.$refs.input.$el.getBoundingClientRect().width - 26
        this.$refs['e-scrollbar'].wrap.scrollTop = this.$refs.input.$el.getBoundingClientRect().height
      })
    },
    // 显示弹出框的时候容错，查看是否和el宽度一致
    _popoverShowFun() {
      if (this.readonly !== true && this.disabled !== true) {
        this.visible = true
      }
      this._updateW()
    },
    /*
 * 获取事件冒泡路径，兼容ie11,edge,chrome,firefox,safari
 * @param evt
 * @returns {*}
 */
    eventPath(evt) {
      const path = (evt.composedPath && evt.composedPath()) || evt.path,
        target = evt.target

      if (path != null) {
        return path.indexOf(window) < 0 ? path.concat(window) : path
      }

      if (target === window) {
        return [window]
      }

      function getParents(node, memo) {
        memo = memo || []
        const parentNode = node.parentNode

        if (!parentNode) {
          return memo
        } else {
          return getParents(parentNode, memo.concat(parentNode))
        }
      }

      return [target].concat(getParents(target), window)
    },
     // 点击控件外，判断是否隐藏弹出框
    _popoverHideFun(e) {
      //alert(e.srcElement._prevClass)
      let isInter = false
      if (e.path) {
          //兼容谷歌
        isInter = e.path.some(list => {
          return list.className && list.className.indexOf('fas-icon-list') !== -1
        })
      } else {
          //兼容IE
        isInter = this.eventPath(e).forEach(list => {
          return list.className && list.className.indexOf('fas-icon-list') !== -1
        })
      }
      if (!isInter) {
        this.visible = false
      }
    },
    // 判断类型，抛出当前选中id
    _emitFun(val) {
      this.$emit('input', val)
      this._updatePopoverLocationFun()
    },
    _close() {
      this.visible = false
    },
    // 更新popover位置
    _updatePopoverLocationFun() {
      // dom高度还没有更新，做一个延迟
      setTimeout(() => {
        this.$refs.popover.updatePopper()
      }, 50)
    }
  },
  computed: {
    dataList: function() {
      //去重
      let arr1 = [] // 新建一个数组来存放arr中的值
      for (let i = 0, len = this.iconList.length; i < len; i++) {
        if (arr1.indexOf(this.iconList[i]) === -1) {
          arr1.push(this.iconList[i])
        }
      }
      return arr1
    }
  },
  mounted() {
    this._updateW()
    this.$nextTick(() => {
      on(document, 'mouseup', this._popoverHideFun)
    })
  },
  beforeDestroy() {
    off(document, 'mouseup', this._popoverHideFun)
  },
  created() {
    this._initIcon(true)
  },
  watch: {
    value: function(val) {
      setTimeout(() => {
        this.name = val
        this.prefixIcon = this.name ? this.name : 'el-icon-search'
      }, 50)
    },
    options: {
      handler(newV, oldV) {
        let self = this
        setTimeout(() => {
          self._initIcon(true)
        }, 50)
      },
      deep: true
    }
  }
}
</script>

<style lang="css" scoped>
.fas-icon-list {
  list-style-type: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.ui-fas .el-input__inner {
  cursor: pointer;
}

.fas-icon-list li {
  width: 30px;
  height: 30px;
  margin: 5px;
}

.fas-icon-list li i {
  font-size: 20px;
  cursor: pointer;
}

.el-icon-popper {
  max-height: 400px;
  overflow: auto;
  overflow-x: hidden;
  overflow-y: hidden;
}

.el-icon-popper[x-placement^='bottom'] {
  margin-top: 5px;
}

.fas-no-data {
  display: block;
}
</style>
