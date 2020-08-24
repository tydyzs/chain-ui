<!-- 政策库管理-- 文档管理页面 -->
<template>
  <div class="docContainer">
    <!--上传文档区域-->
    <el-dialog :visible.sync="addDialogFormVisible" @close="cancel()" width="80%" height="60%">
      <el-divider content-position="left">选择文档分类和文件，点击上传</el-divider>
      <div v-if="permission.doc_upload" class="search">
        <el-row :gutter="10">
          <el-form label-width="80px" size="small">
            <el-col :span="4" :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
              文档分类：
              <el-select v-model="form.docTypeData" value-key="dictKey" @change="docTypeChange" placeholder="请选择" size="small">
                <el-option v-for="item in type_options" :key="item.dictKey" :label="item.dictValue" :value="item">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="4" :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
              <el-upload class="upload-demo" :before-upload="beforeAvatarUpload" multiple :limit="3" :on-preview="handlePreview"
                :on-exceed="handleExceed" :on-remove="handleRemove" :before-remove="beforeRemove" :on-change="handleChange"
                action="/api/git-doc/uploadSing" :file-list="fileList">
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <el-tooltip class="item" effect="dark" placement="top">
                  <div slot="content">
                    只能上传{{type_lists}}格式文件，且不超过 {{file_size}} M
                    <br><br>一次最多只能同时选择三个文件进行上传
                  </div>
                  <i class="el-icon-warning"></i>
                </el-tooltip>
              </el-upload>

            </el-col>
            <el-col :span="4" :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
              <el-button style="margin-left: 10px;" size="small" type="primary" @click="submitUpload">点击上传</el-button>
            </el-col>
          </el-form>
        </el-row>
      </div>
    </el-dialog>

    <!--搜索条件区域-->
    <div v-if="permission.doc_query" class="search">
      <el-row :gutter="10">
        <el-form label-width="80px" size="small">
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="文档分类">
              <el-select v-model="condition.docTypeCode" placeholder="请选择" clearable size="small">
                <el-option v-for="item in type_options" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="文档名称" prop="account">
              <el-input v-model="condition.docName" size="small" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-button style="margin-left: 10px;" size="small" type="primary" @click="onLoad" icon="el-icon-search">搜索</el-button>
          </el-col>
        </el-form>
      </el-row>
    </div>

    <!-- 表格详情部分 -->
    <!-- 上传按钮 -->
    <el-button class="uploadBtn" type="primary" icon="el-icon-upload" size="small" @click="showAdd">上传</el-button>
    <div v-if="permission.doc_query" class="content">
      <!-- 表格内容部分 -->
      <!-- 点击上方的查询按钮，表格中显示对应的数据，双击数据行，跳转到详情页 -->
      <div class="tableContent"></div>
      <el-table :data="docData" border stripe style="width: 100%" height="450" size="small">
        <el-table-column prop="docTypeName" label="文档分类" :resizable="false" align="center"></el-table-column>
        <el-table-column prop="docName" label="文档名称" width="350" :resizable="false" align="center"></el-table-column>
        <el-table-column prop="createUserName" label="创建人" :resizable="false" align="center"></el-table-column>
        <el-table-column prop="createDate" label="创建日期" :resizable="false" align="center"></el-table-column>
        <el-table-column prop="createDeptName" label="创建机构" :resizable="false" align="center"></el-table-column>
        <el-table-column fixed="right" label="操作" width="280" :resizable="false" align="center">
          <template slot-scope="scope">
            <el-button :disabled="permission.doc_view? false : true" @click="dataview(scope.row)" type="text" size="small"
              icon="el-icon-view">预览</el-button>
            <el-button :disabled="scope.row.isMe === 'disabled' || permission.doc_delete == undefined? true : false"
              @click="datadelete(scope.row)" type="text" size="small" icon="el-icon-delete">删除</el-button>
            <el-button :disabled="scope.row.isRelease === '1' || scope.row.isMe === 'disabled' || permission.doc_release == undefined? true : false"
              @click="isRelease(scope.row)" type="text" size="small" icon="el-icon-s-promotion">发布</el-button>
            <el-button :disabled="permission.doc_dowload? false : true" @click="download(scope.row)" type="text" size="small"
              icon="el-icon-download">下载</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页功能区 -->
      <el-pagination class="pageination" @size-change="sizeChange" @current-change="currentChange" :current-page="page.pagenum"
        :page-sizes="[10, 20, 30, 40]" :page-size="page.pagesize" layout="total, sizes, prev, pager, next, jumper"
        :total="page.total"></el-pagination>
    </div>

  </div>
</template>

