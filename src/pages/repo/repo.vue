<template>
  <div>repo</div>
</template>

<script>
  export default {
    mounted () {
      console.log(this.$root.$mp.query)
    },
    data () {
      return {

      }
    }
  }
</script>

<style scoped lang='scss'>
  @import './repo.scss';
</style>
