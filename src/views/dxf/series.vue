<template>
  <div class="root">
    <div class="top-btn-area">
      <el-button type="primary" @click="addSeries">添加系列</el-button>
    </div>
    <el-table :data="seriesList" style="width:100%">
      <el-table-column prop="name" label="系列名称" > </el-table-column>
      <el-table-column prop="serie_type" label="系列" > </el-table-column>
      <el-table-column prop="category_name" label="目录" > </el-table-column>
      <el-table-column prop="glass_plan_name" label="玻璃方案" > </el-table-column>
      <el-table-column prop="screen_plan_name" label="纱网方案" > </el-table-column>
      <el-table-column prop="tlzpos_plan_name" label="轨道方案" > </el-table-column>
      <el-table-column label="操作" >
        <template slot-scope="scope">
          <el-button @click="editSeries(scope.row)" type="text" size="small">编辑</el-button>
          <el-button type="text" size="small" @click="deleteSeries(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data: () => ({
    seriesList:[],
    glassSolutionList:[],
    category_list:[],
    screenSolutionList:[],
    tlzposSolutionList:[]
  }),
  methods: {
    addSeries() {

    },
    getSeriesList(){
      return this.$axios.get('')

    },
    getCategory() {
     return this.$axios.get("category").then((res) => {
        this.category_list = res.data;
          console.log('1')
      });
    },
    getGlassSolution() {
      return this.$axios.get("glass_plan").then((res) => {
        if (res.code == 1) {
            res.data.map(v=>{
                v.fixedposzarray=v.fixedposzarray.split(",").filter(v=>v && v.trim())
                v.leafposzarray=v.leafposzarray.split(",").filter(v=>v && v.trim())
            })
          this.glassSolutionList = res.data;
          console.log('2')
        }
      });
    },
    getScreenSolution() {
      return this.$axios.get("screen_plan").then((res) => {
        if (res.code == 1) {
            res.data.map(v=>{
                v.fixedposzarray=v.fixedposzarray.split(",").filter(v=>v && v.trim())
                v.leafposzarray=v.leafposzarray.split(",").filter(v=>v && v.trim())
            })
          this.screenSolutionList = res.data;
          console.log('3')

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
          console.log('4')
        }
      });
    },
  },
  async mounted(){
   await this.getCategory()
   await this.getGlassSolution()
   await this.getScreenSolution()
   await this.getTlzposSolution()
   await this.getSeriesList()
  }
};
</script>

<style lang="scss" scoped>
</style>