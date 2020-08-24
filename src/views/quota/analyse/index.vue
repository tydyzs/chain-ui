<!-- 限额分析页面 -->
<template>
  <div class="analysePage">
    <!-- 左侧 选择机构 和 分析表类型 部分 -->
    <div class="leftPage">
      <!-- 选择机构卡片视图区 -->
      <el-card class="organization">
        <!-- 卡片头部标题 -->
        <div slot="header" class="clearfix">
          <span>请选择机构</span>
        </div>
        <el-select v-model="currOrg" placeholder="请选择当前机构" size="small">
          <el-option :value="orgValue" style="height: auto">
            <!-- 搜索框 -->
            <el-input placeholder="输入关键字进行搜索" v-model="filterText"></el-input>
            <el-tree class="filter-tree" :data="orgData" :props="defaultProps" :filter-node-method="filterNode" ref="orgTree"
              @node-click="handleNodeClick"></el-tree>
          </el-option>
        </el-select>

        <!-- 带有过滤功能的机构选择树 -->
        <!-- <div class="treeContainer" v-show="showTree">
          <el-input placeholder="输入关键字进行过滤" v-model="filterText" size="small"></el-input>
          <el-tree :data="orgData" :props="defaultProps" :filter-node-method="filterNode" ref="tree" @node-click="treeClick"></el-tree>
        </div> -->
      </el-card>
      <!-- 分析表类型卡片视图区 -->
      <!-- <el-scrollbar style="height: 487px;"> -->
      <el-card class="chartCard" style="height: 485px;">
        <!-- 卡片头部标题 -->
        <div slot="header" class="clearfix">
          <span>分析表类型</span>
        </div>
        <ul class="chartList" style="height: 448px">
          <li v-for="(item,index) in chartList" :key="index" :class="{active : ( isActive == item.value ? true : false )}"
            :title="item.name" @click="isActive = item.value;currentComp = item.comp">{{item.name}}</li>
        </ul>
      </el-card>
      <!-- </el-scrollbar> -->
    </div>
    <!-- 右侧 主要内容 部分 -->
    <div class="rightPage">
      <el-card style="height: 600px;">
        <test1 :is="currentComp" :selectionOrgId="selectionOrgId"></test1>
      </el-card>
    </div>
  </div>
</template>

