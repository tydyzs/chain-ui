<template>
    <div class="dialog">
        <el-dialog :title="title" :close-on-click-modal="false" :append-to-body="true" :lock-scroll="false" :visible.sync="dialogStatus" width="40%">
            <el-form :model="roleForm"  :disabled="actionType=='view'" ref="roleForm" label-width="100px" :rules="rules" size="small">
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <el-form-item label="角色名称" prop="roleName">
                        <el-input v-model="roleForm.roleName"
                         placeholder="角色名称" size="small" clearable/>
                    </el-form-item>
                </el-col>

                 <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <el-form-item label="角色别名" prop="roleAlias">
                        <el-input v-model="roleForm.roleAlias"
                         placeholder="角色别名" size="small" clearable/>
                    </el-form-item>
                </el-col>
                 <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <el-form-item label="上级角色" prop="parentId">
                        <tree-select
                          :props="props"
                          :options="roleTreeData"
                          :value="roleForm.parentId"
                          :clearable="isClearable"
                          :accordion="isAccordion"
                          @getValue="getValue"
                        />
                    </el-form-item>
                </el-col>
                 <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <el-form-item label="机构等级" prop="deptLevel">
                        <el-select v-model="roleForm.deptLevel" style="width:100%" placeholder="请选择" size="small" clearable>
                            <el-option v-for="item in orgLevelData" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                    <el-form-item label="排序" prop="sort">
                        <el-input-number style="width:100%" placeholder="排序" v-model="roleForm.sort" controls-position="right" :min="1" :max="1000" size="small" clearable />
                    </el-form-item>
                </el-col>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button icon="el-icon-close" size="small" @click="cencel()">取 消</el-button>
                <el-button icon="el-icon-check" v-if="actionType!='view'" type="primary" :loading="loading" size="small" @click="save()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import TreeSelect from '@/components/TreeSelect'
import common from '@/config/common.json';
import {getRoleTree,add,getRoleById} from "@/api/system/role";
export default {
  name: 'roleDetail',
  components:{ TreeSelect },
  data() {
    return {
      title:'',
      loading:false,
      dialogStatus: false,
      box:false,
      actionType:'',
      orgLevelData: [],
      roleForm: {},
      isClearable: true, // 可清空（可选）
      isAccordion: true, // 可收起（可选）
      props: {
        // 配置项（必选）
        value: "id",
        label: "title",
        children: "children",
        disabled:false
      },
      // 选项列表（必选）
      roleTreeData: [],
      rules: {
        id: [{ required: true, message: '角色ID', trigger: 'blur' }],
        roleName: [{ required: true, message: '角色名称', trigger: 'blur'}],
        roleAlias: [{ required: true, message: '角色别名', trigger: 'blur'}],
        deptLevel: [{ required: true, message: '机构等级', trigger: 'change'}],
        sort: [{ required: true, message: '排序' , trigger: 'blur'}]
      }
    }
  },
  created(){
    this.init();
  },
  methods: {
    init(){
      getRoleTree("000000").then(res => {
          this.roleTreeData = res.data.data;
      });
    },
    showDialog(actionType,id,orgLevelData) {
      this.actionType = actionType
      this.title = common[actionType]
      this.dialogStatus = true
      this.props.disabled = (actionType != 'add');
      this.orgLevelData = orgLevelData
      if(id != null && id != ""){
          getRoleById(id).then(res => {
              if(res.data.code == 200){
                  this.roleForm = res.data.data;
              }
          });
      }else{
         this.roleForm = {};
      }
      this.$nextTick(()=>{
          this.$refs['roleForm'].clearValidate();        
      })
    },
    hideDialog() {
      this.roleForm = {};
      this.dialogStatus = false
    },
    cencel() {
      this.hideDialog();
    },
    save(){
      this.$refs.roleForm.validate((valid) => {
          if (valid) {
              this.loading = true;
              add(this.roleForm).then(res => {
                if(res.data.code == 200){
                  this.$message({
                    type: "success",
                    message: "操作成功!"
                  });
                  this.loading = false;
                  this.$emit('afterSave');
                  this.hideDialog();
                }else{
                  this.$message({
                    type: "error",
                    message: res.data.msg
                  });
                  this.loading = false;
                }
              }), error => {
                  this.loading = false;
              }
          } else {
            return false;
          }
      });
    },
    getValue(value,node){
      debugger
      this.roleForm.parentId = value;
    }
  }
}
</script>

<style lang="scss" scoped>
// 新增dialog框的样式
.roleDialog {
  .el-dialog {
    .el-dialog__body {
      .el-form {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        .timeChoose {
          .el-form-item__content {
            .el-input {
              width: 100%;
            }
          }
        }
      }
    }
  }
}
</style>


