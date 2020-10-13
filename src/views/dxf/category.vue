<template>
  <div class="root">
    <div class="top-btn-area">
      <el-button type="primary" @click="addCategory">添加目录</el-button>
    </div>
    <el-table :data="category_list" style="width: 500px">
      <el-table-column prop="name" label="名称" width="300"> </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button @click="editCategory(scope.row)" type="text" size="small"
            >编辑</el-button
          >
          <el-button type="text" size="small" @click="deleteCategory(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      :show-close='false'
      :title="category.id ? '编辑' : '添加'"
      :visible.sync="open_dialog"
      width="400px"
    >
      <el-form ref="form" :model="category" label-width="80px">
        <el-form-item label="名称">
          <el-input v-model="category.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="open_dialog = false">取消</el-button>
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
    category: {
      id: "",
      name: "",
    },
    category_list: [],
  }),
  methods: {
    deleteCategory(val) {
      this.$confirm(`此操作将删除名为'${val.name}'的目录, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios.delete(`category/${val.id}`).then((res) => {
            if (res.code == 1) {
              this.$message({
                type: "success",
                message: res.message,
              });
              this.getCategory()
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
    editCategory(val) {
      this.category.id = val.id;
      this.category.name = val.name;
      this.open_dialog = true;
    },
    addCategory() {
      this.open_dialog = true;
    },
    submit() {
      this.is_save=true
      this.$axios[this.category.id ? "put" : "post"](
        this.category.id ? `category/${this.category.id}` : "category",
        { name: this.category.name }
      ).then((res) => {
        this.is_save=false
        if (res.code == 1) {
          this.$message({
            message: res.message,
            type: "success",
          });
          this.open_dialog = false;
          this.category.id = "";
          this.category.name = "";
          this.getCategory();
        } else {
          this.$message.error(res.message);
        }
      });
    },
    getCategory() {
      this.$axios.get("category").then((res) => {
        this.category_list = res.data;
      });
    },
  },
  mounted() {
    this.getCategory();
  },
};
</script>

<style lang="scss" scoped>
</style>