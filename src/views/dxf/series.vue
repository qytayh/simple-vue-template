<template>
  <div class="root">
    <div class="top-btn-area">
      <el-button type="primary" @click="addSeries">添加系列</el-button>
    </div>
    <el-table :data="seriesList" style="width: 100%">
      <el-table-column prop="name" label="系列名称"></el-table-column>
      <el-table-column prop="serie_type_name" label="类型"></el-table-column>
      <el-table-column prop="category_name" label="目录"></el-table-column>
      <el-table-column
        prop="glass_plan_name"
        label="玻璃方案"
      ></el-table-column>
      <el-table-column
        prop="screen_plan_name"
        label="纱网方案"
      ></el-table-column>
      <el-table-column
        prop="tlzpos_plan_name"
        label="轨道方案"
      ></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="editSeries(scope.row)" type="text" size="small"
            >编辑</el-button
          >
          <el-button type="text" size="small" @click="deleteSeries(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      :title="series.id ? '编辑' : '添加'"
      :visible.sync="open_dialog"
      width="800px"
    >
      <el-form ref="form" :model="series" label-width="150px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="系列名称">
              <el-input v-model="series.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="类型">
              <el-select
                clearable
                v-model="series.serie_type"
                style="width: 230px"
                @change="serie_type_change"
                placeholder="请选择"
              >
                <el-option
                  v-for="(v, i) in serie_type_list"
                  :key="i"
                  :label="v.label"
                  :value="v.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="目录">
              <el-select
                clearable
                v-model="series.category_id"
                style="width: 230px"
                @change="category_change"
                placeholder="请选择"
              >
                <el-option
                  v-for="(v, i) in category_list"
                  :key="i"
                  :label="v.name"
                  :value="v.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="玻璃方案">
              <el-select
                clearable
                v-model="series.glass_plan_id"
                style="width: 230px"
                @change="glass_plan_change"
                placeholder="请选择"
              >
                <el-option
                  v-for="(v, i) in glassSolutionList"
                  :key="i"
                  :label="v.name"
                  :value="v.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="纱网方案">
              <el-select
                clearable
                v-model="series.screen_plan_id"
                style="width: 230px"
                @change="screen_plan_change"
                placeholder="请选择"
              >
                <el-option
                  v-for="(v, i) in screenSolutionList"
                  :key="i"
                  :label="v.name"
                  :value="v.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="轨道方案">
              <el-select
                clearable
                v-model="series.tlzpos_plan_id"
                style="width: 230px"
                @change="tlzpos_plan_change"
                placeholder="请选择"
              >
                <el-option
                  v-for="(v, i) in tlzposSolutionList"
                  :key="i"
                  :label="v.name"
                  :value="v.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="open_dialog = false;series={}">取消</el-button>
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
    series: {},
    open_dialog: false,
    is_save: false,
    seriesList: [],
    glassSolutionList: [],
    category_list: [],
    screenSolutionList: [],
    tlzposSolutionList: [],
    serie_type_list: [
      {
        label: "平开",
        value: 1,
      },
      {
        label: "推拉",
        value: 2,
      },
      {
        label: "折叠",
        value: 3,
      },
    ],
  }),
  methods: {
    editSeries(val) {
      this.series = val;
      this.open_dialog = true;
    },
    deleteSeries(val) {
      this.$confirm(
        `此操作将删除名为'${val.name}'的系列, 是否继续?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.$axios.delete(`series/${val.id}`).then((res) => {
            if (res.code == 1) {
              this.$message({
                type: "success",
                message: res.message,
              });
              this.getSeriesList();
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
      this.$axios[this.series.id ? "put" : "post"](
        this.series.id ? `series/${this.series.id}` : "series",
        this.series
      ).then((res) => {
        this.is_save = false;
        if (res.code == 1) {
          this.$message({
            type: "success",
            message: res.message,
          });
          this.open_dialog = false;
          this.series = {};
          this.getSeriesList();
        }
      });
    },
    addSeries() {
      this.open_dialog = true;
    },
    getSeriesList() {
      return this.$axios.get("series").then((res) => {
        res.data.map((v) => {
          v.serie_type_name = this.serie_type_list.filter((item) => {
            return item.value == v.serie_type;
          })[0]?this.serie_type_list.filter((item) => {
            return item.value == v.serie_type;
          })[0].label:'';
          v.category_name = this.category_list.filter((item) => {
            return item.id == v.category_id;
          })[0]?this.category_list.filter((item) => {
            return item.id == v.category_id;
          })[0].name:'';
          v.glass_plan_name = this.glassSolutionList.filter((item) => {
            return item.id == v.glass_plan_id;
          })[0]?this.glassSolutionList.filter((item) => {
            return item.id == v.glass_plan_id;
          })[0].name:'';
          v.screen_plan_name = this.screenSolutionList.filter((item) => {
            return item.id == v.screen_plan_id;
          })[0]?this.screenSolutionList.filter((item) => {
            return item.id == v.screen_plan_id;
          })[0].name:'';
          v.tlzpos_plan_name = this.tlzposSolutionList.filter((item) => {
            return item.id == v.tlzpos_plan_id;
          })[0]?this.tlzposSolutionList.filter((item) => {
            return item.id == v.tlzpos_plan_id;
          })[0].name:'';
        });
        this.seriesList = res.data;
      });
    },
    getCategory() {
      return this.$axios.get("category").then((res) => {
        this.category_list = res.data;
      });
    },
    getGlassSolution() {
      return this.$axios.get("glass_plan").then((res) => {
        if (res.code == 1) {
          res.data.map((v) => {
            v.fixedposzarray = v.fixedposzarray
              .split(",")
              .filter((v) => v && v.trim());
            v.leafposzarray = v.leafposzarray
              .split(",")
              .filter((v) => v && v.trim());
          });
          this.glassSolutionList = res.data;
        }
      });
    },
    getScreenSolution() {
      return this.$axios.get("screen_plan").then((res) => {
        if (res.code == 1) {
          res.data.map((v) => {
            v.fixedposzarray = v.fixedposzarray
              .split(",")
              .filter((v) => v && v.trim());
            v.leafposzarray = v.leafposzarray
              .split(",")
              .filter((v) => v && v.trim());
          });
          this.screenSolutionList = res.data;
        }
      });
    },
    getTlzposSolution() {
      return this.$axios.get("tlzpos_plan").then((res) => {
        if (res.code == 1) {
          res.data.map((v) => {
            v.tl_zposarray = v.tl_zposarray
              .split(",")
              .filter((v) => v && v.trim());
          });
          this.tlzposSolutionList = res.data;
        }
      });
    },
    serie_type_change(val) {
      let arr=this.serie_type_list.filter((v) => {
        return v.value == val;
      })
      this.series.serie_type_name = arr&&arr[0]?arr[0].label:''
    },
    category_change(val) {
      let arr = this.category_list.filter((v) => {
        return v.id == val;
      })
      this.series.category_name = arr&&arr[0]?arr[0].name:'';
    },
    glass_plan_change(val) {
      let arr = this.glassSolutionList.filter((v) => {
        return v.id == val;
      })
      this.series.glass_plan_name = arr&&arr[0]?arr[0].name:'';
    },
    screen_plan_change(val) {
      let arr=this.screenSolutionList.filter((v) => {
        return v.id == val;
      })
      this.series.screen_plan_name = arr&&arr[0]?arr[0].name:'';
    },
    tlzpos_plan_change(val) {
      let arr =this.tlzposSolutionList.filter((v) => {
        return v.id == val;
      })
      this.series.tlzpos_plan_name = arr&&arr[0]?arr[0].name:'';
    },
  },
  async mounted() {
    await this.getCategory();
    await this.getGlassSolution();
    await this.getScreenSolution();
    await this.getTlzposSolution();
    await this.getSeriesList();
  },
};
</script>

<style lang="scss" scoped>
</style>