<!-- 限额管理-- 限额指标页面 -->
<template>
  <div>
    <!--搜索条件区域-->
    <div class="search">
      <el-row :gutter="10">
        <el-form label-width="100px" size="small">
          <el-col :xs="7" :sm="7" :md="7" :lg="7" :xl="7">
            <el-form-item label="限额指标编号" prop="account">
              <el-input v-model="params.quotaIndexNum" placeholder="请输入内容" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="7" :sm="7" :md="7" :lg="7" :xl="7">
            <el-form-item label="限额指标名称" prop="account">
              <el-input v-model="params.quotaIndexName" placeholder="请输入内容" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="7" :sm="7" :md="7" :lg="7" :xl="7">
            <el-form-item label="限额类型" prop="quotaType">
              <el-select v-model="params.quotaType" placeholder="请选择" clearable>
                <el-option
                  v-for="(item,i) in quotaTypeData"
                  :key="i"
                  :label="item.dictValue"
                  :value="item.dictKey"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="7" :sm="7" :md="7" :lg="7" :xl="7">
            <el-form-item label="限额指标类型" prop="quotaIndexType">
              <el-select v-model="params.quotaIndexType" placeholder="请选择" clearable>
                <el-option
                  v-for="(item,i) in quotaIndexTypeData"
                  :key="i"
                  :label="item.dictValue"
                  :value="item.dictKey"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="7" :sm="7" :md="7" :lg="7" :xl="7">
            <el-button size="small" type="primary" @click="query">查询</el-button>
          </el-col>
        </el-form>
      </el-row>
    </div>

    <!-- 页面公用dialog框：新增、查看、修改 按钮公用 -->
    <el-dialog title :visible.sync="dialogFormVisible2" size="70%" width="70%" @close="dialogClose">
      <div class="dialog-footer" v-if="!isViewOrModify" style="float:right;clear:both">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="addOrUpdate">确 定</el-button>
      </div>
      <!-- <div style="clear:both"></div> -->
      <span class="msgTitle" style="margin:10px 0">
        <i class="iconfont iconnavicon"></i> 设定区域
      </span>
      <!-- dialog框详情，表单分为三个部分，名字均为 form -->
      <div
        class="dialog2"
        style="border-radius: 4px;border: 1px solid #e9e9eb;padding:10px 0;box-shadow:4px 4px 4px #ccc"
      >
        <!-- 八个select下拉框 -->
        <el-form :model="form" ref="form">
          <el-form-item label="限额指标编号：" :label-width="formLabelWidth" v-if="isViewOrModify">
            <el-input v-model="form.quotaIndexNum" autocomplete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="限额指标名称：" :label-width="formLabelWidth" :required="true" v-if="true">
            <el-input v-model="form.quotaIndexName" autocomplete="off" :disabled="isDisabled"></el-input>
          </el-form-item>
          <el-form-item label="限额指标类型：" v-if="isAdd" :label-width="formLabelWidth" :required="true">
            <el-select
              v-model="form.quotaIndexType"
              :disabled="isDisabled"
              placeholder="--请选择--"
              @change="showEle"
            >
              <el-option
                v-for="(item,i) in quotaIndexTypeSelections"
                :key="i"
                :label="item.dictValue"
                :value="item.dictKey"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="限额类型：" :label-width="formLabelWidth" :required="true">
            <el-select v-model="form.quotaType" :disabled="isDisabled" placeholder="--请选择--">
              <el-option
                v-for="(item,i) in quotaTypeSelections"
                :key="i"
                :label="item.dictValue"
                :value="item.dictKey"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="限额计算方式：" :label-width="formLabelWidth" :required="true">
            <el-select v-model="form.computingMethod" :disabled="isDisabled" placeholder="--请选择--">
              <el-option
                v-for="(item,i) in computingMethodSelections"
                :key="i"
                :label="item.dictValue"
                :value="item.dictKey"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="统计口径：" :label-width="formLabelWidth" :required="true">
            <el-select
              v-model="form.quotaIndexCaliber"
              :disabled="isDisabled"
              placeholder="--请选择--"
            >
              <el-option
                v-for="(item,i) in quotaIndexCaliberSelections"
                :key="i"
                :label="item.dictValue"
                :value="item.dictKey"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="限额计算对象：" :label-width="formLabelWidth">
            <el-select v-model="form.computingTarget" :disabled="isDisabled" placeholder="--请选择--">
              <el-option
                v-for="(item,i) in computingTargetSelections"
                :key="i"
                :label="item.dictValue"
                :value="item.dictKey"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="指标状态：" :label-width="formLabelWidth" :required="true">
            <el-select v-model="form.quotaIndexState" :disabled="isDisabled" placeholder="--请选择--">
              <el-option
                v-for="(item,i) in quotaIndexStateSelections"
                :key="i"
                :label="item.dictValue"
                :value="item.dictKey"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <!-- 分析维度范围 -->
        <el-form :model="form" ref="form">
          <el-form-item label="分析维度范围：" :label-width="formLabelWidth">
            <el-checkbox v-model="form.quotaIndexRange" value="0" :disabled="true">全部维度</el-checkbox>
            <span class="remind" style>默认不过滤，所有业务需要检查</span>
          </el-form-item>

          <!-- 维度里面的select下拉框：-->
          <el-form-item :label-width="formLabelWidth">
            <el-checkbox
              v-model="form.check_1"
              v-if="quotaIndexType_1"
              :disabled="checkedDisabled"
              @change="changeSelect_1"
            >
              <el-select
                v-model="form.rangeRegion"
                :disabled="selectDisabled_1"
                multiple
                v-if="quotaIndexType_1"
                placeholder="区域"
                clearable
                @change="handleChange1"
              >
                <el-option
                  v-for="(item,i) in rangeRegionSelections"
                  :key="i"
                  :label="item.dictValue"
                  :value="item.dictKey"
                ></el-option>
              </el-select>
            </el-checkbox>
          </el-form-item>

          <el-form-item :label-width="formLabelWidth">
            <el-checkbox
              v-model="form.check_2"
              v-if="quotaIndexType_1"
              :disabled="checkedDisabled"
              @change="changeSelect_2"
            >
              <el-select
                v-model="form.rangeCustomer"
                :disabled="selectDisabled_2"
                placeholder="客户类型"
                clearable
                @change="handleChange2"
                v-if="quotaIndexType_1"
              >
                <el-option
                  v-for="(item,i) in rangeCustomerSelections"
                  :key="i"
                  :label="item.dictValue"
                  :value="item.
                  dictKey"
                ></el-option>
              </el-select>
            </el-checkbox>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth">
            <el-checkbox
              v-model="form.check_3"
              v-if="quotaIndexType_1"
              :disabled="checkedDisabled"
              @change="changeSelect_3"
            >
              <el-select
                v-model="form.rangerRiskMitigation"
                :disabled="selectDisabled_3"
                v-if="quotaIndexType_1"
                multiple
                placeholder="风险缓释"
                clearable
                @change="handleChange3"
              >
                <el-option
                  v-for="(item,i) in rangerRiskMitigationSelections"
                  :key="i"
                  :label="item.dictValue"
                  :value="item.dictKey"
                ></el-option>
              </el-select>
            </el-checkbox>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth">
            <el-checkbox
              v-if="quotaIndexType_3"
              v-model="form.check_4"
              :disabled="checkedDisabled"
              @change="changeSelect_4"
            >
              <el-select
                v-if="quotaIndexType_3"
                v-model="form.currency"
                multiple
                placeholder="币种"
                clearable
                @change="handleChange4"
              >
                <el-option
                  v-for="(item,i) in currencySelections"
                  :key="i"
                  :label="item.dictValue"
                  :value="item.dictKey"
                ></el-option>
              </el-select>
            </el-checkbox>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth">
            <el-checkbox
              v-model="form.check_5"
              v-if="quotaIndexType_1"
              :disabled="checkedDisabled"
              @change="changeSelect_5"
            >
              <!-- <el-select
                v-model="form.rangeIndustry"
                :disabled="selectDisabled_5"
                multiple
                v-if="quotaIndexType_1"
                placeholder="行业"
                clearable
                @change="handleChange5"
              >
                <el-option
                  v-for="(item,i) in rangeIndustrySelections"
                  :key="i"
                  :label="item.dictValue"
                  :value="item.dictKey"
                ></el-option>
              </el-select>-->
              <tree-select
                v-model="form.rangeIndustry"
                 :value="form.rangeIndustry"
                :props="selprops"
                :options="rangeIndustrySelections"
                :clearable="isClearable"
                :accordion="isAccordion"
                @handleChange5Change="handleChange5"
              />
            </el-checkbox>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth">
            <el-checkbox
              v-model="form.check_6"
              v-if="quotaIndexType_1"
              :disabled="checkedDisabled"
              @change="changeSelect_6"
            >
              <el-select
                v-model="form.rangeCountry"
                multiple
                placeholder="国别"
                v-if="quotaIndexType_1"
                clearable
                @change="handleChange6"
              >
                <el-option
                  v-for="(item,i) in rangeCountrySelections"
                  :key="i"
                  :label="item.dictValue"
                  :value="item.dictKey"
                ></el-option>
              </el-select>
            </el-checkbox>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth">
            <el-checkbox
              v-model="form.check_7"
              v-if="quotaIndexType_1"
              :disabled="checkedDisabled"
              @change="changeSelect_7"
            >
              <el-select
                v-model="form.rangeProduct"
                :disabled="selectDisabled_7"
                multiple
                v-if="quotaIndexType_1"
                placeholder="产品"
                clearable
                @change="handleChange7"
              >
                <el-option
                  v-for="(item,i) in rangeProductSelections"
                  :key="i"
                  :label="item.productName"
                  :value="item.productNum"
                ></el-option>
              </el-select>
            </el-checkbox>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth">
            <el-checkbox
              v-model="form.check_8"
              v-if="quotaIndexType_2"
              :disabled="checkedDisabled"
              @change="changeSelect_8"
            >
              <el-select
                v-model="form.businessType"
                :disabled="selectDisabled_8"
                multiple
                v-if="quotaIndexType_2"
                placeholder="业务种类"
                clearable
                @change="handleChange8"
              >
                <el-option
                  v-for="(item,i) in businessTypeSelections"
                  :key="i"
                  :label="item.dictValue"
                  :value="item.dictKey"
                ></el-option>
              </el-select>
            </el-checkbox>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth">
            <el-checkbox
              v-model="form.check_9"
              v-if="quotaIndexType_1"
              :disabled="checkedDisabled"
              @change="changeSelect_9"
            >
              <el-select
                v-model="form.rangeTerm"
                :disabled="selectDisabled_9"
                v-if="quotaIndexType_1"
                placeholder="期限"
                clearable
                @change="handleChange9"
              >
                <el-option
                  v-for="(item,i) in rangeTermSelections"
                  :key="i"
                  :label="item.dictValue"
                  :value="item.dictKey"
                ></el-option>
              </el-select>
            </el-checkbox>
          </el-form-item>
        </el-form>
        <!-- 补充说明和限额指标，管理信息：只在查看和修改中展示 -->
        <el-form :model="form" ref="form">
          <el-form-item label="限额指标：" :label-width="formLabelWidth" style="width:100%">
            <span
              class="el-tag el-tag--info el-tag--small el-tag--light"
              style="margin-right:5px"
              v-if="quotaIndexType_1"
            >
              <span
                class="el-select__tags-text"
                :v-model="form.rangeRegion"
              >区域：{{rangeRegionContent}}</span>
            </span>
            <span
              class="el-tag el-tag--info el-tag--small el-tag--light"
              style="margin-right:5px"
              v-if="quotaIndexType_1"
            >
              <span
                class="el-select__tags-text"
                :v-model="form.rangeCustomer"
              >客户类型：{{ rangeCustomerContent }}</span>
            </span>
            <span
              class="el-tag el-tag--info el-tag--small el-tag--light"
              style="margin-right:5px"
              v-if="quotaIndexType_1"
            >
              <span class="el-select__tags-text" :v-model="form.rangerRiskMitigation">
                风险缓释：{{
                rangerRiskMitigationContent }}
              </span>
            </span>
            <span
              class="el-tag el-tag--info el-tag--small el-tag--light"
              style="margin-right:5px"
              v-if="quotaIndexType_3"
            >
              <span class="el-select__tags-text" :v-model="form.currency">币种：{{ currencyContent }}</span>
            </span>
            <span
              class="el-tag el-tag--info el-tag--small el-tag--light"
              style="margin-right:5px"
              v-if="quotaIndexType_1"
            >
              <span
                class="el-select__tags-text"
                :v-model="form.rangeIndustry"
              >行业：{{ rangeIndustryContent }}</span>
            </span>
            <span
              class="el-tag el-tag--info el-tag--small el-tag--light"
              style="margin-right:5px"
              v-if="quotaIndexType_1"
            >
              <span
                class="el-select__tags-text"
                :v-model="form.rangeCountry"
              >国别：{{ rangeCountryContent }}</span>
            </span>
            <span
              class="el-tag el-tag--info el-tag--small el-tag--light"
              style="margin-right:5px"
              v-if="quotaIndexType_1"
            >
              <span
                class="el-select__tags-text"
                :v-model="form.rangeProduct"
              >产品：{{ rangeProductContent }}</span>
            </span>
            <span
              class="el-tag el-tag--info el-tag--small el-tag--light"
              style="margin-right:5px"
              v-if="quotaIndexType_2"
            >
              <span
                class="el-select__tags-text"
                :v-model="form.businessType"
              >业务种类：{{ businessTypeContent }}</span>
            </span>
            <span
              class="el-tag el-tag--info el-tag--small el-tag--light"
              style="margin-right:5px"
              v-if="quotaIndexType_1"
            >
              <span class="el-select__tags-text" :v-model="form.rangeTerm">期限：{{ rangeTermContent }}</span>
            </span>
          </el-form-item>
          <el-form-item label="补充说明：" :label-width="formLabelWidth">
            <el-input
              type="textarea"
              :rows="2"
              :disabled="isDisabled"
              style="width:800px"
              placeholder="请输入内容"
              v-model="form.explainInfo"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span class="msgTitle" style="margin:10px 0 0 0" v-if="msgCheck">
        <i class="iconfont iconnavicon"></i> 管理信息
      </span>
      <div
        v-if="msgCheck"
        class="dialog2"
        style="border-radius: 4px;border: 1px solid #e9e9eb;padding:10px 0;box-shadow:4px 4px 4px #ccc"
      >
        <el-form :v-model="form" ref="form">
          <el-form-item label="维护人" :label-width="formLabelWidth">
            <el-input v-model="form.userNum" autocomplete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="维护机构" :label-width="formLabelWidth">
            <el-input v-model="form.orgNum" autocomplete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="维护时间" :label-width="formLabelWidth">
            <el-input v-model="form.modifyTime" autocomplete="off" :disabled="true"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>

    <!-- 表格详情部分 -->
    <el-button
      v-if="permission.rcmConfigurationQuota_add"
      @click="handleAdd"
      type="primary"
      size="small"
    >新增</el-button>
    <div class="content">
      <!-- 表格内容部分 -->
      <!-- 点击上方的查询按钮，表格中显示对应的数据，双击数据行，跳转到详情页 -->
      <div class="tableContent"></div>
      <el-table :data="tableData" border style="width: 100%" max-height="380">
        <el-table-column
          prop="quotaIndexNum"
          label="限额指标编号"
          :resizable="false"
          align="center"
          width="140"
        ></el-table-column>
        <el-table-column
          prop="quotaIndexName"
          label="限额指标名称"
          :resizable="false"
          align="center"
          width="360"
        ></el-table-column>
        <el-table-column prop="quotaType" label="限额类型" :resizable="false" align="center">
          <template slot-scope="scope">{{ quotaTypeCols[scope.row.quotaType] }}</template>
        </el-table-column>
        <el-table-column
          prop="quotaIndexType"
          label="限额指标类型"
          :resizable="false"
          align="center"
          width="140"
        >
          <template slot-scope="scope">{{ quotaIndexTypeCols[scope.row.quotaIndexType] }}</template>
        </el-table-column>
        <el-table-column prop="quotaIndexState" label="指标状态" :resizable="false" align="center">
          <template slot-scope="scope">{{ quotaIndexStateCols[scope.row.quotaIndexState] }}</template>
        </el-table-column>
        <el-table-column label="操作" :resizable="false" align="center" width="220">
          <template slot-scope="scope">
            <el-button
              :disabled="permission.rcmConfigurationQuota_view? false : true"
              @click="handleView(scope.row)"
              type="text"
              size="small"
            >查看</el-button>
            <el-button
              :disabled="permission.rcmConfigurationQuota_edit? false : true"
              @click="handleEdit(scope.row)"
              type="text"
              size="small"
            >修改</el-button>
            <el-button
              :disabled="permission.rcmConfigurationQuota_enable? false : true"
              @click="toUsable(scope.row)"
              type="text"
              size="small"
            >启用</el-button>
            <el-button
              :disabled="permission.rcmConfigurationQuota_stop? false : true"
              @click="toUnUsable(scope.row)"
              type="text"
              size="small"
            >停用</el-button>
            <el-button
              :disabled="permission.rcmConfigurationQuota_remove? false : true"
              @click="rowDel(scope.row)"
              type="text"
              size="small"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页功能区 -->
      <el-pagination
        class="pageination"
        @size-change="sizeChange"
        @current-change="currentChange"
        :current-page="page.pageNum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import {
  getList,
  getDetail,
  add,
  update,
  remove,
  usable,
  unusable
} from '@/api/quota/rcmConfigurationQuota/rcmConfigurationQuota'
import { dictionary } from '@/utils/filter.js'
import { getListData } from '@/utils/treeCustomize.js'
import TreeSelect from '@/components/TreeSelect/multiple'
import {
  getDictionary,
  getDict2,
  dictTranslate,
  product
} from '@/api/system/dict'
import { getStore } from '@/utils/store'
export default {
  components: { TreeSelect },
  data() {
    return {
      permission: {},
      params: {
        quotaIndexNum: null,
        quotaIndexName: null,
        quotaType: null,
        quotaIndexType: null
      },
      quotaTypeData: {},
      quotaIndexTypeData: {},
      tableData: [],
      page: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      isClearable: true, // 可清空（可选）
      isAccordion: true, // 可收起（可选）
      //  value: 'id',
      //   label: 'dictValue',
      selprops: {
        // 配置项（必选）
        identifier:[],
       placeholder:'行业',
        value: 'id',
        label: 'label',
        children: 'children',
        disabled: true
      },

      // 行业
      options: [],
      // 控制维度详细多选框是否只读
      checkedDisabled: false,
      // selectDisabled_?:控制维度详细select下拉框是否只读
      //区域
      selectDisabled_1: true,
      //客户类型
      selectDisabled_2: true,
      // 风险缓释
      selectDisabled_3: true,
      // 币种
      selectDisabled_4: true,
      // 行业
      selectDisabled_5: true,
      // 国别
      selectDisabled_6: true,
      // 产品
      selectDisabled_7: true,
      // 业务种类
      selectDisabled_8: true,
      // 期限
      selectDisabled_9: true,
      //控制管理信息显隐
      msgCheck: true,
      formLabelWidth: '160px',
      // 控制公用dialog开关
      dialogFormVisible2: false,
      // 控制资产信息配置编号显隐
      isViewOrModify: false,
      // 控制限额指标类型显隐
      isAdd: false,
      isDisabled: true,

      form: {},
      loading: true,
      rangeTermSelections: [], //期限
      quotaIndexTypeSelections: [], //限额指标类型
      quotaTypeSelections: [], //限额类型
      computingMethodSelections: [], //限额计算方式
      computingMethodSelections1: [], //限额计算方式
      computingMethodSelections2: [], //限额计算方式
      quotaIndexCaliberSelections: [], //统计口径
      quotaIndexCaliberSelections1: [], //统计口径
      quotaIndexCaliberSelections2: [], //统计口径
      computingTargetSelections: [], //限额计算对象
      computingTargetSelections1: [], //限额计算对象
      computingTargetSelections2: [], //限额计算对象
      rangeRegionSelections: [], //区域

      rangeCustomerSelections: [
        { dictKey: '1', dictValue: '对公客户' },
        { dictKey: '2', dictValue: '个人客户' }
      ], //客户类型
      rangeCustomerSelections1: [], //客户类型
      rangeCustomerSelections2: [], //客户类型
      rangerRiskMitigationSelections: [], //风险缓释

      //表格字典翻译
      // =====查看抽屉区数据=====
      lookTableDrawer: false,
      lookRuleForm: {},
      quotaIndexTypeCols: [],
      quotaTypeCols: [],
      quotaIndexStateCols: [],

      currencySelections: [], //币种
      rangeIndustrySelections: [], //行业
      rangeCountrySelections: [], //  国别
      rangeProductSelections: [], //  产品
      businessTypeSelections: [], //  业务种类
      bussSceneSelections: [], //     业务场景
      quotaIndexStateSelections: [], //指标状态
      //选定的内容
      rangeRegionContent: '', //区域
      rangeCustomerContent: '', //客户类型
      rangerRiskMitigationContent: '', //风险缓释
      currencyContent: '', //币种
      rangeIndustryContent: '', //行业
      rangeCountryContent: '', //  国别
      rangeProductContent: '', //  产品
      businessTypeContent: '', //  业务种类
      // bussSceneContent: "", //     业务场景
      rangeTermContent: '', //期限
      quotaIndexType_1: false,
      quotaIndexType_2: false,
      quotaIndexType_3: false,
      selectionList: []
    }
  },
  created() {
    this.selectData()
    this.getDicAndload(this)
    this.query()
    this.init()
  },
  computed: {
    quotaIndexNums() {
      let quotaIndexNums = []
      this.selectionList.forEach(ele => {
        quotaIndexNums.push(ele.quotaIndexNum)
      })
      return quotaIndexNums.join(',')
    }
  },
  methods: {
    init() {
      this.permission = getStore({ name: 'permission' })
    },
    query() {
      this.params.quotaIndexNum =
        this.params.quotaIndexNum == '' ? null : this.params.quotaIndexNum
      this.params.quotaIndexName =
        this.params.quotaIndexName == '' ? null : this.params.quotaIndexName
      this.params.quotaType =
        this.params.quotaType == '' ? null : this.params.quotaType
      this.params.quotaIndexType =
        this.params.quotaIndexType == '' ? null : this.params.quotaIndexType
      getList(this.page.pageNum, this.page.pageSize, this.params).then(res => {
        // console.log(res,'测试接口111');
        const data = res.data.data
        this.tableData = data.records
        this.page.total = data.total
      })
    },
    selectData() {
      getDictionary('CD000252').then(response => {
        console.log(response.data.data)
        this.quotaTypeData = response.data.data
      })
      getDictionary('CD000253').then(response => {
        this.quotaIndexTypeData = response.data.data
      })
    },
    /*分页参数*/
    currentChange(currentPage) {
      this.page.pageNum = currentPage
      this.query()
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize
      this.query()
    },

    //原框架函数
    //刷新表单
    refreshForm() {
      this.form.quotaIndexNum = ''
      this.form.quotaIndexName = ''
      this.form.quotaIndexType = ''
      this.form.quotaType = ''
      this.form.computingMethod = ''
      this.form.quotaIndexCaliber = ''
      this.form.computingTarget = ''
      this.form.quotaIndexState = ''
      this.form.quotaIndexRange = true
      this.form.check_1 = false
      this.form.check_2 = false
      this.form.check_3 = false
      this.form.check_4 = true
      this.form.check_5 = false
      this.form.check_6 = true
      this.form.check_7 = false
      this.form.check_8 = false
      this.form.check_9 = false
      this.checkedDisabled = false
      this.form.rangeRegion = ''
      this.form.rangeCustomer = ''
      this.form.rangerRiskMitigation = ''
      this.form.currency = ['156']
      this.form.rangeIndustry = ''
      this.form.rangeCountry = ['156']
      this.form.rangeProduct = ''
      this.form.businessType = ''

      this.form.rangeTerm = ''
      this.selectDisabled_1 = true
      this.selectDisabled_2 = true
      this.selectDisabled_3 = true
      this.selectDisabled_4 = true
      this.selectDisabled_5 = true
      this.selectDisabled_6 = true
      this.selectDisabled_7 = true
      this.selectDisabled_8 = true
      this.selectDisabled_9 = true
      this.rangeRegionContent = ''
      this.rangeCustomerContent = ''
      this.rangerRiskMitigationContent = ''
      this.currencyContent = ''
      this.rangeIndustryContent = ''
      this.rangeCountryContent = ''
      this.rangeProductContent = ''
      this.businessTypeContent = ''
      this.rangeTermContent = ''
      this.form.explainInfo = ''
    },

    dialogClose() {
      this.refreshForm()
    },
    rowSave(row, loading, done) {
      add(row).then(
        () => {
          loading()
          this.query()
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        },
        error => {
          done()
          console.log(error)
        }
      )
    },
    addOrUpdate() {
      var data = this.form
      console.log(data.quotaIndexName, 'data.quotaIndexName')
      if (
        data.quotaIndexName == '' ||
        data.quotaIndexName === undefined ||
        data.quotaIndexName == null ||
        data.quotaIndexType == '' ||
        data.quotaIndexType === undefined ||
        data.quotaIndexType == null ||
        data.quotaType == '' ||
        data.quotaType === undefined ||
        data.quotaType == null ||
        data.computingMethod == '' ||
        data.computingMethod === undefined ||
        data.computingMethod == null ||
        data.quotaIndexCaliber == '' ||
        data.quotaIndexCaliber === undefined ||
        data.quotaIndexCaliber == null ||
        data.quotaIndexState == '' ||
        data.quotaIndexState === undefined ||
        data.quotaIndexState == null
      ) {
        alert('信息未填写完整！')
        return
      }
      console.log(data.rangeCustomer)
      data.quotaIndexRange = data.quotaIndexRange ? 1 : ''
      data.rangeRegion =
        data.rangeRegion && data.rangeRegion instanceof Array
          ? data.rangeRegion.join(',')
          : data.rangeRegion
      data.rangeCustomer =
        data.rangeCustomer && data.rangeCustomer instanceof Array
          ? data.rangeCustomer.join(',')
          : data.rangeCustomer
      data.rangerRiskMitigation =
        data.rangerRiskMitigation && data.rangerRiskMitigation instanceof Array
          ? data.rangerRiskMitigation.join(',')
          : data.rangerRiskMitigation
      data.currency =
        data.currency && data.currency instanceof Array
          ? data.currency.join(',')
          : data.currency
      data.rangeIndustry =
        data.rangeIndustry && data.rangeIndustry instanceof Array
          ? data.rangeIndustry.join(',')
          : data.rangeIndustry
      data.rangeCountry =
        data.rangeCountry && data.rangeCountry instanceof Array
          ? data.rangeCountry.join(',')
          : data.rangeCountry
      data.rangeProduct =
        data.rangeProduct && data.rangeProduct instanceof Array
          ? data.rangeProduct.join(',')
          : data.rangeProduct
      data.businessType =
        data.businessType && data.businessType instanceof Array
          ? data.businessType.join(',')
          : data.businessType
      data.bussScene =
        data.bussScene && data.bussScene instanceof Array
          ? data.bussScene.join(',')
          : data.bussScene
      console.log(this.isAdd)
      if (!this.isAdd) {
        update(data).then(() => {
          this.query()
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        })
      } else {
        console.log(data, '33333333')
        add(data).then(() => {
          console.log(data, '44444444')
          this.query()
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        })
      }
      // this.refreshForm();
      this.dialogFormVisible2 = false
    },
    cancel() {
      console.log('5555')
      // if (this.$refs[formName] !== undefined) {
      //   this.$refs[formName].resetFields();
      // }
      this.refreshForm()
      this.dialogFormVisible2 = false
    },
    rowUpdate(row, index, loading, done) {
      update(row).then(
        () => {
          loading()
          this.query()
          this.cancel()
          alert(123)
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        },
        error => {
          done()
          console.log(error)
        }
      )
    },
    rowDel(row) {
      console.log(row, 'dsfs')
      this.$confirm('确定将选择数据删除?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          return remove(row.quotaIndexNum)
        })
        .then(() => {
          this.query()
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        })
    },
    toUsable(row) {
      this.$confirm('确定将选择数据启用?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          return usable(row.quotaIndexNum)
        })
        .then(() => {
          this.query()
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        })
    },
    toUnUsable(row) {
      this.$confirm('确定将选择数据启用?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          return unusable(row.quotaIndexNum)
        })
        .then(() => {
          this.query()
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        })
    },
    handleDelete() {
      if (this.selectionList.length === 0) {
        this.$message.warning('请选择至少一条数据')
        return
      }
      this.$confirm('确定将选择数据删除?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          return remove(this.quotaIndexNums)
        })
        .then(() => {
          this.query()
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.$refs.crud.toggleSelection()
        })
    },
    beforeOpen(done, type) {
      if (['edit', 'view'].includes(type)) {
        getDetail(this.form.quotaIndexNum).then(res => {
          this.form = res.data.data
        })
      }
      done()
    },
    selectionChange(list) {
      this.selectionList = list
    },
    selectionClear() {
      this.selectionList = []
      this.$refs.crud.toggleSelection()
    },
    // 点击新增按钮调用事件
    handleAdd() {
      // this.form = "";
      this.setAllCheckedFalse()
      this.quotaIndexType_2 = false
      this.quotaIndexType_1 = false
      this.quotaIndexType_3 = false
      this.msgCheck = false
      this.isDisabled = false
      this.isViewOrModify = false
      this.isAdd = true
      this.dialogFormVisible2 = true
      this.form.quotaIndexRange = true
      // console.log(this.form.quotaIndexRange, "this.form.quotaIndexRange");
      this.isCheck(this.form.quotaIndexRange)
      // console.log(this.selectDisabled_4, "selectDisabled_4");
      // console.log(this.form.quotaIndexType, "quotaIndexType");
      console.log(this.quotaIndexType_1)
    },
    handleChange1(value) {
      this.rangeRegionContent = value.join(' / ')
    },
    handleChange2(value) {
      // rangeCustomerContent
      // this.rangeCustomerContent = value;
      //  getDictionary({ code: "range_customer2", dictKey:value}).then(response => {
      //    console.log(response,"898989")
      //   });
      console.log(value, 'value')
      if (value == null || value == '') {
        this.rangeCustomerContent = ''
      } else {
        getDict2('CD000212', value).then(response => {
          console.log(response.data.data[0].dictKey, '898989')
          this.rangeCustomerContent = response.data.data[0].dictKey
        })
      }
    },
    handleChange3(value) {
      this.rangerRiskMitigationContent = value.join(' / ')
    },
    handleChange4(value) {
      this.currencyContent = value.join(' / ')
    },
    handleChange6(value) {
      console.log(value)
      this.rangeCountryContent = value.join(' / ')
    },
    handleChange5(value) {
      this.rangeIndustryContent = value.join(' / ')
    },
    handleChange7(value) {
      this.rangeProductContent = value.join(' / ')
    },
    handleChange8(value) {
      this.businessTypeContent = value.join(' / ')
    },
    handleChange9(value) {
      // this.rangeTermContent = value;
      if (this.form.quotaIndexType == '2') {
        for (let index = 0; index < this.rangeTermSelections.length; index++) {
          const element = this.rangeTermSelections[index]
          if (parseInt(value) == parseInt(element.dictKey)) {
            this.rangeTermContent = element.dictValue
          }
        }
      }
    },

    // handleChange9(value) {
    //   this.bussSceneContent = value.join(" / ");
    // },

    showEle(value) {
      console.log(value, '5464565')
      console.log(this.form.quotaIndexType, '5464fbajkbfkajbfka565')
      this.showElement(value, this)
    },
    // 点击查看触发的事件
    handleView(row) {
      this.msgCheck = true
      this.checkedDisabled = true
      this.setAllSelectTrue()
      this.isDisabled = true
      this.isViewOrModify = true
      this.isAdd = true
      this.showElement(row.quotaIndexType, this)
      getDetail(row.quotaIndexNum).then(res => {
        this.form = res.data.data
        const data = res.data.data
        if (data.quotaIndexRange == '1') {
          this.form.quotaIndexRange = true
        } else if (data.quotaIndexRange == '') {
          this.form.quotaIndexRange = false
        }
        this.form.rangeRegion =
          data.rangeRegion && data.rangeRegion != 'undefined'
            ? data.rangeRegion.split(',')
            : data.rangeRegion
        this.form.rangeCustomer = data.rangeCustomer[0]
        this.form.rangerRiskMitigation =
          data.rangerRiskMitigation && data.rangerRiskMitigation != 'undefined'
            ? data.rangerRiskMitigation.split(',')
            : data.rangerRiskMitigation
        this.form.currency =
          data.currency && data.currency != 'undefined'
            ? data.currency.split(',')
            : data.currency

        this.form.rangeIndustry =
          data.rangeIndustry && data.rangeIndustry != 'undefined'
            ? data.rangeIndustry.split(',')
            : data.rangeIndustry
        this.form.rangeCountry =
          data.rangeCountry && data.rangeCountry != 'undefined'
            ? data.rangeCountry.split(',')
            : data.rangeCountry
        this.form.rangeProduct =
          data.rangeProduct && data.rangeProduct != 'undefined'
            ? data.rangeProduct.split(',')
            : data.rangeProduct
        this.form.businessType =
          data.businessType && data.businessType != 'undefined'
            ? data.businessType.split(',')
            : data.businessType
        this.form.rangeTerm = data.rangeTerm[0]
        if (this.form.rangeCountry.length === '0') {
          this.form.rangeCountry = ['156']
        }
        if (this.form.currency.length === '0') {
          this.form.currency = ['156']
        }
        if (!this.form.rangeRegion == '') {
          this.form.check_1 = true
        }
        if (!this.form.rangeCustomer == '') {
          this.form.check_2 = true
        }
        if (!this.form.rangerRiskMitigation == '') {
          this.form.check_3 = true
        }
        if (!this.form.currency == '') {
          this.form.check_4 = true
        }
        if (!this.form.rangeIndustry == '') {
          this.form.check_5 = true
        }
        if (!this.form.rangeCountry == '') {
          this.form.check_6 = true
        }
        if (!this.form.rangeProduct == '') {
          this.form.check_7 = true
        }
        if (!this.form.businessType == '') {
          this.form.check_8 = true
        }
        if (!this.form.rangeTerm == '') {
          this.form.check_9 = true
        }
        this.dialogFormVisible2 = true
      })
    },
    //点击修改触发的事件
    handleEdit(row) {
      this.checkedDisabled = false
      this.msgCheck = true
      this.isDisabled = false
      this.isViewOrModify = false
      this.isAdd = false
      this.showElement(row.quotaIndexType, this)
      getDetail(row.quotaIndexNum).then(res => {
        this.form = res.data.data
        const data = res.data.data
        console.log(data.quotaIndexType, 'data.quotaIndexType')
        if (data.quotaIndexRange == '1') {
          this.form.quotaIndexRange = true
        } else if (data.quotaIndexRange == '') {
          this.form.quotaIndexRange = false
        }
        this.form.rangeRegion =
          data.rangeRegion && data.rangeRegion != 'undefined'
            ? data.rangeRegion.split(',')
            : data.rangeRegion
        this.form.rangeCustomer = data.rangeCustomer[0]
        this.form.rangerRiskMitigation =
          data.rangerRiskMitigation && data.rangerRiskMitigation != 'undefined'
            ? data.rangerRiskMitigation.split(',')
            : data.rangerRiskMitigation
        this.form.currency =
          data.currency && data.currency != 'undefined'
            ? data.currency.split(',')
            : data.currency
        this.form.rangeIndustry =
          data.rangeIndustry && data.rangeIndustry != 'undefined'
            ? data.rangeIndustry.split(',')
            : data.rangeIndustry
        this.form.rangeCountry =
          data.rangeCountry && data.rangeCountry != 'undefined'
            ? data.rangeCountry.split(',')
            : data.rangeCountry
        this.form.rangeProduct =
          data.rangeProduct && data.rangeProduct != 'undefined'
            ? data.rangeProduct.split(',')
            : data.rangeProduct
        this.form.businessType =
          data.businessType && data.businessType != 'undefined'
            ? data.businessType.split(',')
            : data.businessType
        this.form.rangeTerm = data.rangeTerm[0]
        if (this.form.rangeCountry.length === '0') {
          this.form.rangeCountry = ['156']
        }
        if (this.form.currency.length === '0') {
          this.form.currency = ['156']
        }
        if (!this.form.rangeRegion == '') {
          this.form.check_1 = true
          this.selectDisabled_1 = false
        }
        if (!this.form.rangeCustomer == '') {
          this.form.check_2 = true
          this.selectDisabled_2 = false
        }
        if (!this.form.rangerRiskMitigation == '') {
          this.form.check_3 = true
          this.selectDisabled_3 = false
        }
        if (!this.form.currency == '') {
          this.form.check_4 = true
          this.selectDisabled_4 = false
        }
        if (!this.form.rangeIndustry == '') {
          this.form.check_5 = true
          this.selectDisabled_5 = false
        }
        if (!this.form.rangeCountry == '') {
          this.form.check_6 = true
          this.selectDisabled_6 = false
        }
        if (!this.form.rangeProduct == '') {
          this.form.check_7 = true
          this.selectDisabled_7 = false
        }
        if (!this.form.businessType == '') {
          this.form.check_8 = true
          this.selectDisabled_8 = false
        }
        if (!this.form.rangeTerm == '') {
          this.form.check_9 = true
          this.selectDisabled_9 = false
        }
        this.dialogFormVisible2 = true
        console.log('222', this.form.rangeCustomer)
      })
      console.log('ggh', this.rangeCustomerSelections, this.form.rangeCustomer)
    },

    //进入dialog框：判断全部维度是否选中，若选中则下部select框禁用，select框之前的多选框全部不选中。
    //1、新增：进入默认全部维度选中，即checked = true，没有其他的判断
    //2、详情：根据新增给的结果进行判断，但是全部是不可选的
    //3、修改：同详情，但是select框和前面多选框可以操作。
    //ps:当多选框没有选中，后面的select框为disable
    isCheck(checked) {
      if (checked) {
        this.setAllSelectTrue()
      }
    },
    //点击多选框控制后面select下拉框的是否只读(9个方法均是)，待优化
    //当多选框任何一个被选中以后，全部维度选框变为不勾选（默认勾选）
    changeSelect_1() {
      if (this.form.check_1) {
        //当被“打钩”
        this.selectDisabled_1 = false //后续select下拉框非只读
        this.form.quotaIndexRange = false //全部维度取消“打钩”
      } else {
        //“打钩”取消
        this.selectDisabled_1 = true //后续select下拉框只读
        this.form.rangeRegion = '' //清空select下拉框中的内容
        this.rangeRegionContent = '' //清空限额指标内容
        this.checkAllNoChoose()
      }
      console.log(this.form.check_1, 'this.form.check_1')
      console.log(this.selectDisabled_1, 'this.selectDisabled_1')
    },
    changeSelect_2() {
      if (this.form.check_2) {
        this.selectDisabled_2 = false
        this.form.quotaIndexRange = false
      } else {
        this.selectDisabled_2 = true
        this.form.rangeCustomer = ''
        this.rangeCustomerContent = ''
        this.checkAllNoChoose()
      }
    },
    changeSelect_3() {
      if (this.form.check_3) {
        this.selectDisabled_3 = false
        this.form.quotaIndexRange = false
      } else {
        this.selectDisabled_3 = true
        this.form.rangerRiskMitigation = ''
        this.rangerRiskMitigationContent = ''
        this.checkAllNoChoose()
      }
    },
    changeSelect_4() {
      if (this.form.check_4) {
        this.selectDisabled_4 = false
        this.form.quotaIndexRange = false
      } else {
        this.selectDisabled_4 = true
        this.form.currency = ''
        this.currencyContent = ''
        this.checkAllNoChoose()
      }
    },
    changeSelect_5() {
      if (this.form.check_5) {
        this.selectDisabled_5 = false
        this.form.quotaIndexRange = false
        this.selprops.disabled = false
      } else {
        this.selprops.disabled = true
        this.selectDisabled_5 = true
        this.form.rangeIndustry = ''
        this.rangeIndustryContent = ''
        this.checkAllNoChoose()
      }
    },
    changeSelect_6() {
      if (this.form.check_6) {
        this.selectDisabled_6 = false
        this.form.quotaIndexRange = false
      } else {
        this.selectDisabled_6 = true
        this.form.rangeCountry = ''
        this.rangeCountryContent = ''
        this.checkAllNoChoose()
      }
    },
    changeSelect_7() {
      if (this.form.check_7) {
        this.selectDisabled_7 = false
        this.form.quotaIndexRange = false
      } else {
        this.selectDisabled_7 = true
        this.form.rangeProduct = ''
        this.rangeProductContent = ''
        this.checkAllNoChoose()
      }
    },
    changeSelect_8() {
      if (this.form.check_8) {
        this.selectDisabled_8 = false
        this.form.quotaIndexRange = false
      } else {
        this.selectDisabled_8 = true
        this.form.businessType = ''
        this.businessTypeContent = ''
        this.checkAllNoChoose()
      }
    },
    changeSelect_9() {
      if (this.form.check_9) {
        this.selectDisabled_9 = false
        this.form.quotaIndexRange = false
      } else {
        this.selectDisabled_9 = true
        this.form.rangeTerm = ''
        this.rangeTermContent = ''
        this.checkAllNoChoose()
      }
    },
    //判断：当同业和非同业限额指标时，维度下没有多选框勾选的时候，全部维度“打钩”
    checkAllNoChoose() {
      if (this.form.quotaIndexType == 1) {
        //同业
        console.log(this.form.check_4, this.form.check_8)
        if (
          (this.form.check_4 == false || this.form.check_4 === undefined) &&
          (this.form.check_8 == false || this.form.check_8 === undefined)
        ) {
          this.form.quotaIndexRange = true
        }
      } else if (this.form.quotaIndexType == 2) {
        //非同业
        if (
          (this.form.check_1 == false || this.form.check_1 === undefined) &&
          (this.form.check_2 == false || this.form.check_2 === undefined) &&
          (this.form.check_3 == false || this.form.check_3 === undefined) &&
          (this.form.check_4 == false || this.form.check_4 === undefined) &&
          (this.form.check_5 == false || this.form.check_5 === undefined) &&
          (this.form.check_6 == false || this.form.check_6 === undefined) &&
          (this.form.check_7 == false || this.form.check_7 === undefined) &&
          (this.form.check_9 == false || this.form.check_9 === undefined)
        ) {
          console.log('22222')
          this.form.quotaIndexRange = true
        }
      }
      console.log(this.form.quotaIndexRange, 'this.form.quotaIndexRange')
    },
    //将所有的维度多选框变为“不打勾”
    setAllCheckedFalse() {
      this.form.check_1 = false
      this.form.check_2 = false
      this.form.check_3 = false
      this.form.check_4 = true
      this.form.check_5 = false
      this.form.check_6 = true
      this.form.check_7 = false
      this.form.check_8 = false
      this.form.check_9 = false
    },
    //将所有维度select下拉框设为只读
    setAllSelectTrue() {
      this.form.check_1 = false
      this.form.check_2 = false
      this.form.check_3 = false
      this.form.check_4 = true
      this.form.check_5 = false
      this.form.check_6 = true
      this.form.check_7 = false
      this.form.check_8 = false
      this.form.check_9 = false
    },

    getDicAndload(obj) {
      obj.computingMethodSelections1 = [
        { dictKey: '4', dictValue: '业务发生金额' }
      ]

      obj.computingMethodSelections2 = [
        { dictKey: '1', dictValue: '统计口径/资本净额' },
        { dictKey: '2', dictValue: '统计口径/一级资本净额' },
        { dictKey: '3', dictValue: '统计口径/我行授信总额' }
      ]

      obj.quotaIndexCaliberSelections1 = [
        { dictKey: '4', dictValue: '业务发生金额' }
      ]
      obj.quotaIndexCaliberSelections2 = [
        { dictKey: '1', dictValue: '贷款敞口余额' },
        { dictKey: '2', dictValue: '授信敞口余额' },
        { dictKey: '3', dictValue: '批复敞口金额' }
      ]
      obj.rangeCustomerSelections1 = [{ dictKey: '3', dictValue: '同业客户' }]
      obj.rangeCustomerSelections2 = [
        { dictKey: '1', dictValue: '对公客户' },
        { dictKey: '2', dictValue: '个人客户' }
      ]
      obj.computingTargetSelections1 = [
        { dictKey: '1', dictValue: '大额风险暴露' },
        { dictKey: '2', dictValue: '匿名客户风险暴露' }
      ]
      obj.computingTargetSelections2 = [
        { dictKey: '1', dictValue: '最大非同业单一客户' },
        { dictKey: '2', dictValue: '最大非同业单一集团' },
        { dictKey: '3', dictValue: '单一关联客户' },
        { dictKey: '4', dictValue: '单一关联方所在集团客户' },
        { dictKey: '5', dictValue: '最大十家单一客户' },
        { dictKey: '6', dictValue: '最大十家集团客户' },
        { dictKey: '7', dictValue: '全部客户汇总' },
        { dictKey: '8', dictValue: '全部关联客户汇总' }
      ]
      // getDictionary({ code: "ranger_risk_mitigation" }).then(response => {
      //   obj.rangerRiskMitigationSelections = response.data.data;
      // });
      getDictionary('CD000257').then(response => {
        obj.rangeRegionSelections = response.data.data
      })
      getDictionary('CD000100').then(response => {
        obj.rangerRiskMitigationSelections = response.data.data
      })
      getDictionary('CD000252').then(response => {
        obj.quotaTypeSelections = response.data.data
      })
      getDictionary('CD000253').then(response => {
        obj.quotaIndexTypeSelections = response.data.data
      })
      getDictionary('CD000254').then(response => {
        obj.quotaIndexStateSelections = response.data.data
      })
      getDictionary('CD000019').then(response => {
        obj.currencySelections = dictionary('currency', response.data.data)
      })
      getDictionary('CD000210').then(response => {
        obj.rangeTermSelections = response.data.data
      })
      getDictionary('CD000001').then(response => {
        obj.rangeCountrySelections = dictionary(
          'rangeCountry',
          response.data.data
        )
      })
      getDictionary('CD000015').then(response => {
        obj.rangeIndustrySelections = getListData(
          Object.assign([], response.data.data)
        )
        console.log(response.data.data)
      })
      getDictionary('CD000061').then(response => {
        obj.businessTypeSelections = response.data.data
      })
      dictTranslate('CD000253').then(res => {
        this.quotaIndexTypeCols = res.data.data
        this.lookRuleForm.quotaType = this.certTypeDict[
          this.lookRuleForm.quotaType
        ]
      })
      dictTranslate('CD000252').then(res => {
        this.quotaTypeCols = res.data.data
        this.lookRuleForm.quotaIndexType = this.certTypeDict[
          this.lookRuleForm.quotaIndexType
        ]
      })
      dictTranslate('CD000254').then(res => {
        this.quotaIndexStateCols = res.data.data
        this.lookRuleForm.quotaIndexState = this.certTypeDict[
          this.lookRuleForm.quotaIndexState
        ]
      })
    },

    showElement(value, ele) {
      console.log('111', value)
      var val = ''
      if (value == 1) {
        //同业
        val = '2'
        ele.quotaIndexType_1 = false
        ele.quotaIndexType_2 = true
        ele.quotaIndexType_3 = true
        this.setAllCheckedFalse()
        this.form.quotaIndexRange = true
        this.selectDisabled_4 = true
        ele.computingMethodSelections = ele.computingMethodSelections1
        ele.quotaIndexCaliberSelections = ele.computingMethodSelections1
        ele.rangeCustomerSelections = ele.rangeCustomerSelections1
        ele.computingTargetSelections = ele.computingTargetSelections1
      } else if (value == 2) {
        //非同业
        val = '1'
        ele.quotaIndexType_1 = true
        ele.quotaIndexType_2 = false
        ele.quotaIndexType_3 = true
        this.setAllCheckedFalse()
        this.form.quotaIndexRange = true
        this.selectDisabled_4 = true
        ele.computingMethodSelections = ele.computingMethodSelections2
        ele.quotaIndexCaliberSelections = ele.quotaIndexCaliberSelections2
        ele.rangeCustomerSelections = ele.rangeCustomerSelections2
        ele.rangeRegionSelections = ele.rangeRegionSelections
        ele.rangerRiskMitigationSelections = ele.rangerRiskMitigationSelections
        ele.computingTargetSelections = ele.computingTargetSelections2
        console.log('111', this.form)
        if (!this.form.rangeCountry || this.form.rangeCountry.length === '0') {
          this.form.rangeCountry = ['156']
        }
      }
      console.log('222', this.form)
      if (!this.form.currency || this.form.currency.length === '0') {
        this.form.currency = ['156']
      }

      product(val).then(res => {
        this.rangeProductSelections = res.data.data
        console.log(this.rangeProductSelections)
      })
      console.log(ele.quotaIndexType_1)
    }
  }
}
</script>

<style lang="scss" scoped>
.search /deep/ {
  .el-form {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    margin-top: 1vh;
  }
}
.content {
  margin-top: 1vh;
}
.el-select {
  display: block;
}
.pageination {
  float: right;
  padding: 2vh 0;
}
</style>
