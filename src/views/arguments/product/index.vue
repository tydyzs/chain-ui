<!-- 参数管理-- 额度产品页面 -->
<template>
  <div style="height:100%; width:100%">
    <el-container style="height: 82vh; border: 1px solid #eee" class="container">
      <el-container style="width:500px;" class="left">
        <el-header style="text-align: left; font-size: 12px;height:30px ">
          <h3 style="margin:0px">额度品种树</h3>
        </el-header>
        <br>
        <el-main style="background-color: #fff; border:0px solid #dcdfe6;">
          <el-tree :props="customProps" :data="treeData" ref="tree" @node-click="getMessage" highlight-current></el-tree>
        </el-main>
        <div class="dialogCon">
          <el-dialog title="基本信息" :visible.sync="dialogFormVisible" @closed="resetForm">
            <el-form :model="form" ref="form" :rules="formRules">
              <el-form-item label="额度产品编号：" :label-width="formLabelWidth">
                <el-input v-model="form.crdProductNum" autocomplete="off" :disabled="true" />
              </el-form-item>
              <el-form-item label="额度产品级别：" :label-width="formLabelWidth">
                <el-input v-model="form.crdLevel" autocomplete="off" :disabled="true" />
              </el-form-item>
              <el-form-item label="额度产品名称：" prop="crdProductName" :label-width="formLabelWidth">
                <el-input v-model="form.crdProductName" placeholder="请输入 额度产品名称" />
              </el-form-item>
              <el-form-item label="额度品种状态：" prop="crdSysStatus" :label-width="formLabelWidth">
                <el-select v-model="form.crdSysStatus" placeholder="--请选择--">
                  <el-option v-for="item in crdSysStatusSelections" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
                </el-select>
              </el-form-item>
              <el-form-item label="额度品种类型：" prop="crdProductType" :label-width="formLabelWidth">
                <el-select v-model="form.crdProductType" placeholder="--请选择--">
                  <el-option v-for="item in crdProductTypeSelections" :key="item.dictKey" :label="item.dictValue"
                    :value="item.dictKey"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="是否低风险额度：" prop="isLowRisk" :label-width="formLabelWidth">
                <el-select v-model="form.isLowRisk" placeholder="--请选择--">
                  <el-option v-for="item in isLowRiskSelections" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="额度品种描述：" :label-width="formLabelWidth">
                <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="form.crdDescr" />
              </el-form-item>
              <!-- <el-form-item label="创建时间：" :label-width="formLabelWidth">
                  <el-input v-model="form.create" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="修改时间：" :label-width="formLabelWidth">
                  <el-input v-model="form.fix" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="客户经理：" :label-width="formLabelWidth">
                  <el-input v-model="form.manager" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="创建机构：" :label-width="formLabelWidth">
                  <el-input v-model="form.organ" autocomplete="off"></el-input>
                </el-form-item>-->
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button icon="el-icon-close" size="small" @click="resetForm">取 消</el-button>
              <el-button icon="el-icon-check" size="small" type="primary" @click="addForm">确 定</el-button>
            </div>
          </el-dialog>
          <div class="btns" style="margin-bottom: 2vh;">
            <el-tooltip class="item" effect="dark" content="新增下级额度产品。注意：只有一级、二级额度产品可以新增下级额度产品！" placement="top">
              <el-button v-if="permission.product_add" icon="el-icon-plus" type="primary" style="margin:0 10px;" @click="checkLevel"
                size="small">新增</el-button>
            </el-tooltip>
            <el-button v-if="permission.product_delete" icon="el-icon-delete" type="danger" style="margin:0 10px;"
              @click="removeCheck" size="small">删除</el-button>
          </div>
        </div>
      </el-container>

      <el-container class="right">
        <el-header style="font-size: 12px;height: 30px; width:100%">
          <h3 style="margin:0px">基本信息</h3>
        </el-header>
        <el-main style="height: 0px">
          <div style="margin: 15px;"></div>
          <el-form :label-position="labelPosition" label-width="140px" :model="formLabelAlign" ref="formLabelAlign"
            :rules="formLabelAlignRules" label-padding="0px" size="mini" style="margin: 10px;">
            <el-form-item label="额度产品编号：">
              <el-input v-model="formLabelAlign.crdProductNum" :disabled="true" />
            </el-form-item>
            <el-form-item label="额度产品名称：" prop="crdProductName">
              <el-input v-model="formLabelAlign.crdProductName" />
            </el-form-item>
            <el-form-item label="额度产品级别：">
              <el-input v-model="formLabelAlign.crdLevel" autocomplete="off" :disabled="true" />
            </el-form-item>
            <el-form-item label="额度品种状态：" prop="crdSysStatus">
              <el-select v-model="formLabelAlign.crdSysStatus" placeholder="--请选择--" style="width:100%">
                <el-option v-for="item in crdSysStatusSelections" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
              </el-select>
            </el-form-item>
            <el-form-item label="额度品种类型：" prop="crdProductType">
              <el-select v-model="formLabelAlign.crdProductType" placeholder="--请选择--" style="width:100%">
                <el-option v-for="item in crdProductTypeSelections" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
              </el-select>
            </el-form-item>
            <el-form-item label="是否低风险额度：" prop="isLowRisk">
              <el-select v-model="formLabelAlign.isLowRisk" placeholder="--请选择--" style="width:100%">
                <el-option v-for="item in isLowRiskSelections" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
              </el-select>
            </el-form-item>
            <el-form-item label="额度品种描述：">
              <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="formLabelAlign.crdDescr" />
            </el-form-item>
            <!-- <el-form-item label="创建时间：">
              <el-input v-model="formLabelAlign.createTime" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="修改时间：">
              <el-input v-model="formLabelAlign.updateTime" :disabled="true"></el-input>
             </el-form-item>
            <el-form-item label="客户经理：">
              <el-input v-model="formLabelAlign.createUser" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="创建机构：">
              <el-input v-model="formLabelAlign.createOrg" :disabled="true"></el-input>
            </el-form-item> -->
            <el-form-item>
              <el-button v-if="permission.product_edit" icon="el-icon-check" type="primary" @click="updataForm">保存</el-button>
            </el-form-item>
          </el-form>
        </el-main>

        <el-header style="text-align: left; font-size: 12px; width:100%;height:30px">
          <h3 style="margin:0px">关联业务品种</h3>
        </el-header>
        <!-- <el-main> -->
        <div style="border-left:1px solid #dcdfe6">
          <div>
            <el-tooltip class="item" effect="dark" content="只有三级额度产品才能关联业务品种！" placement="top">
              <el-button v-if="permission.product_relevance" icon="el-icon-setting" type="primary" @click="relevanceCheck"
                size="small">关联</el-button>
            </el-tooltip>
            <el-button v-if="permission.product_delete" icon="el-icon-delete" type="danger" size="small" @click="removeRelevance">删除</el-button>
            <el-dialog title="基本信息" :visible.sync="dialogFormVisible2" :append-to-body="true" @closed="resetForm2"
              width="70%">
              <el-form :model="form2" ref="form2" size="small">
                <el-form-item label="业务品种编号：" prop="productNum" :label-width="formLabelWidth">
                  <!-- <el-select v-model="form2.productNum" placeholder="--请选择--" @change="getProductMessage">
                    <el-option v-for="item in options" :key="item.productNum" :label="item.productNum" :value="item.productNum"></el-option>
                  </el-select> -->
                  <el-input v-model="form2.productNum" clearable :disabled="true">
                    <el-button slot="append" icon="el-icon-search" @click="chooseProduct" :disabled="false"></el-button>
                  </el-input>
                </el-form-item>
                <el-form-item label="业务品种名称：" :label-width="formLabelWidth">
                  <el-input v-model="form2.productName" autocomplete="off" :disabled="true"></el-input>
                </el-form-item>
                <!-- <el-form-item label="业务品种状态：" :label-width="formLabelWidth">
                    <el-select v-model="form2.productStatusCd" placeholder="--请选择--">
                      <el-option label="启用" value="1"></el-option>
                      <el-option label="初始" value="2"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="产品额度占用方式：" :label-width="formLabelWidth">
                    <el-select v-model="form2.limitUsedType" placeholder="--请选择--">
                      <el-option label="合同占用" value="1"></el-option>
                      <el-option label="放款占用" value="2"></el-option>
                    </el-select>
                  </el-form-item>-->
                <el-form-item label="担保方式：" :label-width="formLabelWidth">
                  <el-select v-model="form2.mainGuaranteeType" placeholder="--请选择--">
                    <el-option v-for="item in mainGuaranteeTypeSelections" :key="item.dictKey" :label="item.dictValue"
                      :value="item.dictKey"></el-option>
                  </el-select>
                </el-form-item>
                <!-- <el-form-item label="客户类型：" :label-width="formLabelWidth">
                  <el-select v-model="form2.custType" placeholder="--请选择--" :disabled="true">
                    <el-option v-for="item in custTypeSelections" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey"></el-option>
                  </el-select>
                </el-form-item> -->
                <el-form-item label="业务种类：" :label-width="formLabelWidth">
                  <el-cascader placeholder="--请选择--" size="small" ref="productTypeTree" v-model="form2.productType"
                    :options="productTypeSelections" :props="defaultProps" @change="getProductType" clearable></el-cascader>
                </el-form-item>
                <el-form-item label="项目类型：" :label-width="formLabelWidth">
                  <el-select v-model="form2.projectType" multiple placeholder="--请选择--">
                    <el-option v-for="item in projectTypeSelections" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey"></el-option>
                  </el-select>
                </el-form-item>
                <!-- <el-form-item label="是否低风险：" :label-width="formLabelWidth">
                  <el-select v-model="form2.isLowRisk" placeholder="--请选择--">
                    <el-option v-for="item in isLowRiskSelections" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey"></el-option>
                  </el-select>
                </el-form-item> -->
                <!-- <el-form-item label="额度类型：" :label-width="formLabelWidth">
                  <el-select v-model="form2.crdProductType" placeholder="--请选择--" :disabled="true">
                    <el-option v-for="item in crdProductTypeSelections" :key="item.dictKey" :label="item.dictValue"
                      :value="item.dictKey"></el-option>
                  </el-select>
                </el-form-item> -->
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button icon="el-icon-close" size="small" @click="dialogFormVisible2 = false">取 消</el-button>
                <el-button icon="el-icon-check" size="small" type="primary" @click="addProductForm">确 定</el-button>
              </div>
            </el-dialog>
          </div>
        </div>
        <el-table ref="multipleTable" :data="tableData" @selection-change="handleSelectionChange" height="200" style="width:100%;border:1px solid #dcdfe6;">
          <el-table-column prop="_select" min-width="80" align="center" type="selection"></el-table-column>
          <el-table-column prop="productNum" label="业务品种编号" min-width="80" align="center"></el-table-column>
          <el-table-column prop="productName" label="业务品种名称" min-width="100" align="center"></el-table-column>
          <el-table-column prop="productTypeName" label="业务种类" min-width="80" align="center"></el-table-column>
          <!-- <el-table-column prop="custType" label="客户类型" min-width="80" align="center" :formatter="custTypeFormatter"></el-table-column> -->
          <el-table-column prop="mainGuaranteeTypeName" label="担保方式" min-width="80" align="center"></el-table-column>
          <el-table-column prop="projectTypeName" label="项目类型" min-width="80" align="center"></el-table-column>
          <!-- <el-table-column prop="isLowRisk" label="是否低风险" min-width="80" align="center" :formatter="isLowRiskFormatter"></el-table-column>
          <el-table-column prop="crdProductType" label="额度类型" min-width="80" align="center" :formatter="crdProductTypeFormatter"></el-table-column> -->
        </el-table>
        <div style="border-left:1px solid #dcdfe6">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageInfo.pagenum"
            :page-sizes="[10,20,30,40]" :page-size="pageInfo.pagesize" layout="total, sizes, prev, pager, next, jumper"
            :total="total"></el-pagination>
        </div>
        <!-- </el-main> -->
      </el-container>
    </el-container>

    <!-- 业务品种选择dialog框 -->
    <el-dialog class="productDialog" title="请选择业务品种" :visible.sync="productDialogVisible" width="55%" height="400"
      @closed="closeDialogProduct" :append-to-body="true">
      <!-- 查询条件 -->
      <div class="search">
        <el-form :model="productForm" ref="productForm" label-width="100px">
          <!-- <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6"> -->
          <el-form-item label="业务品种编号" prop="productNum">
            <el-input v-model="productForm.productNum" size="small"></el-input>
          </el-form-item>
          <el-form-item label="业务品种名称" prop="productName">
            <el-input v-model="productForm.productName" size="small"></el-input>
          </el-form-item>
          <!-- </el-col> -->
          <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
            <el-form-item class="btns">
              <el-button type="primary" @click="querProductMsg" size="small">查询</el-button>
              <el-button @click="clearProductMsg('productForm')" size="small">重置</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </div>
      <!-- 详细表格信息 -->
      <div class="table">
        <template>
          <el-table :data="productMsg" style="width: 100%" height="400">
            <el-table-column prop="productNum" label="业务品种编号"></el-table-column>
            <el-table-column prop="productName" label="业务品种名称"></el-table-column>
            <el-table-column prop="productStatusCdName" label="业务品种状态"></el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
              <template slot-scope="scope">
                <el-button @click="makeProductSure(scope.row)" type="text" size="small">选择</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </div>
      <!-- 分页功能区 -->
      <el-pagination class="pageination" @size-change="productSizeChange" @current-change="productCurrentChange"
        :current-page="productPageInfo.pageNum" :page-sizes="[10]" :page-size="productPageInfo.pageSize" layout="total, sizes, prev, pager, next, jumper"
        :total="productTotal" style="float:right"></el-pagination>
    </el-dialog>
  </div>
