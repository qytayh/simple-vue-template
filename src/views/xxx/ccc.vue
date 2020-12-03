<template>
  <div class="root">
    55555
  </div>
</template>

<script>
export default {
  data: () => ({
   
  }),
  methods: {
    /** 保存 **/
    async submit() {
      
      let params = { name: this.hardware_solution.name, plan_val };

      //使用axios的post方法
      this.$axios.post("接口名", params).then((res) => {
       
      }).catch(err=> { this.$message.error("保存失败"); });
    },
   
  },
  computed: {

   
  },
  mounted() {
   
  },
};
</script>

<style>
</style>