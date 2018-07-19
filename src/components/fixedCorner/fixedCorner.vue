<template>
  <div class="fixed-icon">
    <div class="corner-content">{{content}}</div>
  </div>
</template>

<script>
  export default {
    props: {
      content: {
        type: 'String',
        default: ''
      }
    }
  }
</script>

<style scoped lang='scss'>
  @import './fixedCorner.scss';
</style>
