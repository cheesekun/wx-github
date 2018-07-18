<template>
  <div @click="toRepo(trending.owner.login, trending.name)" class="trending-item">
    <div class="top">
      <p class="trending-name">{{trending.owner.login}}/{{trending.name}}</p>
      <p class="trending-lang" v-if="trending.language">{{trending.language}}<span class="lang-color" :style="{background: trending.color}"></span></p>
    </div>
    <p class="trending-desc">{{trending.description}}</p>
    <div class="bottom">
      <p class="icon-star"> {{trending['stargazers_count']}}</p>
      <p class="icon-flow-branch"> {{trending['forks_count']}}</p>
      <p class="icon-star increment"> {{trending.increment}} stars today</p>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      trending: {
        type: Object,
        defalt: {}
      }
    },
    data () {
      return {}
    },
    methods: {
      toInfo (user) {
        wx.navigateTo({
          url: `/pages/info/info?login=${user}`
        })
      },
      toRepo (user, repo) {
        wx.navigateTo({
          url: `/pages/repo/repo?owner=${user}&repo=${repo}`
        })
      }
    }
  }
</script>

<style scoped lang='scss'>
  @import './trendItem.scss';
</style>
