<template>
  <div @click="toInfo(commit.owner.login, commit.name)" class="commit-item">
    <img @click.stop="toInfo(commit.author.login)" lazy-load class="commit-avatar" :src="commit.author['avatar_url']" alt="avatar">
    <div class="commit">
      <div class="commit-top">
        <p class="commit-name">{{commit.author.login}}</p>
        <p class="commit-date">{{commit.commit.date}}</p>
      </div>
      <p class="commit-desc">{{commit.commit.message}}</p>
      <div class="bottom">
        <p> {{commit.sha}}</p>
        <p class="icon-user"> {{commit.commit['comment_count']}}</p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      commit: {
        type: Object,
        default: {}
      }
    },
    methods: {
      toInfo (user) {
        wx.navigateTo({
          url: `/pages/info/info?login=${user}`
        })
      }
    }
  }
</script>

<style scoped lang='scss'>
  @import './commitItem.scss';
</style>