<script>
import test1 from "./children/test1"
import test2 from "./children/test2"
import test3 from "./children/test3"
import test4 from "./children/test4"
import test5 from "./children/test5"
import test6 from "./children/test6"
import test7 from "./children/test7"
import test8 from "./children/test8"
import test9 from "./children/test9"
import test10 from "./children/test10"
import test11 from "./children/test11"
import test12 from "./children/test12"
import test13 from "./children/test13"
import test14 from "./children/test14"
import test15 from "./children/test15"
import { getUserInfo } from '@/api/user'
import { getDeptTreeManage } from '@/api/system/dept'
export default {
  data () {
    return {
      //选中机构id
      selectionOrgId: '01000',
      // 机构选择 input框中的数据
      currOrg: '',
      // 机构选择 下拉框选中的数据
      orgValue: '',
      // 机构选择树的数据
      orgData: [],
      // 机构选择树中过滤输入框中的内容
      filterText: '',
      // 机构选择树中的数据源
      orgData: [],
      defaultProps: {
        // 指定子树为节点对象的某个属性值
        children: 'children',
        // 指定节点标签为节点对象的某个属性值
        label: 'title'
      },
      // ======分析表类型部分的数据=======
      // 当前选中的组件
      currentComp: 'test1',
      // 当前选中的li标签
      isActive: '1',
      chartList: [
        {
          // li标签的内容
          name: '客户授信集中度简表',
          // 当前li标签是否选中的标识
          value: '1',
          // 点击当前li标签，要显示的组件
          comp: 'test1'
        },
        {
          name: '最大十家客户贷款集中度及单一客户明细表',
          value: '2',
          comp: 'test2'
        },
        {
          name: '最大十家客户授信集中度及单一客户明细表',
          value: '3',
          comp: 'test3'
        },
        {
          name: '最大十家集团客户授信集中度及集团客户明细表',
          value: '4',
          comp: 'test4'
        },
        {
          name: '关联客户授信集中度简表',
          value: '5',
          comp: 'test5'
        },
       /* {
          name: '关联客户授信集中度明细表',
          value: '6',
          comp: 'test6'
        },*/
        {
          name: '行业授信集中度简表',
          value: '7',
          comp: 'test7'
        },
       /* {
          name: '行业授信集中度明细表',
          value: '8',
          comp: 'test8'
        },*/
        {
          name: '风险暴露情况简表',
          value: '9',
          comp: 'test9'
        },
        {
          name: '同业客户风险暴露明细表',
          value: '10',
          comp: 'test10'
        },
        {
          name: '匿名客户风险暴露金额变动图',
          value: '11',
          comp: 'test11'
        },
        {
          name: '风险暴露超过1亿元（含）的单一客户列表',
          value: '12',
          comp: 'test12'
        },
        {
          name: '风险暴露超过一级资本净额2.5%的集团客户列表',
          value: '13',
          comp: 'test13'
        },
        {
          name: '全客户（单一客户）明细表',
          value: '14',
          comp: 'test14'
        },
        {
          name: '全客户（集团客户）明细表',
          value: '15',
          comp: 'test15'
        }
      ]
    };
  },
  // 注册组件
  components: {
    test1,
    test2,
    test3,
    test4,
    test5,
    test6,
    test7,
    test8,
    test9,
    test10,
    test11,
    test12,
    test13,
    test14,
    test15
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val);
    }
  },
  created () {
    this.getunserInfo()
  },
  methods: {
    // 获取当前登录人的信息
    getunserInfo () {
      getUserInfo().then(res => {
        console.log(res, '打印当前登录人信息');
        if (res.status != 200) {
          return this.$message.error('获取当前登录人信息失败，请重试')
        }
        this.userInfo = res.data.data

        getDeptTreeManage(this.userInfo.deptId).then(res => {
          // console.log(res, '测试登录机构下的机构树数据');
          if (res.status != 200) {
            return this.$message.error('获取当前登录人信息失败，请重试')
          }
          this.orgData = res.data.data
          // 如果当前登录机构为省联社，默认选择省联社
          if (this.orgData[0].deptLevel == 1) {
            // 如果当前登录机构为省联社，默认选择省联社
            // console.log(this.orgData[0].deptLevel,'打印机构级别');
            this.currOrg = this.orgData[0].title
          } else if (this.orgData[0].deptLevel == 2) {
            // 如果当前登录机构为市联社下第一个成员行，机构树为该市级下所有成员行
            // console.log(this.orgData[0].deptLevel,'打印机构级别');
            this.currOrg = this.orgData[0].children[0].title
          } else if (this.orgData[0].deptLevel == 3) {
            // 如果当前登录机构为成员行，机构树只显示成员行
            // console.log(this.orgData[0].deptLevel,'打印机构级别');
            this.currOrg = this.orgData[0].title
          }
          this.selectionOrgId=this.orgData[0].id;
        })
      })
    },
    // 对树节点进行筛选时执行的方法，返回 true 表示这个节点可以显示，返回 false 则表示这个节点会被隐藏
    filterNode (value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点被点击时的回调,共三个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、节点对应的 Node、节点组件本身
    handleNodeClick (data) {
      // console.log(data, '限额分析页面，打印data的值');
      if (data.deptLevel == 1 || data.deptLevel == 3) {
        this.currOrg = data.title;
        this.orgValue = data.title;
        this.selectionOrgId=data.id;
      }
    },
    // 选择机构input框获得焦点时，触发该函数
    choose () {
      // console.log('123444');
      this.showTree = !this.showTree
      this.filterText = ''
    }
  }
}
</script>

<style lang="scss" scoped>
// 整体页面左右自适应布局
.analysePage {
  display: flex;
  justify-content: flex-start;
  padding: 0 10px;
  // 卡片抬头标题样式
  /deep/ .el-card__header {
    height: 10px;
    // background-color: #39ce34;
    // background-color: #806353;
    // background-color: #2f4554;
    // background-color: #3399cc;
    background-color: #029f4a;
    color: #fff;
    .clearfix {
      transform: translateY(-50%);
      text-align: center;
      font-size: 14px;
    }
  }
  // 左侧 选择机构和分析表类型 样式
  .leftPage {
    width: 20%;
    margin-right: 2px;
    height: 600px;
    // border: 1px solid red;
    .el-card {
      width: 100%;
      margin-bottom: 4px;
    }
    // 左侧 选择机构卡片视图区 样式
    .organization /deep/ {
      // 选择树 样式
      .treeContainer {
        margin-top: 5px;
      }
    }
    // 左侧 分析表类型卡片视图 样式
    .chartCard /deep/ {
      overflow-x: auto;
      // overflow-y: auto;
      .el-card__body {
        padding: 0;
        .chartList {
          // height: calc(100% - 37px);
          overflow-y: auto;
          padding-left: 0;
          margin-top: 0;
          width: 100%;
          li {
            list-style: none;
            margin-left: 20px;
            font-size: 14px;
            line-height: 2.2;
            cursor: pointer;
            white-space: nowrap;
          }
          li.active {
            color: #029f4a;
          }
        }
      }
    }
  }
  // 右侧 主要内容 样式
  .rightPage /deep/ {
    width: 80%;
    .el-card__body {
      // padding: 10px 20px 20px 20px;
      padding: 0 20px 20px 20px;
    }
  }
}
</style>
