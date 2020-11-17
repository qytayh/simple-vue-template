<template>
  <div class="root">
    <div class="top-btn-area">
      <el-button type="primary" @click="addTlzposSolution">添加轨道方案</el-button>
    </div>
    <el-table :data="tlzposSolutionList" style="width: 800px">
      <el-table-column prop="name" label="名称"> </el-table-column>
      <el-table-column prop="tl_zposarray" label="轨道深度">
        <template slot-scope="scope">
          <div v-for="(v, i) in scope.row.tl_zposarray" :key="`${i}_tl_zposarray`">{{ v }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="sashposzwayList" label="扇偏移值">
        <template slot-scope="scope">
          <div v-for="(v, i) in scope.row.sashposzwayList" :key="`${i}_sashposzwayList`">轨道{{i}}扇偏移值：{{ v }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button
            @click="editTlzposSolution(scope.row)"
            type="text"
            size="small"
            >编辑</el-button
          >
          <el-button
            type="text"
            size="small"
            @click="deleteTlzposSolution(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :title="tlzposSolution.id ? '编辑' : '添加'"
      :visible.sync="open_dialog"
      width="800px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <el-form
        ref="form"
        label-width="150px"
        :model="tlzposSolution"
        v-if="open_dialog"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="名称"
              :rules="[{ required: true, message: `必须填写名称` }]"
              prop="name">
              <el-input
                v-model="tlzposSolution.name"
                :validate-event="false"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="轨道数">
              <el-select
                clearable
                v-model="tlzposSolution.tl_zposarraylayer"
                style="width: 230px"
                @change="tl_zposarraylayerChange"
                placeholder="请选择">
                <el-option
                  v-for="item in [1, 2, 3, 4, 5]"
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
            v-for="(item, i) in tlzposSolution.tl_zposarray"
            :key="`${i}_tl_zposarray`"
          >
            <el-form-item
              :label="`第${i + 1}条轨道深度`"
              :rules="[
                {
                  required: true,
                  message: `必须填写第${i + 1}条轨道深度`,
                },
              ]"
              :prop="'tl_zposarray[' + i + ']'"
            >
              <el-input v-model="tlzposSolution.tl_zposarray[i]"></el-input>
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
            v-for="(item, i) in tlzposSolution.sashposzwayList"
            :key="`${i}_sashposzwayList`"
          >
            <el-form-item
              :label="`轨道${i}_扇偏移值`"
              :rules="[
                {
                  required: i==0?true:false,
                  message: `必须填写轨道0_扇偏移值`,
                },
              ]"
              :prop="'sashposzwayList[' + i + ']'"
            >
              <el-input v-model="tlzposSolution.sashposzwayList[i]" :validate-event="false"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="
            open_dialog = false;
            tlzposSolution = {};
            is_save = false;
          ">取消</el-button
        >
        <el-button type="primary" @click="submit" :loading="is_save"
          >确定</el-button
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
    tlzposSolution: {},
    tlzposSolutionList: [],
  }),
  methods: {
    tl_zposarraylayerChange(val) {
      let arr = [];
      for (let i = 0; i < val; i++) {
        arr.push("");
      }
      this.$set(this.tlzposSolution, "tl_zposarray", arr);
    },
    addTlzposSolution() {
      this.open_dialog = true;
      this.$set(this.tlzposSolution,'sashposzwayList',['','','','',''])
    },
    editTlzposSolution(val) {
      this.tlzposSolution = JSON.parse(JSON.stringify(val));
      this.tlzposSolution.tl_zposarraylayer = this.tlzposSolution.tl_zposarray.length;
      this.open_dialog = true;
    },
    deleteTlzposSolution(val) {
      this.$confirm(
        `此操作将删除名为'${val.name}'的轨道方案, 是否继续?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.$axios.delete(`tlzpos_plan/${val.id}`).then((res) => {
            if (res.code == 1) {
              this.$message({
                type: "success",
                message: res.message,
              });
              this.getTlzposSolution();
            } else {
              this.$message.error(res.message);
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
      if (!this.tlzposSolution.tl_zposarraylayer) {
        this.$message.error("请先选择轨道层数");
        this.is_save = false;
        return;
      }
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.tlzposSolution.sashposzway=JSON.stringify(this.tlzposSolution.sashposzwayList)
          this.$axios[this.tlzposSolution.id ? "put" : "post"](
            this.tlzposSolution.id
              ? `tlzpos_plan/${this.tlzposSolution.id}`
              : "tlzpos_plan",
            this.tlzposSolution
          ).then((res) => {
            this.is_save = false;
            if (res.code == 1) {
              this.$message({
                message: res.message,
                type: "success",
              });
              this.open_dialog = false;
              this.tlzposSolution = {};
              this.getTlzposSolution();
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
    getTlzposSolution() {
      this.$axios.get("tlzpos_plan").then((res) => {
        if (res.code == 1) {
          res.data.map((v) => {
            v.tl_zposarray = v.tl_zposarray
              .split(",")
              .filter((v) => v && v.trim());
            v.sashposzwayList=JSON.parse(v.sashposzway)
          });
          this.tlzposSolutionList = res.data;
        }
      });
    },
  },
  mounted() {
    this.getTlzposSolution();
  },
};
</script>

<style>
</style>