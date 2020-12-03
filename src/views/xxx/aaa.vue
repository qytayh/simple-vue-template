<template>
  <div class="root">
   77777
  </div>
</template>

<script>
export default {
  data: () => ({
   
  }),
  methods: {
    deleteCategory(val) {
      this.$confirm(`此操作将删除名为'${val.name}'的目录, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          //调用axios  删除
          this.$axios.delete(`category/${val.id}`).then((res) => {
           
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
   
  },
  mounted() {
  },
};
</script>

<style lang="scss" scoped>
</style>