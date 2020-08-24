<!-- 限额管理-- 限额设置页面 -->
<template>
  <div class="container">
    <!-- 搜索区内容 useOrgNum: null, quotaState: null, quotaName: null, quotaIndexName: null, quotaType: null-->
    <el-form :inline="true" ref="searchForm" :model="searchForm" class="ruleForm" size="small">
      <el-form-item label="生效机构" prop="useOrgNum">
        <!-- <el-select v-model="searchForm.useOrgName" placeholder="请选择当前机构" size="small">
          <el-option :value="searchForm.useOrgName" style="height: auto">
            <el-input placeholder="输入关键字进行搜索" v-model="filterText"></el-input>
            <el-tree class="filter-tree" :data="orgData" :props="defaultProps" :filter-node-method="filterNode" ref="orgTree"
              @node-click="searchFormHandleNodeClick"></el-tree>
          </el-option>
        </el-select> -->

         <el-select v-if="!treeIf" v-model="searchForm.useOrgNum" disabled placeholder="请选择">
          <el-option v-for="item in []" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <tree-select v-if="treeIf" ref="treeSelOrg" id="rFuseOrgNum" v-model="searchForm.useOrgNum" :props="props" :options="orgData" :clearable="isClearable"
          :accordion="isAccordion" />

      </el-form-item>
      <el-form-item label="限额名称" prop="quotaName">
        <el-input v-model="searchForm.quotaName" autocomplete="off" clearable></el-input>
      </el-form-item>
      <el-form-item label="限额指标名称" prop="quotaIndexName">
        <el-input v-model="searchForm.quotaIndexName" autocomplete="off" clearable></el-input>
      </el-form-item>
      <el-form-item label="限额类型" prop="quotaType">
        <el-select v-model="searchForm.quotaType" placeholder="请选择" clearable>
          <el-option v-for="item in quotaTypeSelections" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="限额状态" prop="quotaState">
        <el-select v-model="searchForm.quotaState" clearable>
          <el-option v-for="item in quotaStateSelections" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="getTableData">搜索</el-button>
        <el-button icon="el-icon-refresh-right" @click="resetForm('searchForm')">重置</el-button>
        <el-button type="primary" icon="el-icon-plus" size="small" @click="handleAdd">限额设定</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格主要内容 -->
    <el-table :data="tableData" v-loading="loading" border size="small" height="400">
      <el-table-column type="index" label="序号" width="60" :resizable="false" align="center" />
      <el-table-column prop="useOrgNum" label="生效机构" width="100" :resizable="false" align="center">
        <template slot-scope="scope">{{ orgNumDict[scope.row.useOrgNum] }}</template>
      </el-table-column>
      <el-table-column prop="quotaNum" label="集中度限额编号" width="130" :resizable="false" align="center"></el-table-column>
      <el-table-column prop="quotaName" label="限额名称" width="180" :resizable="false" align="center"></el-table-column>
      <el-table-column prop="quotaIndexNum" label="限额指标编号" width="170" :resizable="false" align="center"></el-table-column>
      <el-table-column prop="quotaIndexName" label="限额指标名称" width="170" :resizable="false" align="center"></el-table-column>
      <el-table-column prop="quotaIndexType" label="限额指标类型" width="150" :resizable="false" align="center">
        <template slot-scope="scope">{{ quotaIndexTypeDict[scope.row.quotaIndexType] }}</template>
      </el-table-column>
      <el-table-column prop="quotaType" label="限额类型" :resizable="false" align="center">
        <template slot-scope="scope">{{ quotaTypeDict[scope.row.quotaType] }}</template>
      </el-table-column>
      <el-table-column prop="controlValue" label="控制值" :resizable="false" align="center">
        <template slot-scope="scope">{{scope.row.controlValueType==='1'?scope.row.controlValue:(scope.row.controlValue
          + '%') }}
        </template>
      </el-table-column>
      <el-table-column prop="warnValue" label="预警值" :resizable="false" align="center">
        <template slot-scope="scope">{{scope.row.warnValueType==='1'?scope.row.warnValue:(scope.row.warnValue + '%') }}</template>
      </el-table-column>
      <el-table-column prop="observeValue" label="观察值" :resizable="false" align="center">
        <template slot-scope="scope">{{scope.row.observeValueType==='1'?scope.row.observeValue:(scope.row.observeValue
          + '%') }}
        </template>
      </el-table-column>
      <el-table-column prop="quotaState" label="限额状态" :resizable="false" align="center">
        <template slot-scope="scope">{{ quotaStateDict[scope.row.quotaState] }}</template>
      </el-table-column>

      <el-table-column fixed="right" label="操作" width="260" :resizable="false" align="center">
        <template slot-scope="scope">
          <el-button class="textBtn" type="text" icon="el-icon-view" @click="handleView(scope.row)">详情</el-button>
          <el-button class="textBtn" type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">调整</el-button>
          <el-button class="textBtn" type="text" icon="el-icon-tickets" @click="history(scope.row)">历史</el-button>
          <el-button class="textBtn" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">取消</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页内容 -->
    <el-pagination class="pageination" @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page="page.current" :page-size="page.size" :total="page.total" :page-sizes="[2,5,10]" layout="total, sizes, prev, pager, next, jumper"></el-pagination>

    <!-- 新增弹窗 -->
    <el-dialog title :visible.sync="addDialogFormVisible" @close="cancel" width="84%">
      <div class="dialog2">
        <div>
          <el-form :inline="true" :model="quotaConfigForm" ref="quotaConfigForm" label-width="120px" :rules="quotaConfigFormRules"
            size="small">
            <el-divider content-position="left">关联指标</el-divider>
            <el-row>
              <el-col :span="4" :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                <el-form-item label="额度编号" prop="quotaNum">
                  <el-input v-model="quotaConfigForm.quotaNum" :disabled="true" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4" :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                <el-form-item label="限额名称" prop="quotaName">
                  <el-input v-model="quotaConfigForm.quotaName" :required="true" autocomplete="off" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4" :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                <el-form-item label="限额指标编号" prop="quotaIndexNum">
                  <!-- <el-select v-model="quotaConfigForm.quotaIndexNum" :disabled="quotaIndexNumDisable" autocomplete="off"
                    clearable @change="quotaIndexNumChange">
                    <el-option v-for="item in quotaIndexNumSelections" :key="item.quotaIndexNum" :label="item.quotaIndexNum"
                      :value="item.quotaIndexNum"></el-option>
                  </el-select> -->
                  <el-input v-model="quotaConfigForm.quotaIndexNum" clearable :disabled="true">
                    <el-button slot="append" icon="el-icon-search" @click="chooseQuota" :disabled="false"></el-button>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4" :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                <el-form-item label="限额指标名称" prop="quotaIndexName">
                  <el-input v-model="quotaConfigForm.quotaIndexName" :disabled="true" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4" :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                <el-form-item label="限额指标类型" prop="quotaIndexType">
                  <el-select v-model="quotaConfigForm.quotaIndexType" :disabled="true">
                    <el-option v-for="item in quotaIndexTypeSelections" :key="item.dictKey" :label="item.dictValue"
                      :value="item.dictKey"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="4" :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                <el-form-item label="生效机构" prop="useOrgNum">
                  <!-- <el-select v-model="quotaConfigForm.useOrgName" :disabled="quotaIndexNumDisable" placeholder="请选择当前机构"
                    size="small">
                    <el-option :value="quotaConfigForm.useOrgName" style="height: auto">
                      <el-input placeholder="输入关键字进行搜索" v-model="filterText"></el-input>
                      <el-tree class="filter-tree" :data="orgData" :props="defaultProps" :filter-node-method="filterNode"
                        ref="orgTree" @node-click="HandleNodeClick"></el-tree>
                    </el-option>
                  </el-select> -->

                   <el-select v-if="!treeIf" v-model="quotaConfigForm.useOrgNum" disabled placeholder="请选择">
                      <el-option v-for="item in []" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                    <tree-select v-if="treeIf" v-model="quotaConfigForm.useOrgNum" :props="editProps" :options="orgData" :clearable="isClearable"
                      :accordion="isAccordion"/>
                </el-form-item>
              </el-col>
              <el-col :span="4" :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                <el-form-item label="限额状态" prop="quotaState">
                  <el-select v-model="quotaConfigForm.quotaState" autocomplete="off">
                    <el-option label="未生效" value="0"></el-option>
                    <el-option label="生效" value="1"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-divider content-position="left">阈值设置</el-divider>
            <el-row>
              <el-col :span="4" :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                <el-form-item label="控制值阈值" prop="controlValue">
                  <el-input v-model="quotaConfigForm.controlValue" autocomplete="off" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4" :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                <el-form-item label="阈值类型" prop="controlValueType">
                  <el-select v-model="quotaConfigForm.controlValueType" placeholder="--请选择--">
                    <el-option v-for="item in controllerTypeSelections" :key="item.dictKey" :label="item.dictValue"
                      :value="item.dictKey"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="4" :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                <el-form-item label="控制值管控节点" prop="controlNode">
                  <el-select v-model="quotaConfigForm.controlNode" multiple placeholder="--请选择--" clearable>
                    <el-option v-for="item in controlNodeSelections" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="4" :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                <el-form-item label="应对措施" prop="controlNodeMeasure">
                  <el-select v-model="quotaConfigForm.controlNodeMeasure" placeholder="--请选择--" clearable>
                    <el-option v-for="item in nodeMeasureSelections" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4" :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                <el-form-item label="预警值阈值" prop="warnValue">
                  <el-input v-model="quotaConfigForm.warnValue" autocomplete="off" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4" :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                <el-form-item label="阈值类型" prop="warnValueType">
                  <el-select v-model="quotaConfigForm.warnValueType" placeholder="--请选择--">
                    <el-option v-for="item in controllerTypeSelections" :key="item.dictKey" :label="item.dictValue"
                      :value="item.dictKey"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="4" :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                <el-form-item label="预警值管控节点" prop="warnNode">
                  <el-select v-model="quotaConfigForm.warnNode" multiple placeholder="--请选择--" clearable>
                    <el-option v-for="item in controlNodeSelections" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="4" :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                <el-form-item label="应对措施" prop="warnNodeMeasure">
                  <el-select v-model="quotaConfigForm.warnNodeMeasure" placeholder="--请选择--" clearable>
                    <el-option v-for="item in nodeMeasureSelections" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4" :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                <el-form-item label="观察值阈值" prop="observeValue">
                  <el-input v-model="quotaConfigForm.observeValue" autocomplete="off" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4" :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                <el-form-item label="阈值类型" prop="observeValueType">
                  <el-select v-model="quotaConfigForm.observeValueType" placeholder="--请选择--">
                    <el-option v-for="item in controllerTypeSelections" :key="item.dictKey" :label="item.dictValue"
                      :value="item.dictKey"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="4" :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                <el-form-item label="观察值管控节点" prop="observeNode">
                  <el-select v-model="quotaConfigForm.observeNode" multiple placeholder="--请选择--" clearable>
                    <el-option v-for="item in controlNodeSelections" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="4" :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                <el-form-item label="应对措施" prop="observeNodeMeasure">
                  <el-select v-model="quotaConfigForm.observeNodeMeasure" placeholder="--请选择--" clearable>
                    <el-option v-for="item in nodeMeasureSelections" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-divider content-position="left">管理信息</el-divider>
            <el-row>
              <el-col :span="4" :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                <el-form-item label="维护人" v-if="true" prop="quotaNum">
                  <el-input v-model="quotaConfigForm.userName" autocomplete="off" :disabled="true" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4" :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                <el-form-item label="维护机构" v-if="true" prop="quotaName">
                  <el-input v-model="quotaConfigForm.orgName" autocomplete="off" :disabled="true" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4" :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                <el-form-item label="维护时间" v-if="true">
                  <el-input v-model="quotaConfigForm.updateTime" autocomplete="off" :disabled="true" clearable></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>

        <div slot="footer" class="dialog-footer" v-if="true" align="right">
          <el-button @click="cancel('quotaConfigForm')">取 消</el-button>
          <el-button type="primary" @click="save('add','quotaConfigForm')" :style="{ display: displayBtnSave }">新 增</el-button>
          <el-button type="primary" @click="save('update','quotaConfigForm')" :style="{ display: displayBtnUpdate }">调
            整</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 详情弹窗 -->
    <el-dialog title :visible.sync="viewDialogFormVisible" @close="cancel" width="84%">
      <div class="dialog2">
        <div>
          <el-form :inline="true" :model="quotaConfigForm" ref="quotaConfigForm" label-width="120px" size="small">
            <el-divider content-position="left">关联指标</el-divider>
            <el-row>
              <el-col :span="4" :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                <el-form-item label="集中度额度编号" prop="quotaNum">
                  <el-input v-model="quotaConfigForm.quotaNum" autocomplete="off" :disabled="true" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4" :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                <el-form-item label="限额名称" prop="quotaName">
                  <el-input v-model="quotaConfigForm.quotaName" autocomplete="off" :disabled="true" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4" :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                <el-form-item label="限额指标类型">
                  <el-select v-model="quotaConfigForm.quotaIndexType" autocomplete="off" :disabled="true" clearable>
                    <el-option v-for="item in quotaIndexTypeSelections" :key="item.dictKey" :label="item.dictValue"
                      :value="item.dictKey"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4" :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                <el-form-item label="生效机构">
                  <el-input v-model="quotaConfigForm.useOrgName" :disabled="true" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4" :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                <el-form-item label="限额生效日期">
                  <el-input v-model="quotaConfigForm.startDate" autocomplete="off" :disabled="true" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4" :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                <el-form-item label="限额失效日期">
                  <el-input v-model="quotaConfigForm.invalidDate" autocomplete="off" :disabled="true" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4" :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                <el-form-item label="限额状态">
                  <el-select v-model="quotaConfigForm.quotaState" autocomplete="off" :disabled="true" clearable>
                    <el-option v-for="item in quotaStateSelections" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-divider content-position="left">阈值信息</el-divider>
            <el-row>
              <el-col :span="4" :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                <el-form-item label="控制值阈值">
                  <el-input v-model="quotaConfigForm.controlValue" autocomplete="off" :disabled="true" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4" :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                <el-form-item label="阈值类型">
                  <el-select v-model="quotaConfigForm.controlValueType" :disabled="true" placeholder="--请选择--">
                    <el-option v-for="item in controllerTypeSelections" :key="item.dictKey" :label="item.dictValue"
                      :value="item.dictKey"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="4" :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                <el-form-item label="控制值管控节点">
                  <el-select v-model="quotaConfigForm.controlNode" multiple :disabled="true" placeholder="--请选择--"
                    clearable>
                    <el-option v-for="item in controlNodeSelections" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="4" :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                <el-form-item label="应对措施">
                  <el-select v-model="quotaConfigForm.controlNodeMeasure" :disabled="true" placeholder="--请选择--"
                    clearable>
                    <el-option v-for="item in nodeMeasureSelections" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4" :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                <el-form-item label="预警值阈值">
                  <el-input v-model="quotaConfigForm.warnValue" autocomplete="off" :disabled="true" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4" :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                <el-form-item label="阈值类型">
                  <el-select v-model="quotaConfigForm.warnValueType" :disabled="true" placeholder="--请选择--">
                    <el-option v-for="item in controllerTypeSelections" :key="item.dictKey" :label="item.dictValue"
                      :value="item.dictKey"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="4" :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                <el-form-item label="预警值管控节点">
                  <el-select v-model="quotaConfigForm.warnNode" multiple :disabled="true" placeholder="--请选择--"
                    clearable>
                    <el-option v-for="item in controlNodeSelections" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="4" :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                <el-form-item label="应对措施">
                  <el-select v-model="quotaConfigForm.warnNodeMeasure" :disabled="true" placeholder="--请选择--" clearable>
                    <el-option v-for="item in nodeMeasureSelections" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4" :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                <el-form-item label="观察值阈值">
                  <el-input v-model="quotaConfigForm.observeValue" autocomplete="off" :disabled="true" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4" :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                <el-form-item label="阈值类型">
                  <el-select v-model="quotaConfigForm.observeValueType" :disabled="true" placeholder="--请选择--">
                    <el-option v-for="item in controllerTypeSelections" :key="item.dictKey" :label="item.dictValue"
                      :value="item.dictKey"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="4" :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                <el-form-item label="观察值管控节点">
                  <el-select v-model="quotaConfigForm.observeNode" multiple :disabled="true" placeholder="--请选择--"
                    clearable>
                    <el-option v-for="item in controlNodeSelections" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="4" :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                <el-form-item label="应对措施">
                  <el-select v-model="quotaConfigForm.observeNodeMeasure" :disabled="true" placeholder="--请选择--"
                    clearable>
                    <el-option v-for="item in nodeMeasureSelections" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-divider content-position="left">指标信息</el-divider>
            <el-row>
              <el-col :span="4" :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                <el-form-item label="限额指标编号" :required="true">
                  <el-input v-model="quotaIndexForm.quotaIndexNum" autocomplete="off" :disabled="true"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4" :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                <el-form-item label="限额指标名称">
                  <el-input v-model="quotaIndexForm.quotaIndexName" autocomplete="off" :disabled="true"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4" :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                <el-form-item label="限额指标类型">
                  <el-select v-model="quotaIndexForm.quotaIndexType" :disabled="true" placeholder="--请选择--">
                    <el-option v-for="item in quotaIndexTypeSelections" :key="item.dictKey" :label="item.dictValue"
                      :value="item.dictKey"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="4" :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                <el-form-item label="限额类型">
                  <el-select v-model="quotaIndexForm.quotaType" :disabled="true" placeholder="--请选择--">
                    <el-option v-for="item in quotaTypeSelections" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4" :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                <el-form-item label="限额计算方式">
                  <el-select v-model="quotaIndexForm.computingMethod" :disabled="true" placeholder="--请选择--">
                    <el-option v-for="item in computingMethodSelections" :key="item.dictKey" :label="item.dictValue"
                      :value="item.dictKey"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="4" :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                <el-form-item label="统计口径">
                  <el-select v-model="quotaIndexForm.quotaIndexCaliber" :disabled="true" placeholder="--请选择--">
                    <el-option v-for="item in quotaIndexCaliberSelections" :key="item.dictKey" :label="item.dictValue"
                      :value="item.dictKey"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="4" :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                <el-form-item label="限额计算对象">
                  <el-select v-model="quotaIndexForm.computingTarget" :disabled="true" placeholder="--请选择--">
                    <el-option label="限额计算对象：1" value="1"></el-option>
                    <el-option label="限额计算对象：2" value="2"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="4" :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                <el-form-item label="指标状态">
                  <el-select v-model="quotaIndexForm.quotaIndexState" :disabled="true" placeholder="--请选择--">
                    <el-option v-for="item in quotaIndexStateSelections" :key="item.dictKey" :label="item.dictValue"
                      :value="item.dictKey"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4" :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                <el-form-item label="分析维度范围" v-show="false">
                  <el-checkbox v-model="quotaIndexForm.quotaIndexRange" value="0" :disabled="true">全部维度</el-checkbox>
                  <el-select v-model="quotaIndexForm.rangeRegion" :disabled="true" multiple v-if="quotaIndexType_1"
                    placeholder="区域" clearable>
                    <el-option v-for="item in rangeRegionSelections" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey"></el-option>
                  </el-select>
                  <el-select v-model="quotaIndexForm.rangeCustomer" :disabled="true" multiple placeholder="客户类型"
                    clearable>
                    <el-option v-for="item in rangeCustomerSelections" :key="item.dictKey" :label="item.dictValue"
                      :value="item.dictKey"></el-option>
                  </el-select>
                  <el-select v-model="quotaIndexForm.rangerRiskMitigation" :disabled="true" v-if="quotaIndexType_1"
                    multiple placeholder="风险缓释" clearable>
                    <el-option v-for="item in rangerRiskMitigationSelections" :key="item.dictKey" :label="item.dictValue"
                      :value="item.dictKey"></el-option>
                  </el-select>
                  <el-select v-model="quotaIndexForm.currency" :disabled="true" multiple placeholder="币种" clearable>
                    <el-option v-for="item in currencySelections" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey"></el-option>
                  </el-select>
                  <el-select v-model="quotaIndexForm.rangeIndustry" :disabled="true" multiple v-if="quotaIndexType_1"
                    placeholder="行业" clearable>
                    <el-option v-for="item in rangeIndustrySelections" :key="item.dictKey" :label="item.dictValue"
                      :value="item.dictKey"></el-option>
                  </el-select>
                  <el-select v-model="quotaIndexForm.rangeCountry" :disabled="true" multiple placeholder="国别" clearable>
                    <el-option v-for="item in rangeCountrySelections" :key="item.dictKey" :label="item.dictValue"
                      :value="item.dictKey"></el-option>
                  </el-select>
                  <el-select v-model="quotaIndexForm.rangeProduct" :disabled="true" multiple placeholder="产品" clearable>
                    <el-option v-for="item in rangeProductSelections" :key="item.dictKey" :label="item.dictValue"
                      :value="item.dictKey"></el-option>
                  </el-select>
                  <el-select v-model="quotaIndexForm.businessType" :disabled="true" multiple v-if="quotaIndexType_2"
                    placeholder="业务种类" clearable>
                    <el-option v-for="item in businessTypeSelections" :key="item.dictKey" :label="item.dictValue"
                      :value="item.dictKey"></el-option>
                  </el-select>
                  <el-select v-model="quotaIndexForm.bussScene" :disabled="true" multiple v-if="quotaIndexType_2"
                    placeholder="业务场景" clearable>
                    <el-option v-for="item in bussSceneSelections" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="4" :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                <el-form-item label="限额指标" class="fullWidth">
                  <span class="el-tag el-tag--info el-tag--small el-tag--light" style="margin-right:5px" v-if="quotaIndexType_1">
                    <span class="el-select__tags-text" :v-model="quotaIndexForm.rangeRegion">区域：{{ rangeRegionContent
                      }}</span>
                  </span>
                  <span class="el-tag el-tag--info el-tag--small el-tag--light" style="margin-right:5px">
                    <span class="el-select__tags-text" :v-model="quotaIndexForm.rangeCustomer">
                      客户类型：{{
                      rangeCustomerContent }}
                    </span>
                  </span>
                  <span class="el-tag el-tag--info el-tag--small el-tag--light" style="margin-right:5px" v-if="quotaIndexType_1">
                    <span class="el-select__tags-text" :v-model="quotaIndexForm.rangerRiskMitigation">
                      风险缓释：{{
                      rangerRiskMitigationContent }}
                    </span>
                  </span>
                  <span class="el-tag el-tag--info el-tag--small el-tag--light" style="margin-right:5px">
                    <span class="el-select__tags-text" :v-model="quotaIndexForm.currency">币种：{{ currencyContent }}</span>
                  </span>
                  <span class="el-tag el-tag--info el-tag--small el-tag--light" style="margin-right:5px" v-if="quotaIndexType_1">
                    <span class="el-select__tags-text" :v-model="quotaIndexForm.rangeIndustry">
                      行业：{{ rangeIndustryContent
                      }}
                    </span>
                  </span>
                  <span class="el-tag el-tag--info el-tag--small el-tag--light" style="margin-right:5px">
                    <span class="el-select__tags-text" :v-model="quotaIndexForm.rangeCountry">
                      国别：{{ rangeCountryContent
                      }}
                    </span>
                  </span>
                  <span class="el-tag el-tag--info el-tag--small el-tag--light" style="margin-right:5px">
                    <span class="el-select__tags-text" :v-model="quotaIndexForm.rangeProduct">
                      产品：{{ rangeProductContent
                      }}
                    </span>
                  </span>
                  <span class="el-tag el-tag--info el-tag--small el-tag--light" style="margin-right:5px" v-if="quotaIndexType_2">
                    <span class="el-select__tags-text" :v-model="quotaIndexForm.businessType">
                      业务种类：{{ businessTypeContent
                      }}
                    </span>
                  </span>
                  <span class="el-tag el-tag--info el-tag--small el-tag--light" style="margin-right:5px" v-if="quotaIndexType_2">
                    <span class="el-select__tags-text" :v-model="quotaIndexForm.bussScene">业务场景：{{ bussSceneContent }}</span>
                  </span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="补充说明">
                  <el-input type="textarea" :rows="3" :disabled="true" style="width:100%" placeholder="请输入内容" v-model="quotaIndexForm.explainInfo"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-divider content-position="left">管理信息</el-divider>
            <el-row>
              <el-col :span="4" :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                <el-form-item label="维护人" prop="quotaNum">
                  <el-input v-model="quotaConfigForm.userName" autocomplete="off" :disabled="true" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4" :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                <el-form-item label="维护机构" prop="quotaName">
                  <el-input v-model="quotaConfigForm.orgName" autocomplete="off" :disabled="true" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4" :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
                <el-form-item label="维护时间">
                  <el-input v-model="quotaConfigForm.updateTime" autocomplete="off" :disabled="true" clearable></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
    </el-dialog>
    <!-- 限额基础指标选择dialog框 -->
    <el-dialog class="quotaDialog" title="请选择限额基础指标" :visible.sync="quotaDialogVisible" width="55%" height="400"
      @closed="closeDialogQuota" :append-to-body="true">
      <!-- 查询条件 -->
      <div class="search">
        <el-form :model="quotaForm" ref="quotaForm" label-width="100px">
          <!-- <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6"> -->
          <el-form-item label="限额指标编号" prop="quotaIndexNum">
            <el-input v-model="quotaForm.quotaIndexNum" size="small"></el-input>
          </el-form-item>
          <el-form-item label="限额指标名称" prop="quotaIndexName">
            <el-input v-model="quotaForm.quotaIndexName" size="small"></el-input>
          </el-form-item>
          <!-- </el-col> -->
          <!-- <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6"> -->
          <el-form-item class="btns">
            <el-button type="primary" @click="querQuotaMsg" size="small">查询</el-button>
            <el-button @click="clearQuotaMsg('quotaForm')" size="small">重置</el-button>
          </el-form-item>
          <!-- </el-col> -->
        </el-form>
      </div>
      <!-- 详细表格信息 -->
      <div class="table">
        <template>
          <el-table :data="quotaMsg" style="width: 100%" height="400">
            <el-table-column prop="quotaIndexNum" label="限额指标编号" width="200"></el-table-column>
            <el-table-column prop="quotaIndexName" label="限额指标名称" width="300"></el-table-column>
            <el-table-column prop="quotaIndexTypeName" label="限额指标类型" width="180"></el-table-column>
            <el-table-column prop="quotaIndexType" label="限额指标类型(字典值)" v-if="false"></el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
              <template slot-scope="scope">
                <el-button @click="makeQuotaSure(scope.row)" type="text" size="small">选择</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </div>
      <!-- 分页功能区 -->
      <el-pagination class="pageination" @size-change="quotaSizeChange" @current-change="quotaCurrentChange"
        :current-page="quotaPageInfo.pageNum" :page-sizes="[10]" :page-size="quotaPageInfo.pageSize" layout="total, sizes, prev, pager, next, jumper"
        :total="quotaTotal" style="float:right"></el-pagination>
    </el-dialog>
  </div>
