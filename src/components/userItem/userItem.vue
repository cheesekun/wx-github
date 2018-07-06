<template>
  <div @click="toInfo()" class="user-item">
    <img class="user-avatar" lazy-load :src="item['avatar_url']" alt="avatar">
    <p class="user-name">{{item['login']}}</p>
  </div>
</template>

<script>
  export default {
    props: {
      item: {
        type: 'Object',
        default: {}
      }
    },
    methods: {
      toInfo () {
        wx.navigateTo({
          url: `/pages/info/info?login=${this.item.login}`
        })
      }
    }
  }
</script>

<style scoped lang='scss'>
  @import './userItem.scss';
</style>