<script>
import {
  getList,
  preview,
  dowmdoc,
  remove,
  isReleases,
  addNotice,
  elmen_upload,
  getDocType,
} from "@/api/doc/doc/doc";
import { getStore } from '@/utils/store';
export default {
  data () {
    return {
      addDialogFormVisible: false,
      permission: {},
      //文档分类下拉框数据(上传区域）
      type_options: [],
      //条件区域参数
      condition: {
        docTypeCode: "",
        docName: "",
      },
      //文档控件数据
      docTypeList: [],
      type_list: ['text/plain', 'image/png',
        'image/jpeg', 'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/pdf'
      ],
      type_lists: ['.txt', '.xls', '.xlsx', '.doc', '.docx', '.ppt', '.pptx', '.pdf'],
      view_list: ['txt', 'xls', 'xlsx', 'doc', 'docx', 'ppt', 'pptx', 'pdf', 'png'],
      file_size: 20,
      loading: true,
      form: {
        docTypeData: null,
        upload: "文件上传"
      },
      form1: {},
      fileList: [],
      isRelease_str: "",
      is_del: true,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      query: {},
      data: [],
      //文档表格数据：
      docData: [],
    }
  },
  created () {
    this.getDocType();
    this.onLoad();
    this.init();
  },
  methods: {
    showAdd () {
      this.addDialogFormVisible = true;
    },
    //取消按钮方法
    cancel () {
      this.addDialogFormVisible = false;
    },
    init () {
      this.permission = getStore({ name: 'permission' });
    },
    docTypeChange (obj) {
      console.log(obj);
      console.log(this.form);
    },
    createcode () {
      // this.open2();
    },
    open2 () {
      this.$notify({
        title: '自定义位置',
        message: '右下角弹出的消息',
        position: 'bottom-right'
      });
    },
    getDocType () {
      getDocType().then(res => {
        const data = res.data.data;
        this.type_options = data;
      })
    },
    submitUpload () {
      // alert(this.fileList.length);return;
      if (this.form.docTypeData == undefined) {
        this.$message.error("请选择文档分类！");
        return;
      }
      if (this.fileList.length == 0) {
        this.$message.error("请选择文件！");
        return;
      }
      for (let i in this.fileList) {
        elmen_upload(this.fileList[i].raw, this);
      }
    },
    handlePreview (file) {
      /*点击某个函数*/
      console.log(file);
    },
    fileListDel () {
      this.handleRemove();
      this.fileList = [];
    },
    handleRemove (file, fileList) {
      this.fileList = fileList;
      console.log(file, fileList);
    },
    beforeRemove (file, fileList) {
      let is_del_cp = this.is_del;
      this.is_del = true;
      return is_del_cp;
    },
    handleChange (file, fileList) {
      //this.fileList.push(file);
      this.fileList = fileList;
    },
    is_repeat (file) {
      let repeat = false;
      let i = 0;
      for (let j = 0; j < this.fileList.length; j++) {
        let filen = this.fileList[j];
        if (filen.raw.name == file.name) {
          i++;
        }
      }
      repeat = i > 1 ? true : false;
      return repeat;
    },
    beforeAvatarUpload (file) {
      //alert(file.type);//获取文件类型
      const fileType = file.type;//(文件类型)
      const fileSize = file.size / 1024 / 1024;//文件大小(M)
      if (this.is_repeat(file) == true) {
        this.$message.error(file.name + "已在队列！");
        this.is_del = true;
        return false;
      }
      if (this.type_list.indexOf(fileType) == -1) {
        this.$message.error("文件格式必须为" + this.type_lists);
        this.is_del = true;
        return false;
      }
      if (fileSize > this.file_size) {
        this.$message.error("文件不能大于" + this.file_size + "M！");
        this.is_del = true;
        return false;
      }
      //elmen_upload(file,this);//自动上传
      this.is_del = false;
      return false;
    },
    handleExceed (files) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件`);
    },
    /*下载*/
    download (row) {
      //minio服务器获取文件方式
      //window.open("http://localhost:9000/tysx/"+row.docTypeName+"/"+row.docName);
      //后台接口获取流方式
      dowmdoc(row.docTypeName, row.docName);
    },
    /*预览*/
    dataview (row) {
      preview(row.docTypeName, row.docName, row.docSuffix);
    },
    viewCheck (row) {
      let docSuffix = row.docSuffix;
      if (this.view_list.indexOf(docSuffix) == -1) {
        return true;
      }
      return false;
    },
    isRelease (row) {
      this.isRelease_str = row.isRelease == "0" ? "发布" : "取消发布";
      this.$confirm("确定将选择数据" + this.isRelease_str + "?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return isReleases(row.id, row.isRelease);
        })
        .then(() => {
          this.onLoad();
          if (row.isRelease == "0") {
            addNotice("有新的文档（" + row.docName + "）发布！");
          }
          this.$message({
            type: "success",
            message: this.isRelease_str + "成功!"
          });
        });
    },
    /* 删除*/
    datadelete (row) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return remove(row.id, row.docTypeName, row.docName);
        })
        .then((res) => {
          this.onLoad();
          this.$message.success(res.data.msg);
        });
    },
    /*分页参数*/
    currentChange (currentPage) {
      this.page.currentPage = currentPage;
      this.onLoad();
    },
    sizeChange (pageSize) {
      this.page.pageSize = pageSize;
      this.onLoad();
    },
    onLoad () {
      var page = this.page;
      var params = this.condition;
      this.loading = true;
      getList(page.currentPage, page.pageSize, params).then(res => {
        const data = res.data.data;
        this.page.total = data.total;
        this.docData = data.records;
        this.loading = false;
        //this.selectionClear();
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.docContainer {
  padding: 1vh 2vh;
  .search {
    .el-select {
      width: 100%;
    }
  }
  .uploadBtn {
    margin-bottom: 1vh;
  }
  .el-table /deep/ {
    td,
    th {
      padding: 5px 0;
    }
  }
  .content {
    // 分页 样式
    .pageination {
      float: right;
      padding-top: 2vh;
    }
  }
}
</style>
