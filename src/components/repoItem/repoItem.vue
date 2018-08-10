<template>
  <div @click="toRepo(repo.owner.login, repo.name)" class="repo-item">
    <img @click.stop="toInfo(repo.owner.login)" lazy-load class="repo-avatar" :src="repo.owner['avatar_url']" alt="avatar">
    <div class="info">
      <div class="top">
        <p class="repo-name">{{repo.name}}</p>
        <p class="repo-lang" v-if="repo.language">{{repo.language}}<span class="lang-color" :style="{background: repo.color}"></span></p>
      </div>
      <p class="repo-desc">{{repo.description}}</p>
      <div class="bottom">
        <p class="icon-star"> {{repo['stargazers_count']}}</p>
        <p class="icon-flow-branch"> {{repo['forks_count']}}</p>
        <p class="icon-user user"> {{repo.owner.login}}</p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      repo: {
        types: Object,
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
  @import './repoItem.scss';
</style>