</template>

<script>
import TreeSelect from '@/components/TreeSelect/expand.vue'
import {
  list,
  detail,
  detail2,
  add,
  update,
  remove,
  getQuotaIndexNum,
  getRcmIndexList
} from '@/api/quota/manager'
import { getUserInfo } from '@/api/user'
import { getDeptTreeManage } from '@/api/system/dept'
import { dictTranslate, getDictionary, getDept } from '@/api/system/dict'

export default {
  data() {
    return {
      treeIf: false,
      loading:false,
      isClearable: true, // 可清空（可选）
      isAccordion: true, // 可收起（可选）
      props: {
        // 配置项（必选）
        formVal: '',
        value: 'id',
        label: 'title',
        children: 'children',
        disabled: false,
        identifier: [] // 限制层级
      },
       editProps:{
        formVal: '',
        value: 'id',
        label: 'title',
        children: 'children',
        disabled: false,
        identifier: ["3"] // 限制层级
      },
      orgNumDict: [], //机构字典
      quotaIndexTypeDict: [], //限额指标类型字典
      quotaTypeDict: [], //限额类型字典
      quotaStateDict: [], //限额状态字典
      searchForm: {
        useOrgName: null,
        useOrgNum: null,
        currOrg: null,
        quotaState: '1',
        quotaName: null,
        quotaIndexName: null,
        quotaType: null
      },
      quotaConfigFormRules: {
        quotaName: [{ required: true, message: '请输入限额名称', trigger: 'blur' }],
        quotaIndexNum: [{ required: true, message: '请选择限额指标编号', trigger: 'blur' }],
        quotaType: [{ required: true, message: '请输入限额类型', trigger: 'blur' }],
        quotaState: [{ required: true, message: '请输入限额状态', trigger: 'blur' }],
        useOrgNum: [{ required: true, message: '请输入生效机构', trigger: 'blur' }],
        controlValue: [{ required: true, message: '该字段不能为空', trigger: 'blur' }, { validator: this.validateEdit, trigger: 'blur' }],
        controlValueType: [{ required: true, message: '该字段不能为空', trigger: 'blur' }, { validator: this.valueTypeChange, trigger: 'change' }],
        controlNode: [{ required: true, message: '该字段不能为空', trigger: 'blur' }],
        controlNodeMeasure: [{ required: true, message: '该字段不能为空', trigger: 'blur' }],
        warnValue: [{ required: true, message: '该字段不能为空', trigger: 'blur' }, { validator: this.validateEdit, trigger: 'blur' }],
        warnValueType: [{ required: true, message: '该字段不能为空', trigger: 'blur' }, { validator: this.valueTypeChange, trigger: 'change' }],
        warnNode: [{ required: true, message: '该字段不能为空', trigger: 'blur' }],
        warnNodeMeasure: [{ required: true, message: '该字段不能为空', trigger: 'blur' }],
        observeValue: [{ required: true, message: '该字段不能为空', trigger: 'blur' }, { validator: this.validateEdit, trigger: 'blur' }],
        observeValueType: [{ required: true, message: '该字段不能为空', trigger: 'blur' }, { validator: this.valueTypeChange, trigger: 'change' }],
        observeNode: [{ required: true, message: '该字段不能为空', trigger: 'blur' }],
        observeNodeMeasure: [{ required: true, message: '该字段不能为空', trigger: 'blur' }]
      },
      loading: true,
      normalizer(node) {
        return { label: node.title }
      },
      page: {
        current: 1,
        size: 10,
        total: 0
      },
      tableData: [],
      options: [],
      displayBtnHis: '', //显示
      displayBtnSave: '', //显示
      displayBtnUpdate: '', //显示
      addDialogFormVisible: false,
      viewDialogFormVisible: false,
      editDialogFormVisible: false,
      quotaIndexForm: {},
      quotaConfigForm: {
        useOrgNum: '',
        useOrgName: '',
        quotaIndexName: '',
        quotaIndexType: '',
        controlValueType: '1',
        warnValueType: '1',
        observeValueType: '1'
      },
      orgValue: '', // 机构选择 下拉框选中的数据
      orgData: [], // 机构选择树的数据
      currOrg: '', // 机构选择 input框中的数据
      filterText: '', // 机构选择树中过滤输入框中的内容
      defaultProps: {
        // 指定子树为节点对象的某个属性值
        children: 'children', // 指定节点标签为节点对象的某个属性值
        label: 'title'
      },
      quotaIndexNumDisable: false,
      quotaIndexType_1: false,
      quotaIndexType_2: true,
      //选定的内容
      rangeRegionContent: '', //区域
      rangeCustomerContent: '', //客户类型
      rangerRiskMitigationContent: '', //风险缓释
      currencyContent: '', //币种
      rangeIndustryContent: '', //行业
      rangeCountryContent: '', //  国别
      rangeProductContent: '', //  产品
      businessTypeContent: '', //  业务种类
      bussSceneContent: '', //     业务场景
      controllerTypeSelections: [],
      controlNodeSelections: [],
      nodeMeasureSelections: [],
      quotaStateSelections: [],
      quotaStateSelections2: [{
        value: '0',
        label: '未生效'
      }, {
        value: '1',
        label: '生效'
      }],
      useOrgNumSelections: [], //机构
      quotaIndexNumSelections: [], //限额指标编号
      quotaIndexTypeSelections: [], //限额指标类型
      quotaTypeSelections: [], //限额类型
      computingMethodSelections: [], //限额计算方式
      computingMethodSelections1: [], //限额计算方式
      computingMethodSelections2: [], //限额计算方式
      quotaIndexCaliberSelections: [], //统计口径
      quotaIndexCaliberSelections1: [], //统计口径
      quotaIndexCaliberSelections2: [], //统计口径
      computingTargetSelections: [], //限额计算对象
      rangeRegionSelections: [], //区域
      rangeCustomerSelections: [], //客户类型
      rangeCustomerSelections1: [], //客户类型
      rangeCustomerSelections2: [], //客户类型
      rangerRiskMitigationSelections: [], //风险缓释
      currencySelections: [], //币种
      rangeIndustrySelections: [], //行业
      rangeCountrySelections: [], //  国别
      rangeProductSelections: [], //  产品
      businessTypeSelections: [], //  业务种类
      bussSceneSelections: [], //     业务场景
      quotaIndexStateSelections: [], //指标状态

      // 限额基础指标选择dialog框中，详细信息表格中的数据源
      quotaMsg: [],
      // 限额基础指标选择器搜索条件form
      quotaForm: {
        quotaNum: '',
        quotaName: ''
      },
      // 限额基础指标选择dialog框
      quotaDialogVisible: false,
      // 限额基础指标选择dialog中的分页信息
      quotaPageInfo: { pageNum: 1, pageSize: 10 },
      // 限额基础指标选择dialog中数据总条数
      quotaTotal: 40,
    }
  },
  created() {
   
    this.getDictionaryCommon()
    this.dictTranslateCommon()
    this.getUserInfo()
    this.getTableData()
  },
  methods: {
    // =============以下方法函数为限额基础指标选择相关的内容=============
    // 获取限额基础指标列表
    getRcmIndexListCommon() {
      getRcmIndexList(
        this.quotaPageInfo.pageNum,
        this.quotaPageInfo.pageSize,
        this.quotaForm.quotaIndexNum,
        this.quotaForm.quotaIndexName
      ).then(res => {
        console.log(res, '获取限额基础指标列表')
        this.quotaMsg = res.data.data.records
        this.quotaTotal = res.data.data.total
      })
    },
    // 点击确定按钮，确认选择限额基础指标
    makeQuotaSure(row) {
      console.log(row, '打印row的信息')
      this.quotaConfigForm.quotaIndexNum = row.quotaIndexNum
      this.quotaConfigForm.quotaIndexName = row.quotaIndexName
      this.quotaConfigForm.quotaIndexType = row.quotaIndexType
      this.quotaDialogVisible = false
    },
    // 点击重置按钮，清空input中的内容(限额基础指标)
    clearQuotaMsg() {
      this.$refs['quotaForm'].resetFields()
    },
    // 限额基础指标dialog框关闭后
    closeDialogQuota() {
      this.quotaForm.quotaIndexNum = ''
      this.quotaForm.quotaIndexName = ''
    },
    // 点击查询按钮，触发该函数，根据input中的值显示对应的信息(限额基础指标)
    querQuotaMsg() {
      this.getRcmIndexListCommon()
    },
    //限额基础指标选择器:限额设定中，点击限额指标编号右侧放大镜，触发该函数
    chooseQuota() {
      this.quotaPageInfo.pageNum = 1
      this.quotaPageInfo.pagesize = 10
      this.getRcmIndexListCommon()
      this.quotaDialogVisible = true
    },
    // ====限额基础指标dialog中的分页功能====
    // 监听 pagesize 改变的事件
    quotaSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.quotaPageInfo.pageSize = val
      this.getRcmIndexListCommon()
    },
    // 监听 页码值 改变的事件
    quotaCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.quotaPageInfo.pageNum = val
      this.getRcmIndexListCommon()
    },
    //====================分割===========================

    valueTypeChange(rule, value, callback) {
      if (rule.field === 'controlValueType') {
        this.$refs.quotaConfigForm.validateField('controlValue')
      } else if (rule.field === 'observeValueType') {
        this.$refs.quotaConfigForm.validateField('observeValue')
      } else if (rule.field === 'warnValueType') {
        this.$refs.quotaConfigForm.validateField('warnValue')
      }
      callback()

    },
    validateEdit(rule, value, callback) {
      /*if (!value) {
        return callback(new Error('输入不可以为空'))
      }*/
      if (!Number(value)) {
        return callback(new Error('请输入数字'))
      }
      //校验阈值内容
      if (rule.field === 'controlValue' || rule.field === 'observeValue' || rule.field === 'warnValue') {
        if (this.quotaConfigForm.controlValueType === '2' && this.quotaConfigForm.controlValue > 100) {
          callback(new Error('百分比请输入[1,100]之间的数字'))
        } else if (this.quotaConfigForm.observeValueType === '2' && this.quotaConfigForm.observeValue > 100) {
          callback(new Error('百分比请输入[1,100]之间的数字'))
        } else if (this.quotaConfigForm.warnValueType === '2' && this.quotaConfigForm.warnValue > 100) {
          callback(new Error('百分比请输入[1,100]之间的数字'))
        }
      }
      callback()
      //清除
      // this.$refs.quotaConfigForm.clearValidate('controlValue')
    },
    // 点击搜索区的清空按钮，触发该函数，清空表单内容
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.$refs["treeSelOrg"].clearHandle();
      // this.searchForm.useOrgName = ''
      // this.searchForm.useOrgNum = ''
    },
    //历史记录
    history(row) {
      //跳转路由页面
      this.$router.push({ name: '历史记录', params: { val: row.quotaNum } })
    },

    //新增
    save(op, formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) {
          // 验证不通过禁止提交
          console.log('验证不通过')
          return this.$message.error('请输入完整的信息')
        }
        console.log('验证通过')
        const data = this.quotaConfigForm
        data.controlNode =
          data.controlNode || data.controlNode instanceof Array
            ? data.controlNode.join(',')
            : data.controlNode
        data.warnNode =
          data.warnNode || data.warnNode instanceof Array
            ? data.warnNode.join(',')
            : data.warnNode
        data.observeNode =
          data.observeNode || data.observeNode instanceof Array
            ? data.observeNode.join(',')
            : data.observeNode
        if (op == 'add') {
          add(data).then(res => {
            if (res.status != 200) {
              return this.$message.error('操作失败!')
            }
            this.$message({ type: 'success', message: '操作成功!' })
            this.getTableData()
          })
        } else if (op == 'update') {
          update(data).then(res => {
            if (res.status != 200) {
              return this.$message.error('操作失败!')
            }
            this.$message({ type: 'success', message: '操作成功!' })
            this.getTableData()
          })
        }

        this.quotaConfigForm = {}
        this.editDialogFormVisible = false
        this.addDialogFormVisible = false
      })
    },
    // 获取table表格数据
    getTableData() {    
      this.loading = true;
      list(this.page, this.searchForm).then(res => {
        this.page.total = res.data.data.total
        this.tableData = res.data.data.records
        this.loading = false;
      })
    },
    // 获取当前登录人的信息
    getUserInfo() {
      getUserInfo().then(res => {
        if (res.status != 200) {
          return this.$$message.error('获取当前登录人信息失败，请重试')
        }
        this.userInfo = res.data.data
        getDeptTreeManage(this.userInfo.deptId).then(res => {
          if (res.status != 200) {
            return this.$message.error('获取当前登录人信息失败，请重试')
          }
          this.orgData = res.data.data
          // 如果当前登录机构为省联社，默认选择省联社
          if (this.orgData[0].deptLevel == 1) {
            // 如果当前登录机构为省联社，默认选择省联社
            this.currOrg = this.orgData[0].id
            this.orgValue = this.orgData[0].value
          } else if (this.orgData[0].deptLevel == 2) {
            // 如果当前登录机构为市联社下第一个成员行，机构树为该市级下所有成员行
            this.currOrg = this.orgData[0].children[0].id
            this.orgValue = this.orgData[0].children[0].value
          } else if (this.orgData[0].deptLevel == 3) {
            // 如果当前登录机构为成员行，机构树只显示成员行
            this.currOrg = this.orgData[0].id
            this.orgValue = this.orgData[0].value
          }
          this.treeIf = true
        })
      })
    },
    //限额指标编号发生改变的时候
    // quotaIndexNumChange() {
    //   if (this.quotaConfigForm.quotaIndexNum == '') {
    //     this.quotaConfigForm.quotaIndexName = ''
    //     this.quotaConfigForm.quotaIndexType = ''
    //   } else {
    //     this.quotaIndexNumSelections.map(item => {
    //       if (item.quotaIndexNum === this.quotaConfigForm.quotaIndexNum) {
    //         this.quotaConfigForm.quotaIndexName = item.quotaIndexName
    //         this.quotaConfigForm.quotaIndexType = item.quotaIndexType
    //       }
    //     })
    //     /*detail2(this.quotaConfigForm.quotaIndexNum).then(res => {
    //       const data = res.data.data
    //       this.quotaConfigForm.quotaIndexName = data.quotaIndexName
    //       this.quotaConfigForm.quotaIndexType = data.quotaIndexType
    //     })*/
    //   }

    // },
    // 点击新增按钮，触发该函数，显示dialog框
    handleAdd() {
      // getQuotaIndexNum().then(res => {
      //   this.quotaIndexNumSelections = res.data.data
      // })
      getDept().then(res => {
        this.options = res.data.data
      })
      this.quotaIndexForm = {}
      this.addDialogFormVisible = true
      this.quotaIndexNumDisable = false
      this.displayBtnHis = 'none'
      this.displayBtnUpdate = 'none'
      this.displayBtnSave = ''
    },
    //点击调整申请打开dialog框
    handleEdit(row) {
      this.addDialogFormVisible = true
      this.quotaIndexNumDisable = true
      this.displayBtnHis = ''
      this.displayBtnUpdate = ''
      this.displayBtnSave = 'none'
      detail(row.quotaNum).then(res => {
        const data = res.data.data
        this.quotaConfigForm = data
        this.quotaConfigForm.controlNode =
          data.controlNode != 'undefined'
            ? data.controlNode.split(',')
            : data.controlNode
        this.quotaConfigForm.warnNode =
          data.warnNode && data.warnNode != 'undefined'
            ? data.warnNode.split(',')
            : data.warnNode
        this.quotaConfigForm.observeNode =
          data.observeNode && data.observeNode != 'undefined'
            ? data.observeNode.split(',')
            : data.observeNode
        this.orgValue = data.useOrgName
        this.currOrg = data.useOrgName
      })
    },
    handleView(row) {
      detail(row.quotaNum).then(res => {
        const data = res.data.data
        this.quotaConfigForm = res.data.data
        this.quotaIndexForm = this.quotaConfigForm.rcmConfigurationQuota //限额指标信息
        this.quotaConfigForm.controlNode =
          data.controlNode && data.controlNode != 'undefined'
            ? data.controlNode.split(',')
            : data.controlNode
        this.quotaConfigForm.warnNode =
          data.warnNode && data.warnNode != 'undefined'
            ? data.warnNode.split(',')
            : data.warnNode
        this.quotaConfigForm.observeNode =
          data.observeNode && data.observeNode != 'undefined'
            ? data.observeNode.split(',')
            : data.observeNode
        if (this.quotaIndexForm.rangeRegion) {
          this.quotaIndexForm.rangeRegion = this.quotaIndexForm.rangeRegion.split(
            ','
          )
          this.rangeRegionContent = this.quotaIndexForm.rangeRegion.join('/')
        }
        if (this.quotaIndexForm.rangeCustomer) {
          this.quotaIndexForm.rangeCustomer = this.quotaIndexForm.rangeCustomer.split(
            ','
          )
          this.rangeCustomerContent = this.quotaIndexForm.rangeCustomer.join(
            '/'
          )
        }
        if (this.quotaIndexForm.rangerRiskMitigation) {
          this.quotaIndexForm.rangerRiskMitigation = this.quotaIndexForm.rangerRiskMitigation.split(
            ','
          )
          this.rangerRiskMitigationContent = this.quotaIndexForm.rangerRiskMitigation.join(
            '/'
          )
        }
        if (this.quotaIndexForm.currency) {
          this.quotaIndexForm.currency = this.quotaIndexForm.currency.split(',')
          this.currencyContent = this.quotaIndexForm.currency.join('/')
        }
        if (this.quotaIndexForm.rangeIndustry) {
          this.quotaIndexForm.rangeIndustry = this.quotaIndexForm.rangeIndustry.split(
            ','
          )
          this.rangeIndustryContent = this.quotaIndexForm.rangeIndustry.join(
            '/'
          )
        }
        if (this.quotaIndexForm.rangeCountry) {
          this.quotaIndexForm.rangeCountry = this.quotaIndexForm.rangeCountry.split(
            ','
          )
          this.rangeCountryContent = this.quotaIndexForm.rangeCountry.join('/')
        }
        if (this.quotaIndexForm.rangeProduct) {
          this.quotaIndexForm.rangeProduct = this.quotaIndexForm.rangeProduct.split(
            ','
          )
          this.rangeProductContent = this.quotaIndexForm.rangeProduct.join('/')
        }
        if (this.quotaIndexForm.businessType) {
          this.quotaIndexForm.businessType = this.quotaIndexForm.businessType.split(
            ','
          )
          this.businessTypeContent = this.quotaIndexForm.businessType.join('/')
        }
        if (this.quotaIndexForm.bussScene) {
          this.quotaIndexForm.bussScene = this.quotaIndexForm.bussScene.split(
            ','
          )
          this.bussSceneContent = this.quotaIndexForm.bussScene.join('/')
        }

        showElement(this.quotaConfigForm.rcmConfigurationQuota.quotaType, this)
        this.viewDialogFormVisible = true
      })
    },
    //详情dialog关闭时
    // viewDialogClosed() {
    //   this.quotaConfigForm = {}
    //   this.quotaIndexForm = {}
    // },
    // 监听新增dialog的关闭事件
    // addDialogClosed() {
    //   this.addDialogFormVisible = false
    // },
    //取消按钮方法
    cancel(formName) {
      this.editDialogFormVisible = false
      this.addDialogFormVisible = false
      this.quotaConfigForm = {}
      this.quotaIndexForm = {}
    },
    // 节点被点击时的回调,共三个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、节点对应的 Node、节点组件本身
    HandleNodeClick(data) {
      if (data.deptLevel == 1 || data.deptLevel == 3) {
        this.quotaConfigForm.useOrgName = data.title
        this.quotaConfigForm.useOrgNum = data.id
      }
    },
    searchFormHandleNodeClick(data) {
      if (data.deptLevel == 1 || data.deptLevel == 3) {
        this.searchForm.useOrgName = data.title
        this.searchForm.useOrgNum = data.id
      }
    },
    handleDelete(row) {
      this.$confirm('确定将选择数据删除?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          return remove(row.quotaNum)
        })
        .then(() => {
          this.getTableData()
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        })
    },
    // 监听 size 改变的事件
    handleSizeChange(newSize) {
      this.page.size = newSize
      this.getTableData()
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      this.page.current = newPage
      this.getTableData()
    },
    // 对树节点进行筛选时执行的方法，返回 true 表示这个节点可以显示，返回 false 则表示这个节点会被隐藏
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 字典翻译
    dictTranslateCommon() {
      // 主办机构字典
      dictTranslate('org').then(res => {
        this.orgNumDict = res.data.data
        this.tableData.useOrgNum = this.orgNumDict[this.tableData.useOrgNum]
      })
      // 限额指标类型字典
      dictTranslate('CD000253').then(res => {
        this.quotaIndexTypeDict = res.data.data
        this.tableData.quotaIndexType = this.quotaIndexTypeDict[
          this.tableData.quotaIndexType
        ]
      })
      // 限额指标类型字典
      dictTranslate('CD000252').then(res => {
        this.quotaTypeDict = res.data.data
        this.tableData.quotaType = this.quotaTypeDict[this.tableData.quotaType]
      })
      dictTranslate('CD000261').then(res => {
        this.quotaStateDict = res.data.data
        this.tableData.quotaState = this.quotaStateDict[
          this.tableData.quotaState
        ]
      })
    },
    getDictionaryCommon() {
      getDictionary('CD000258').then(response => {
        this.controllerTypeSelections = response.data.data
      })
      getDictionary('CD000259').then(response => {
        this.controlNodeSelections = response.data.data
      })
      getDictionary('CD000260').then(response => {
        this.nodeMeasureSelections = response.data.data
      })
      getDictionary('computing_method1').then(response => {
        this.computingMethodSelections1 = response.data.data
      })
      getDictionary('computing_method2').then(response => {
        this.computingMethodSelections2 = response.data.data
      })
      getDictionary('quota_index_caliber1').then(response => {
        this.quotaIndexCaliberSelections1 = response.data.data
      })
      getDictionary('quota_index_caliber2').then(response => {
        this.quotaIndexCaliberSelections2 = response.data.data
      })
      getDictionary('range_customer1').then(response => {
        this.rangeCustomerSelections1 = response.data.data
      })
      getDictionary('range_customer2').then(response => {
        this.rangeCustomerSelections2 = response.data.data
      })
      getDictionary('ranger_risk_mitigation').then(response => {
        this.rangerRiskMitigationSelections = response.data.data
      })
      getDictionary('range_region').then(response => {
        this.rangeRegionSelections = response.data.data
      })
      getDictionary('ranger_risk_mitigation').then(response => {
        this.rangerRiskMitigationSelections = response.data.data
      })
      getDictionary('CD000252').then(response => {
        this.quotaTypeSelections = response.data.data
      })
      getDictionary('CD000253').then(response => {
        this.quotaIndexTypeSelections = response.data.data
      })
      getDictionary('quota_index_state').then(response => {
        this.quotaIndexStateSelections = response.data.data
      })
      getDictionary('currency').then(response => {
        this.currencySelections = response.data.data
      })
      getDictionary('CD000261').then(response => {
        this.quotaStateSelections = response.data.data
      })
    }
  },
  components: {
    TreeSelect
  }
}

function showElement(value, ele) {
  console.log(value)
  if (value == 1) {
    ele.quotaIndexType_1 = false
    ele.quotaIndexType_2 = true
    ele.computingMethodSelections = ele.computingMethodSelections1
    ele.quotaIndexCaliberSelections = ele.computingMethodSelections1
    ele.rangeCustomerSelections = ele.rangeCustomerSelections1
  } else if (value == 2) {
    ele.quotaIndexType_1 = true
    ele.quotaIndexType_2 = false
    ele.computingMethodSelections = ele.computingMethodSelections2
    ele.quotaIndexCaliberSelections = ele.quotaIndexCaliberSelections2
    ele.rangeCustomerSelections = ele.rangeCustomerSelections2
    ele.rangeRegionSelections = ele.rangeRegionSelections
    ele.rangerRiskMitigationSelections = ele.rangerRiskMitigationSelections
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 1vh 2vh;
  .btn {
    margin-bottom: 2vh;
  }
  .pageination {
    float: right;
    padding: 2vh 0;
  }
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
