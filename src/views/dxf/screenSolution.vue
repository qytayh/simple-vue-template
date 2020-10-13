<template>
  <div class="root">
    <div class="top-btn-area">
      <el-button type="primary" @click="addScreenSolution"
        >添加纱网方案</el-button
      >
    </div>
    <el-table :data="screenSolutionList" style="width:100%">
      <el-table-column prop="name" label="名称"> </el-table-column>
      <el-table-column prop="fixedbasez" label="固玻的Z基础偏移值">
      </el-table-column>
      <el-table-column prop="fixeddepthm" label="固玻的厚度"> </el-table-column>
      <el-table-column prop="fixedposzarray" label="固玻的z偏移值">
          <template slot-scope="scope">
              <div v-for="(v,i) in scope.row.fixedposzarray" :key="`${i}_fixedposzarray`">{{v}}</div>
          </template>
      </el-table-column>
      <el-table-column prop="leafbasez" label="扇玻的z基础偏移值">
      </el-table-column>
      <el-table-column prop="leafdepthm" label="扇玻的厚度"> </el-table-column>
      <el-table-column prop="leafposzarray" label="扇玻的z偏移值">
          <template slot-scope="scope">
              <div v-for="(v,i) in scope.row.leafposzarray" :key="`${i}_leafposzarray`">{{v}}</div>
          </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button @click="editScreenSolution(scope.row)" type="text" size="small"
            >编辑</el-button
          >
          <el-button type="text" size="small" @click="deleteScreenSolution(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :title="screenSolution.id ? '编辑' : '添加'"
      :visible.sync="open_dialog"
      width="800px"
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      :show-close='false'
    >
      <el-form ref="form" label-width="150px" :model="screenSolution" v-if="open_dialog">
        <el-row>
          <el-col :span="12" v-for="(v, i) in screenSettings" :key="i">
            <el-form-item
              :label="v.label"
              :rules="[{ required: true, message: `必须填写${v.label}` }]"
              :prop="v.value"
            >
              <el-input v-model="screenSolution[v.value]" :validate-event="false" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="固玻层数">
              <el-select
                clearable
                v-model="screenSolution.fixedlayer"
                style="width: 230px"
                @change="fixedlayerChange"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in [1, 2, 3, 4]"
                  :key="item"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
            v-for="(item, i) in screenSolution.fixedposzarray"
            :key="`${i}_fixedposzarray`"
          >
            <el-form-item
              :label="`第${i + 1}层固玻的z偏移值`"
              :rules="[
                {
                  required: true,
                  message: `必须填写第${i + 1}层固玻的z偏移值`,
                },
              ]"
              :prop="'fixedposzarray[' + i + ']'"
            >
              <!-- {{screenSolution.fixedposzarray[i]}} -->
              <el-input v-model="screenSolution.fixedposzarray[i]"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="扇玻层数">
              <el-select
                clearable
                v-model="screenSolution.leaflayer"
                style="width: 230px"
                @change="leaflayerChange"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in [1, 2, 3, 4]"
                  :key="item"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
            v-for="(item, i) in screenSolution.leafposzarray"
            :key="`${i}_leafposzarray`"
          >
            <el-form-item
              :label="`第${i + 1}层扇玻的z偏移值`"
              :rules="[
                {
                  required: true,
                  message: `必须填写第${i + 1}层扇玻的z偏移值`,
                },
              ]"
              :prop="'leafposzarray[' + i + ']'"
            >
              <el-input v-model="screenSolution.leafposzarray[i]"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="open_dialog =false;screenSolution={};is_save=false">取消</el-button>
        <el-button type="primary" @click="submit" :loading="is_save">确定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data: () => ({
    open_dialog: false,
    is_save: false,
    screenSolution: {},
    screenSolutionList: [],
    screenSettings: [
      { label: "名称", value: "name" },
      { label: "固玻的Z基础偏移值", value: "fixedbasez" },
      { label: "固玻的厚度", value: "fixeddepthm" },
      { label: "扇玻的z基础偏移值", value: "leafbasez" },
      { label: "扇玻的厚度", value: "leafdepthm" },
    ],
  }),
  methods: {
    fixedlayerChange(val) {
      let arr = [];
      for (let i = 0; i < val; i++) {
        arr.push("");
      }
      this.$set(this.screenSolution, "fixedposzarray", arr);
    },
    leaflayerChange(val) {
      let arr = [];
      for (let i = 0; i < val; i++) {
        arr.push("");
      }
      this.$set(this.screenSolution, "leafposzarray", arr);
    },
    addScreenSolution() {
      this.open_dialog = true;
    },
    editScreenSolution(val){
        this.screenSolution=val
        this.screenSolution.fixedlayer=val.fixedposzarray.length
        this.screenSolution.leaflayer=val.leafposzarray.length
        this.open_dialog = true;
    },
    deleteScreenSolution(val){
        this.$confirm(`此操作将删除名为'${val.name}'的纱网方案, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios.delete(`screen_plan/${val.id}`).then((res) => {
            if (res.code == 1) {
              this.$message({
                type: "success",
                message: res.message,
              });
              this.getScreenSolution()
            }else{
              this.$message.error(res.message)
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    submit() {
      this.is_save = true;
      if (!this.screenSolution.fixedlayer) {
        this.$message.error("请先选择固玻层数");
        this.is_save = false;
        return;
      }
      if (!this.screenSolution.leaflayer) {
        this.$message.error("请先选择扇玻层数");
        this.is_save = false;
        return;
      }
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.$axios[this.screenSolution.id?'put':'post'](this.screenSolution.id?`screen_plan/${this.screenSolution.id}`:"screen_plan", this.screenSolution).then((res) => {
            this.is_save = false;
            if (res.code == 1) {
              this.$message({
                message: res.message,
                type: "success",
              });
              this.open_dialog = false;
              this.screenSolution={};
              this.getScreenSolution();
            } else {
              this.$message.error(res.message);
            }
          });
        } else {
          this.$message.error("请先完成信息填写");
          return false;
        }
      });
    },
    getScreenSolution() {
      this.$axios.get("screen_plan").then((res) => {
        if (res.code == 1) {
            res.data.map(v=>{
                v.fixedposzarray=v.fixedposzarray.split(",").filter(v=>v && v.trim())
                v.leafposzarray=v.leafposzarray.split(",").filter(v=>v && v.trim())
            })
          this.screenSolutionList = res.data;
        }
      });
    },
  },
  mounted() {
    this.getScreenSolution();
  },
};
</script>

<style>
</style>