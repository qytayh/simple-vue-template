<template>
  <div class="root">
    <div class="top-btn-area">
      <el-button type="primary" @click="addCategory">添加目录</el-button>
    </div>
    <el-dialog :title="category.id ? '编辑' : '添加'" :visible.sync="open_dialog" width="400px">
      <el-form ref="form" :model="category" label-width="80px">
        <el-form-item label="名称">
          <el-input v-model="category.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="open_dialog = false">取消</el-button>
        <el-button type="primary" @click="submit" :loading="is_save">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data: () => ({
    open_dialog: false,
    is_save:false,
    category: {
        id:'',
        name:''
    },
  }),
  methods: {

    addCategory() {
      this.open_dialog = true;
    },
    submit(){

    },
    getCategory(){
        
    }
  },
  mounted(){
      this.getCategory()
  }
};
</script>

<style lang="scss" scoped>
</style>