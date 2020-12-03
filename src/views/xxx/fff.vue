<template>
  <div class="root">
   22222
  </div>
</template>

<script>
export default {
  data: () => ({
    list:[]
  }),
  methods: {
    getList() {
      return this.$axios.get("list").then((res) => {
        this.list = res.data;
      });
    },
   
  },
  async mounted() {
    //异步
    await this.getList();
  },
};
</script>

<style lang="scss" scoped>
</style>
