<template>
  <div class="dialog">
    <el-dialog :title="title"  v-loading="loading" :close-on-click-modal="false" :append-to-body="true" :lock-scroll="false" :visible.sync="dialogStatus" width="60%" @close='hideDialog'>
      <el-form :model="form" :disabled="actionType=='view'" ref="form" label-width="120px" :rules="rules" size="small">
        <el-row>
          <el-col :span="4" :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="限额指标名称" prop="quotaIndexName">
              <el-input v-model="form.quotaIndexName" maxlength="200" placeholder="限额指标名称" size="small" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="4" :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="限额指标类型" prop="quotaIndexType">
              <el-select :disabled="actionType!='add'" v-model="form.quotaIndexType" placeholder="请选择" style="width:100%" clearable @change="showEle">
                <el-option v-for="(item,i) in quotaIndexTypeData" :key="i" :label="item.dictValue" :value="item.dictKey"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4" :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="限额类型" prop="quotaType">
              <el-select v-model="form.quotaType" placeholder="请选择" style="width:100%" clearable>
                <el-option v-for="(item,i) in quotaTypeData" :key="i" :label="item.dictValue" :value="item.dictKey"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4" :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="限额计算方式" prop="computingMethod">
              <el-select v-model="form.computingMethod" style="width:100%" placeholder="请选择">
                <el-option v-for="(item,i) in computingMethodSelections" :key="i" :label="item.dictValue" :value="item.dictKey"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4" :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="统计口径" prop="quotaIndexCaliber">
              <el-select v-model="form.quotaIndexCaliber" style="width:100%" placeholder="请选择">
                <el-option v-for="(item,i) in quotaIndexCaliberSelections" :key="i" :label="item.dictValue" :value="item.dictKey"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4" :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="限额计算对象" prop="computingTarget">
              <el-select v-model="form.computingTarget" style="width:100%" placeholder="请选择">
                <el-option v-for="(item,i) in computingTargetSelections" :key="i" :label="item.dictValue" :value="item.dictKey"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-form-item label="分析维度范围">
              <el-checkbox v-model="allChecked" @change="switchAllClose">
                <span style="color:#b0b0b0">全部维度</span>
              </el-checkbox>
              <span>默认不过滤，所有业务需要检查</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10" class="veidoo">
          <el-col v-for="(myitem) in indicatorsSpecies" style="padding-left:5px" v-show="myitem.show" :key="myitem.code" :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label-width="50px" v-show="myitem.show">
              <el-switch v-model="myitem.checkedEnable" @change="((val)=>{switchChange(val, myitem)})"></el-switch>
              <multiple-tree-select v-if="myitem.treeSelect" style="width:85%" :disabled="!myitem.checkedEnable" :placeholder="myitem.name" :props="myitem.props" :options="myitem.data" :value="myitem.select" :clearable="myitem.isClearable" :accordion="myitem.isAccordion" @getValue="getValue($event,myitem)" />
              <el-select v-else style="width:85%" v-model="myitem.select" :disabled="!myitem.checkedEnable" multiple :placeholder="myitem.name" @change="((val)=>{changeSelect(val, myitem)})" clearable>
                <el-option v-for="(item,i) in myitem.data" :key="i" :label="item.dictValue" :value="item.dictKey"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-form-item label="限额指标" style="width:100%">
              <span v-for="(myitem) in indicatorsSpecies" :key="myitem.code">
                <span v-if="myitem.show" class="el-tag el-tag--info el-tag--small el-tag--light" style="margin-right:5px">
                  <span class="el-select__tags-text">{{myitem.name}}：{{myitem.selectText}}</span>
                </span>
              </span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-form-item label="补充说明">
              <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="form.explainInfo"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="actionType!='add'">
          <el-col :span="4" :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <span style="padding-left:50px">维护人: </span>
            <span class="el-tag el-tag--info el-tag--small el-tag--light" style="margin-right:5px;wdith:200px"> {{form.userNum}}</span>
          </el-col>
          <el-col style="test-align:center" :span="4" :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            维护机构:
            <span class="el-tag el-tag--info el-tag--small el-tag--light" style="margin-right:5px;wdith:200px">{{form.orgNum}}</span>
          </el-col>
          <el-col style="test-align:center" :span="4" :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            维护时间:
            <span class="el-tag el-tag--info el-tag--small el-tag--light" style="margin-right:5px;wdith:200px">{{form.updateTime}}</span>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button icon="el-icon-close" size="small" @click="cencel()">取 消</el-button>
        <el-button icon="el-icon-check" v-if="actionType!='view'" type="primary" :loading="loading" size="small" @click="save()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import common from '@/config/common.json'
