<template>
  <div class="root">
    <div class="top-btn-area">
      <el-button type="primary" @click="addHardwareSolution"
        >添加五金方案</el-button
      >
    </div>
    <el-table :data="hardware_solution_list" style="width:100%">
      <el-table-column type="index" label="序号" width="100"></el-table-column>
      <el-table-column prop="name" label="名称"> </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="text" size="small"
                     @click="editHardwareSolution(scope.row)">编辑</el-button>
          <el-button type="text" size="small"
                     @click="deleteHardwareSolution(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :title="hardware_solution.id ? '编辑' : '添加'"
      :visible.sync="open_dialog"
      width="800px"
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      :show-close='false'>
      <el-form ref="form" :model="hardware_solution" label-width="80px" v-if="open_dialog">
        <el-form-item label="名称" prop="name" :rules="[{ required: true, message: '必须填写名称' }]">
          <el-input v-model="hardware_solution.name" style="width: 180px"></el-input>
        </el-form-item>
        <el-form-item label="方案明细">
          <div style="text-align: right">
            <el-button type="primary" size="mini" icon="el-icon-plus"
                       :disabled="hardware_solution.val_list.length>=hardware_type_list.length"
                       @click="addSolutionDetail">添加明细</el-button>
          </div>
        </el-form-item>
      </el-form>
      <!-- 方案明细 -->
      <div v-for="(val,index) in hardware_solution.val_list" :key="index" v-if="open_dialog">
        <div style="margin-bottom: 10px;">
          <el-select v-model="val.type_id" placeholder="请选择五金类型">
            <el-option v-for="(type,index) in hardware_type_list" :key="index"
                       :label="type.name||type.key" :value="type.id"
                       :disabled="dialog_disable_type.includes(type.id)"></el-option>
          </el-select>
          <el-button type="text" style="float: right;"
                     @click="hardware_solution.val_list.splice(index,1)">删除</el-button>
        </div>
        <!-- 图片列表 -->
        <el-upload action="https://zzc-serv-dev.thinkerx.com/api/dxf-upload" name="file"
                   multiple list-type="picture-card" :file-list="val.file_list"
                   :on-success="(response, file, fileList)=> { uploadImage(response, file, fileList, index); }"
                   :on-error="(err, file, fileList)=> { $message.error('上传图片失败'); }"
                   :on-remove="(file, fileList)=> { val.file_list = fileList; }">
          <i class="el-icon-plus"></i>
        </el-upload>

        <el-divider v-if="index+1<hardware_solution.val_list.length"></el-divider>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="open_dialog =false" :loading="is_save">取消</el-button>
        <el-button type="primary" @click="submit" :loading="is_save">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data: () => ({
    open_dialog: false,
    is_save: false,
    hardware_solution: {
      name: '', id: '',
      val_list: []
    },
    hardware_solution_list: [],
    hardware_type_list: [],
  }),
  methods: {
    /** 添加五金方案 **/
    addHardwareSolution() {
      this.open_dialog = true;
      this.hardware_solution = { name: '', id: '', val_list: [] };
    },
    /** 添加五金方案详情 **/
    addSolutionDetail() {
      let default_type_id = 0;
      for (let i=0; i<this.hardware_type_list.length; i++) {
        if (!this.dialog_disable_type.includes(this.hardware_type_list[i].id)) {
          default_type_id = this.hardware_type_list[i].id;
          break;
        }
      }
      this.hardware_solution.val_list.push({
        type_id: default_type_id, file_list: []
      })
    },
    /** 编辑五金方案 **/
    editHardwareSolution(solution){
      let val_list = [];
      if (solution.plans)
        solution.plans.forEach(plan=> {
          val_list.push({ type_id: plan.id, file_list: plan.plans })
        });

      this.hardware_solution = {
        name: solution.name, id: solution.id,
        val_list
      };
      this.open_dialog = true;
    },
    /** 删除五金方案 **/
    deleteHardwareSolution(solution){
      this.$confirm(`此操作将删除名为'${solution.name}'的五金方案, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$axios.delete(`addon_plan/${solution.id}`).then((res) => {
          if (res.code == 1) {
            this.$message.success('删除成功');
            this.getHardwareSolution()
          } else this.$message.error(res.message)
        }).catch(err=> { this.$message.error('删除失败'); });
      })
    },
    /** 保存五金方案 **/
    async submit() {
      await this.$refs["form"].validate();
      let plan_val = [];
      this.hardware_solution.val_list.forEach(val=> {
        val.file_list.forEach(file=> {
          plan_val.push({ type_id: val.type_id, url: file.url });
        });
      });
      let params = { name: this.hardware_solution.name, plan_val };
      if (this.hardware_solution.id) params.id = this.hardware_solution.id;
      this.is_save = true;
      this.$axios.post("addon_plan", params).then((res) => {
        this.is_save = false;
        if (res.code == 1) {
          this.$message.success("保存成功");
          this.open_dialog = false;
          this.getHardwareSolution();
        } else this.$message.error(res.message);
      }).catch(err=> { this.$message.error("保存失败"); });
    },
    /** 获取五金方案列表 **/
    getHardwareSolution() {
      this.$axios.get("addon_plan").then((res) => {
        if (res.code == 1) this.hardware_solution_list = res.data;
      });
    },
    /** 获取五金类型 **/
    getHardwareTypeList() {
      this.$axios.get("addon_type_list").then((res) => {
        if (res.code == 1) this.hardware_type_list = res.data;
      });
    },
    /** 上传图片 **/
    uploadImage(response, file, file_list, val_index) {
      if (response.code == 1) file.url = response.data[0];
      else {
        this.$message.error('图片上传失败');
        file_list.splice(file_list.length-1,1);
      }
      this.hardware_solution.val_list[val_index].file_list = file_list;
    }
  },
  computed: {
    dialog_disable_type() {
      return this.hardware_solution.val_list.map(v=> { return v.type_id; });
    }
  },
  mounted() {
    this.getHardwareSolution();
    this.getHardwareTypeList();
  },
};
</script>

<style>
</style>