</template>

<script>
import {
  saveList,
  add,
  getCrdId,
  getTreeData,
  removeTree,
  // getProductData,
  saveRelevance,
  getList,
  removeRelevanceData,
  // getBusinessNum,
  getcrdProductType,
  getProductList
} from '@/api/arguments/product'
import { getDictionary, dictTreeByCode } from '@/api/system/dict'
import { getStore } from '@/utils/store'
export default {
  data() {
    return {
      permission: {},
      crdSysStatusSelections: [], //额度品种状态 CD000178
      mainGuaranteeTypeSelections: [], //担保方式 CD000100
      // custTypeSelections: [], //客户类型 CD000212
      productTypeSelections: [], //业务种类 CD000061
      projectTypeSelections: [], //项目类型 CD000172
      isLowRiskSelections: [], //是否低风险 CD000167
      crdProductTypeSelections: [], //额度类型 CD000211
      options: [],
      value: '',
      // mainGuaranteeTypeDisabled: false,
      // productTypeDisabled: false,
      // 分页内容
      pageInfo: {
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      tableData: [],
      multipleSelection: [],
      treeData: [],
      customProps: {
        CRD_DESCR: 'CRD_DESCR',
        CRD_LEVEL: 'CRD_LEVEL',
        CRD_PRODUCT_NAME: 'CRD_PRODUCT_NAME',
        CRD_PRODUCT_NUM: 'CRD_PRODUCT_NUM',
        CRD_PRODUCT_TYPE: 'CRD_PRODUCT_TYPE',
        IS_LOW_RISK: 'IS_LOW_RISK',
        CRD_SYS_STATUS: 'CRD_SYS_STATUS',
        CREATE_ORG: 'CREATE_ORG',
        CREATE_TIME: 'CREATE_TIME',
        CREATE_USER: 'CREATE_USER',
        IS_DELETED: 'IS_DELETED',
        SUPER_CRD_NUM: 'SUPER_CRD_NUM',
        UPDATE_ORG: 'UPDATE_ORG',
        UPDATE_TIME: 'UPDATE_TIME',
        UPDATE_USER: 'UPDATE_USER',
        children: 'children',
        label: 'label'
      },
      input: '',
      labelPosition: 'right',
      formLabelAlign: {
        crdProductName: '',
        crdProductNum: '',
        crdLevel: '',
        crdSysStatus: '',
        crdProductType: '',
        isLowRisk: '',
        crdDescr: ''
      },
      formLabelAlignRules: {
        crdProductName: [
          { required: true, message: '请输入 额度产品名称', trigger: 'blur' }
        ],
        crdSysStatus: [
          { required: true, message: '请选择 额度品种状态', trigger: 'change' }
        ],
        crdProductType: [
          { required: true, message: '请选择 额度品种类型', trigger: 'change' }
        ],
        isLowRisk: [
          {
            required: true,
            message: '请选择 是否低风险额度',
            trigger: 'change'
          }
        ]
      },
      currentPage: 1,
      dialogFormVisible: false,
      dialogFormVisible2: false,
      form: {
        crdProductNum: '',
        crdProductName: '',
        crdLevel: '',
        crdSysStatus: '',
        crdProductType: '',
        isLowRisk: '',
        crdDescr: ''
      },
      formRules: {
        crdProductName: [
          { required: true, message: '请输入 额度产品名称', trigger: 'blur' }
        ],
        crdSysStatus: [
          { required: true, message: '请选择 额度品种状态', trigger: 'change' }
        ],
        crdProductType: [
          { required: true, message: '请选择 额度品种类型', trigger: 'change' }
        ],
        isLowRisk: [
          {
            required: true,
            message: '请选择 是否低风险额度',
            trigger: 'change'
          }
        ]
      },
      form2: {
        productNum: '',
        productName: '',
        // productStatusCd: '',
        // limitUsedType: '',
        mainGuaranteeType: '',
        // custType: '',
        productType: '',
        projectType: ''
      },
      // form2Rule: {
      //   productNum: [
      //     { required: true, message: '请选择 业务品种编号', trigger: 'change' }
      //   ],
      //   mainGuaranteeType: [
      //     { required: true, message: '请选择 担保方式', trigger: 'change' }
      //   ],
      //   productType: [
      //     { required: true, message: '请选择 业务种类', trigger: 'change' }
      //   ],
      //   projectType: [
      //     { required: true, message: '请选择 项目类型', trigger: 'change' }
      //   ]
      // },
      formLabelWidth: '140px',
      //关联时，业务品种传输的值
      productTypeTrans: '',
      //上级菜单选项的父子数据
      defaultProps: {
        children: 'children',
        label: 'title',
        checkStrictly: true,
        multiple: true
      },

      // 业务品种选择dialog框中，详细信息表格中的数据源
      productMsg: [],
      // 业务品种选择器搜索条件form
      productForm: {
        productNum: '',
        productName: ''
      },
      // 业务品种选择器dialog框
      productDialogVisible: false,
      // 业务品种dialog中的分页信息
      productPageInfo: { pageNum: 1, pageSize: 10 },
      // 业务品种dialog中数据总条数
      productTotal: 40,
    }
  },

  created() {
    this.permission = getStore({ name: 'permission' })
    //拿字典
    getDictionary('CD000178').then(response => {
      console.log('额度品种状态 CD000178', response)
      this.crdSysStatusSelections = response.data.data
    })
    getDictionary('CD000100').then(response => {
      console.log('担保方式 CD000100', response)
      this.mainGuaranteeTypeSelections = response.data.data
    })
    // getDictionary('CD000212').then(response => {
    //   console.log('客户类型 CD000212', response)
    //   this.custTypeSelections = response.data.data
    // })
    dictTreeByCode('CD000061').then(res => {
      console.log('业务品种 CD000061', res)
      this.productTypeSelections = res.data.data
    })
    getDictionary('CD000172').then(response => {
      console.log('项目类型 CD000172', response)
      this.projectTypeSelections = response.data.data
    })
    getDictionary('CD000167').then(response => {
      console.log('是否低风险 CD000167', response)
      this.isLowRiskSelections = response.data.data
    })
    getDictionary('CD000211').then(response => {
      console.log('额度类型 CD000211', response)
      this.crdProductTypeSelections = response.data.data
    })
    getTreeData().then(res => {
      console.log(res.data.data, '获取data对象')
      const data = res.data.data
      this.treeData = data
    })
    var current = this.pageInfo.pagenum
    var size = this.pageInfo.pagesize
    getList(null, current, size).then(res => {
      console.log(res, 'listlist')
      const data = res.data.data
      current = data.current
      size = data.size
      this.total = data.total
      this.tableData = data.records
    })
  },

  mounted: function () { },

  methods: {
    // =============以下方法函数为业务品种选择相关的内容=============
    // 获取业务品种列表
    getProductListCommon() {
      getProductList(
        this.productForm.productNum,
        this.productForm.productName,
        this.productPageInfo.pageNum,
        this.productPageInfo.pageSize
      ).then(res => {
        console.log(res, '获取业务品种选择列表')
        this.productMsg = res.data.data.records
        this.productTotal = res.data.data.total
      })
    },
    // 点击确定按钮，确认选择业务品种
    makeProductSure(row) {
      console.log(row, '打印row的信息')
      this.form2.productNum = row.productNum
      this.form2.productName = row.productName
      this.productDialogVisible = false
    },
    // 点击重置按钮，清空input中的内容(业务品种)
    clearProductMsg() {
      this.$refs['productForm'].resetFields()
    },
    // 业务品种dialog框关闭后
    closeDialogProduct() {
      this.productForm.productNum = ''
      this.productForm.productName = ''
    },
    // 点击查询按钮，触发该函数，根据input中的值显示对应的信息(业务品种)
    querProductMsg() {
      this.getProductListCommon()
    },
    //业务品种选择器:关联业务品种点击业务品种编号右侧放大镜，触发该函数
    chooseProduct() {
      this.productPageInfo.pageNum = 1
      this.productPageInfo.pagesize = 10
      this.getProductListCommon()
      this.productDialogVisible = true
    },
    // ====选择业务品种dialog中的分页功能====
    // 监听 pagesize 改变的事件
    productSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.productPageInfo.pageSize = val
      this.getProductListCommon()
    },
    // 监听 页码值 改变的事件
    productCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.productPageInfo.pageNum = val
      this.getProductListCommon()
    },
    //====================分割===========================

    //业务品种，传输选中的值，不传输级联关系
    getProductType() {
      console.log(
        '业务品种选择树',
        this.$refs.productTypeTree.getCheckedNodes()
      )
      let arr = this.$refs.productTypeTree.getCheckedNodes()
      var productString = ''
      for (var j = 0; j < arr.length; j++) {
        productString = productString + ',' + arr[j].value
      }
      this.productTypeTrans = productString.substr(1)
      console.log('业务品种传输值：：：', productString)
    },

    //公共方法，刷新页面，点击树时触发
    refresh() {
      const treeData = this.$refs.tree.getCurrentNode()
      console.log(treeData, 'treeData')
      var current = this.pageInfo.pagenum
      var size = this.pageInfo.pagesize
      if (treeData == null) {
        getList(null, current, size).then(res => {
          console.log(res, 'listlist')
          const data = res.data.data
          current = data.current
          size = data.size
          this.total = data.total
          this.tableData = data.records
        })
      } else {
        var crdProductNum = treeData.CRD_PRODUCT_NUM
        getList(crdProductNum, current, size).then(res => {
          console.log(res, 'listlist')
          const data = res.data.data
          current = data.current
          size = data.size
          this.total = data.total
          this.tableData = data.records
        })
      }
    },

    //多选
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      // console.log(`每页 ${val} 条`);
      this.pageInfo.pagesize = newSize
      this.refresh()
    },

    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      // console.log(`当前页: ${val}`);
      this.pageInfo.pagenum = newPage
      this.refresh()
    },

    //修改额度产品信息点击保存时触发的函数
    updataForm() {
      const data = this.formLabelAlign
      console.log('基本信息', data)
      if (this.$refs.tree.getCurrentNode() == null) {
        return this.$message.error('请选择三级额度品种保存！')
      }
      const level = this.$refs.tree.getCurrentNode().CRD_LEVEL
      if (level !== '3') {
        return this.$message.error('请选择三级额度品种保存！')
      }
      this.$refs.formLabelAlign.validate(valid => {
        if (!valid) {
          return this.$message.error('请输入完整的信息')
        }
        saveList(data).then(() => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.clearFormLabelAlign()
          this.$refs.formLabelAlign.resetFields()
          getTreeData().then(res => {
            console.log(res.data.data, '获取data对象')
            const data = res.data.data
            this.treeData = data
          })
        })
      })
    },

    //新增额度产品时点击确定触发的函数
    addForm() {
      this.$refs.form.validate(valid => {
        if (!valid) {
          return this.$message.error('请输入完整的信息')
        }
        console.log('新增额度品种', this.form)
        const datas = this.form
        const treeData = this.$refs.tree.getCurrentNode()
        datas.superCrdNum = treeData.CRD_PRODUCT_NUM
        datas.superCrdName = treeData.CRD_PRODUCT_NAME
        datas.crdLevel = parseInt(treeData.CRD_LEVEL) + 1
        console.log('----------------:', datas)
        add(datas).then(res => {
          if (res.status != 200) {
            return this.$message.error(res.data.msg)
          }
          this.$message.success('操作成功!')
          this.clearFormLabelAlign()
          this.$refs.formLabelAlign.resetFields()
          this.dialogFormVisible = false
          getTreeData().then(res => {
            const data = res.data.data
            this.treeData = data
          })
        })
      })
    },

    // 点击新增dialog框中 取消 按钮，触发该函数
    resetForm() {
      this.clearForm()
      this.$refs['form'].resetFields()
      this.dialogFormVisible = false
    },
    resetForm2() {
      this.clearForm2()
      this.$refs['form2'].resetFields()
      this.dialogFormVisible2 = false
    },
    //清空表单信息
    clearForm() {
      this.form.crdProductNum = ''
      this.form.crdProductName = ''
      this.form.isLowRisk = ''
      this.form.crdProductType = ''
      this.form.crdLevel = ''
      this.form.crdSysStatus = ''
      this.form.crdDescr = ''
    },
    clearFormLabelAlign() {
      this.formLabelAlign.crdProductNum = ''
      this.formLabelAlign.crdProductName = ''
      this.formLabelAlign.isLowRisk = ''
      this.formLabelAlign.crdProductType = ''
      this.formLabelAlign.crdLevel = ''
      this.formLabelAlign.crdSysStatus = ''
      this.formLabelAlign.crdDescr = ''
    },

    clearForm2() {
      this.form2.productNum = ''
      this.form2.productName = ''
      this.form2.projectType = ''
      this.form2.mainGuaranteeType = ''
      this.form2.productType = ''
      this.productTypeTrans = ''
    },

    //点击树上每个额度产品触发的函数
    getMessage() {
      this.clearFormLabelAlign()
      this.$refs.formLabelAlign.resetFields()
      const data = this.$refs.tree.getCurrentNode()
      console.log('点击的额度产品', data)
      console.log(data.CRD_LEVEL, data.CRD_PRODUCT_NUM)
      this.formLabelAlign.crdProductName = data.CRD_PRODUCT_NAME
      this.formLabelAlign.crdProductNum = data.CRD_PRODUCT_NUM
      this.formLabelAlign.crdSysStatus = data.CRD_SYS_STATUS
      this.formLabelAlign.isLowRisk = data.IS_LOW_RISK
      this.formLabelAlign.crdLevel = data.CRD_LEVEL
      this.formLabelAlign.crdProductType = data.CRD_PRODUCT_TYPE
      this.formLabelAlign.crdDescr = data.CRD_DESCR
      this.refresh()
    },

    //点击新增下级产品进行校验，若可以增加，打开新增弹窗，并且系统随机生成一个ID
    checkLevel() {
      if (this.$refs.tree.getCurrentNode() == null) {
        return this.$message.error('请选中额度品种!')
      }
      const level = this.$refs.tree.getCurrentNode().CRD_LEVEL
      if (level == '3') {
        return this.$message.error('此时不能新增下级产品！')
      } else {
        this.dialogFormVisible = true
        const data = this.$refs.tree.getCurrentNode()
        const crdId = data.CRD_PRODUCT_NUM
        getCrdId(crdId).then(res => {
          console.log('选择增加的额度品种ID：', res.data.data.crdId)
          this.form.crdProductNum = res.data.data.crdId
          this.form.crdLevel = parseInt(level) + 1
        })
        console.log('此时的新增信息框：', this.form)
      }
    },

    //点击删除的时候进行校验，一级产品不允许删除
    removeCheck() {
      if (this.$refs.tree.getCurrentNode() == null) {
        return this.$message.error('请选中删除项！')
      }
      const level = this.$refs.tree.getCurrentNode().CRD_LEVEL
      const crdProductNum = this.$refs.tree.getCurrentNode().CRD_PRODUCT_NUM
      if (level == '1') {
        return this.$message.error('不能删除此级产品！')
      } else {
        this.$confirm('将删除该级产品，是否确定？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          removeTree(crdProductNum).then(() => {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            getTreeData().then(res => {
              const data = res.data.data
              this.treeData = data
            })
          })
          this.clearFormLabelAlign()
          this.$refs.formLabelAlign.resetFields()
        }).catch(() => {})
      }
    },

    //点击关联时进行校验，若未选择额度产品，则不弹框
    relevanceCheck() {
      if (this.$refs.tree.getCurrentNode() == null) {
        return this.$message.error('请选择三级额度品种关联！')
      }
      const level = this.$refs.tree.getCurrentNode().CRD_LEVEL
      const superCrdNum = this.$refs.tree.getCurrentNode().SUPER_CRD_NUM
      const crdProductNum = this.$refs.tree.getCurrentNode().CRD_PRODUCT_NUM
      console.log(level, '789789')
      if (level == '3') {
        this.dialogFormVisible2 = true
      } else {
        return this.$message.error('本级产品不能进行关联！')
      }
      // console.log(superCrdNum.startsWith('03'),'eeeeeee');
      // 需求允许编辑担保方式和业务种类
      // if (superCrdNum.startsWith('03')) {
      //   this.mainGuaranteeTypeDisabled = true
      //   this.productTypeDisabled = true
      // } else {
      //   this.mainGuaranteeTypeDisabled = false
      //   this.productTypeDisabled = false
      // }
      // getBusinessNum().then(res => {
      //   console.log(res, '业务品种编号')
      //   this.options = res.data.data
      // })
      // getcrdProductType(crdProductNum).then(res => {
      //   console.log(res, '09090909')
      //   this.form2.productType = res.data.data.crdProductType
      //   //判断客户类别，根据额度产品编号的第二位数字进行判断
      //   // if (crdProductNum.charAt(1) == '1') {
      //   //   this.form2.custType = '1' //对公
      //   // } else if (crdProductNum.charAt(1) == '2') {
      //   //   this.form2.custType = '2' //个人
      //   // } else if (crdProductNum.charAt(1) == '3') {
      //   //   this.form2.custType = '3' //同业
      //   // }
      // })
    },

    //根据业务品种编号获得信息
    // getProductMessage() {
    //   console.log(this.form2.productNum, '1111111111111111111')
    //   const productNum = this.form2.productNum
    //   getProductData(productNum).then(res => {
    //     const data = res.data.data
    //     this.form2.productName = data.productName
    //   })
    // },

    //修改关联信息点击确定触发的函数
    addProductForm() {
      let crdProductNum = this.$refs.tree.getCurrentNode().CRD_PRODUCT_NUM
      let data = this.form2
      if(data.productNum == '' & data.mainGuaranteeType == '' &
         data.productType == '' & data.projectType == ''){
         //  不能都为空
         return this.$message.error('关联信息不能全部为空！')
      }
      data.crdProductNum = crdProductNum
      data.productType = this.productTypeTrans
      let projects = data.projectType
      if(projects != ''){
        data.projectType = projects.join(',')
      }else{
        data.projectType = ''
      }
      console.log('新增的关联关系', data)
      saveRelevance(data).then(() => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        this.dialogFormVisible2 = false
        this.refresh()
        this.clearForm2()
        this.$refs.form2.resetFields()
      })
    },

    //点击删除关联信息出发的函数
    removeRelevance() {
      console.log(
        '选择的内容',
        this.multipleSelection,
        this.multipleSelection.length
      )
      if (this.multipleSelection.length == 0) {
        return this.$message.error('请选择一条记录')
      }
      const data = this.multipleSelection
      if (data.length > 0) {
        var str = ''
        for (let i = 0; i < data.length; i++) {
          if (i == 0) {
            str = str + data[i].id
          } else {
            str = str + ',' + data[i].id
          }
        }
        console.log(str, '分割23456')
        this.$confirm('将删除此条关联信息，是否确定？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          removeRelevanceData(str).then(() => {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.refresh()
          })
        }).catch(() => {})
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: flex-start;
  .left {
    width: 10%;
  }
  .right {
    width: 188%;
  }
}
.el-header {
  background-color: #fff;
  color: #333;
  line-height: 30px;
  border: 1px solid #dcdfe6;
  width: 220px;
}

.el-main {
  color: #333;
  border: 1px solid #dcdfe6;
}

.main_top {
  height: 50px;
}
.el-form {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}
.el-form-item {
  width: 50%;
  .el-select,
  .el-cascader {
    width: 100%;
  }
  /deep/ .el-cascader {
    .el-cascader__tags {
      span.el-tag {
        span {
          flex: auto !important;
        }
      }
    }
  }
}
.el-table-column {
  color: #000;
}
.el-pagination {
  float: right;
}
// 搜索区样式
.search {
  .el-form /deep/ {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    .el-col {
      .el-form-item {
        .el-form-item__label {
          // color: #252525;
          font-weight: normal;
        }
      }
    }
    .el-col:last-child {
      .el-form-item {
        .el-form-item__content {
          display: flex;
          .el-button {
            margin-right: 10px;
          }
        }
      }
    }
  }
}
</style>