import { dictionary } from '@/utils/filter.js'
import { getDictionary, getDictionarys, product, getDictTreeByCode } from '@/api/system/dict'
import MultipleTreeSelect from '@/components/TreeSelect/MultipleTreeSelect'
import { getDetail, add, update } from '@/api/quota/rcmConfigurationQuota/rcmConfigurationQuota'
import { debuglog } from 'util'

export default {
  name: 'rcmConfigurationQuotaDetail',
  components: { MultipleTreeSelect },
  data() {
    return {
      actionType: '',
      title: '',
      loading:false,
      form: {},
      rules: {
        quotaIndexName: [{ required: true, message: '限额指标名称', trigger: 'blur' }],
        quotaIndexType: [{ required: true, message: '限额指标类型', trigger: 'blur' }],
        quotaType: [{ required: true, message: '限额类型', trigger: 'blur' }],
        computingMethod: [{ required: true, message: '限额计算方式', trigger: 'change' }],
        quotaIndexCaliber: [{ required: true, message: '统一口径', trigger: 'change' }],
        computingTarget: [{ required: true, message: '限额计算对象', trigger: 'change' }]
      },
      allChecked: false,
      loading: false,
      dialogStatus: false,
      checkedEnable: false,
      rangeRegionSelections: [],
      quotaTypeData: [],
      quotaIndexTypeData: [],
      computingMethodSelections: [],
      computingMethodSelections1: [
        { dictKey: '1', dictValue: '统计口径/资本净额' },
        { dictKey: '2', dictValue: '统计口径/一级资本净额' },
        { dictKey: '3', dictValue: '统计口径/我行授信总额' },
        { dictKey: '4', dictValue: '业务发生金额' }
      ],
      computingMethodSelections2: [{ dictKey: '4', dictValue: '业务发生金额' }],
      computingTargetSelections: [
        { dictKey: '1', dictValue: '最大非同业单一客户' },
        { dictKey: '2', dictValue: '最大非同业单一集团' },
        { dictKey: '3', dictValue: '单一关联客户' },
        { dictKey: '4', dictValue: '单一关联方所在集团客户' },
        { dictKey: '5', dictValue: '最大十家单一客户' },
        { dictKey: '6', dictValue: '最大十家集团客户' },
        { dictKey: '7', dictValue: '全部客户汇总' },
        { dictKey: '8', dictValue: '全部关联客户汇总' }
      ],
      quotaIndexCaliberSelections: [],
      quotaIndexCaliberSelections1: [
        { dictKey: '1', dictValue: '贷款敞口余额' },
        { dictKey: '2', dictValue: '授信敞口余额' },
        { dictKey: '3', dictValue: '批复敞口金额' }
      ],
      quotaIndexCaliberSelections2: [{ dictKey: '4', dictValue: '业务发生金额' }],
      quotaIndexStateData: [],
      dictData: null,
      rangeIndustryData: [],
      indicatorsSpeciesRow: {},
      indicatorsSpecies: [
        {
          name: '区域',
          code: 'rangeRegion',
          select: {},
          data: [],
          dictCode: 'CD000257',
          show: false,
          checkedEnable: false
        },
        {
          name: '客户类型',
          code: 'rangeCustomer',
          select: {},
          data: [],
          dictCode: '',
          show: false,
          checkedEnable: false
        },
        {
          name: '风险缓释',
          code: 'rangerRiskMitigation',
          select: {},
          data: [],
          dictCode: 'CD000100',
          show: false,
          checkedEnable: false
        },
        {
          name: '币种',
          code: 'currency',
          select: {},
          data: [],
          dictCode: 'CD000019',
          show: false,
          checkedEnable: false
        },
        {
          name: '行业',
          code: 'rangeIndustry',
          props: {
            value: 'id',
            label: 'title',
            children: 'children',
            isClearable: true, // 可清空（可选）
            isAccordion: true, // 可收起（可选）
            disabled: false,
            width: '84%',
            multiple: true
          },
          select: [],
          data: [],
          treeSelect: true,
          dictCode: 'CD000015',
          show: false,
          checkedEnable: false
        },
        {
          name: '国别',
          code: 'rangeCountry',
          select: {},
          data: [],
          dictCode: 'CD000001',
          show: false,
          checkedEnable: false
        },
        {
          name: '产品',
          code: 'rangeProduct',
          select: {},
          data: [],
          dictCode: '',
          show: false,
          checkedEnable: false
        },
        {
          name: '业务种类',
          code: 'businessType',
          select: {},
          data: [],
          dictCode: 'CD000061',
          show: false,
          checkedEnable: false
        },
        {
          name: '期限',
          code: 'rangeTerm',
          select: {},
          data: [],
          dictCode: 'CD000210',
          show: false,
          checkedEnable: false
        }
      ]
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      //获取数据字典
    },
    getValue(val, item) {
      let value = []
      let title = []
      if (val) {
        val.forEach(v => {
          value.push(v.id)
          title.push(v.title)
        })
      }
      item.selectText = title.join(' / ')
      item.select = value
    },
    switchChange(value, item) {
      if (!value) {
        item.select = []
        item.selectText = ''
      } else {
        this.allChecked = false
      }
    },
    switchAllClose(value) {
      if (value) {
        this.indicatorsSpecies.forEach(item => {
          item.checkedEnable = false
          item.select = []
          item.selectText = ''
        })
      }
    },
    changeSelect(value, item) {
      let res = []
      let data = item.data
      if (item.dictCode == 'CD000015') {
        data = this.dictData[item.dictCode]
      }
      if (data != null) {
        data.forEach(node => {
          if (value != null) {
            value.forEach(v => {
              if (item.dictCode == 'CD000015') {
                if (node.id == v) {
                  res.push(node.dictValue)
                }
              } else {
                if (node.dictKey == v) {
                  res.push(node.dictValue)
                }
              }
            })
          }
        })
      }
      item.selectText = res.join(' / ')
    },
    showDialog(actionType, quotaIndexNum, quotaTypeData, quotaIndexTypeData, quotaIndexStateData) {
      this.loading = true;
      this.quotaTypeData = quotaTypeData
      this.quotaIndexTypeData = quotaIndexTypeData
      this.quotaIndexStateData = quotaIndexStateData
      this.actionType = actionType
      this.title = common[actionType]
      if (this.dictData == null) {
        let dictCodes = []
        this.indicatorsSpecies.forEach((item, i) => {
          if (item.dictCode != null && item.dictCode != '') {
            dictCodes.push(item.dictCode)
          }
        })
        getDictionarys(dictCodes.join(',')).then(res => {
          this.dictData = res.data.data
          getDictTreeByCode('CD000015').then(res => {
            this.rangeIndustryData = res.data.data
            this.loadFormData(quotaIndexNum)
            this.loading = false
          })
        })
      } else {
        this.loadFormData(quotaIndexNum)
        this.loading = false
      }
      this.dialogStatus = true
    },
    loadFormData(quotaIndexNum) {
      if (quotaIndexNum!= null && quotaIndexNum != '') {
        getDetail(quotaIndexNum).then(res => {
          this.form = res.data.data
          this.showEle()
        })
      } 
    },
    hideDialog() {
      this.dialogStatus = false
      this.$nextTick(() => {
        this.$refs['form'].clearValidate()
        this.indicatorsSpecies.forEach(item => {
          item.checkedEnable = false
          item.show = false
          item.select = []
          item.selectText = ''
        })
        this.form = {}
      })
    },
    loadSelectIndexData(quotaIndexType) {
      this.indicatorsSpecies.forEach(item => {
        if (item.show) {
          if (item.data == null || item.data.length == 0) {
            if (item.dictCode == 'CD000019') {
              //过滤币种
              item.data = dictionary('currency', this.dictData[item.dictCode])
            } else if (item.dictCode == 'CD000001') {
              //过滤
              item.data = dictionary('rangeCountry', this.dictData[item.dictCode])
            } else if (item.dictCode == 'CD000015') {
              //获取行业树
              item.data = this.rangeIndustryData
            } else {
              item.data = this.dictData[item.dictCode]
            }
          }
          if (item.code == 'rangeCustomer') {
            //客户类型
            if (quotaIndexType == '1') {
              //同业
              item.data = [{ dictKey: '3', dictValue: '同业客户' }]
            } else {
              //非同业
              item.data = [{ dictKey: '1', dictValue: '对公客户' }, { dictKey: '2', dictValue: '个人客户' }]
            }
            this.initQutaoIndexTranslate(item)
          } else if (item.code == 'rangeProduct') {
            //产品
            product(this.form.quotaIndexType).then(res => {
              item.data = []
              res.data.data.forEach(d => {
                item.data.push({
                  dictKey: d.productNum,
                  dictValue: d.productName
                })
              })
              this.initQutaoIndexTranslate(item)
            })
          } else {
            this.initQutaoIndexTranslate(item)
          }
        }
      })
    },
    initQutaoIndexTranslate(item) {
      if (this.form[item.code]) {
        item.select = this.form[item.code].split(',')
        item.checkedEnable = true
        this.changeSelect(item.select, item)
      } else {
        item.select = []
      }
    },
    showEle() {
      if (this.form.quotaIndexType == '1') {
        //渲染组件
        this.indicatorsSpecies.forEach(item => {
          item.checkedEnable = false
          item.select = []
          item.selectText = ''
          item.show = item.code == 'businessType' || item.code == 'currency'
        })
        //同业
        this.computingMethodSelections = this.computingMethodSelections2
        this.quotaIndexCaliberSelections = this.quotaIndexCaliberSelections2
      } else {
        this.indicatorsSpecies.forEach(item => {
          item.checkedEnable = false
          item.select = []
          item.selectText = ''
          item.show = item.code != 'businessType'
        })
        //非同业
        this.computingMethodSelections = this.computingMethodSelections1
        this.quotaIndexCaliberSelections = this.quotaIndexCaliberSelections1
      }
      //组件装载数据
      this.$nextTick(() => this.loadSelectIndexData(this.form.quotaIndexType))
    },
    cencel() {
      this.hideDialog()
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.indicatorsSpecies.forEach(item => {
            if (item.select != null && item.select.length > 0) {
              this.form[item.code] = item.select.join(',')
            }else{
               this.form[item.code] = ""
            }
          })
          this.form['quotaIndexState'] = '1'
          if (this.actionType == 'add') {
            add(this.form).then(() => {
              this.$message({
                type: 'success',
                message: '操作成功!'
              })
              this.$emit('afterSave')
              this.hideDialog()
            })
          } else {
            update(this.form).then(() => {
              this.$message({
                type: 'success',
                message: '操作成功!'
              })
              this.$emit('afterSave')
              this.hideDialog()
            })
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-dialog__wrapper /deep/ {
  .el-dialog {
    .el-dialog__body {
      .el-form {
        .veidoo {
          display: flex;
          justify-content: flex-start;
          flex-wrap: wrap;
        }
      }
    }
  }
}
</style>