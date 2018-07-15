<template>
  <div class="about-container">
    <div class="hub">
      <img src="http://oghi29b7h.bkt.clouddn.com/github01.png" alt="github01" />
      <div class="content">
        <p class="title">GitHub01</p>
      </div>
    </div>
    <div class="code block-bg">
      <h2>Code</h2>
      <div @click="toRepo" class="item">
        <i class="icon-embed2"></i>
        <div class="content">
          <p class="title">Scource code</p>
          <p class="desc">Star to support me</p>
        </div>
      </div>
    </div>
    <div class="author block-bg">
      <h2>Author</h2>
      <div @click="toUser" class="item">
        <i class="icon-user"></i>
        <div class="content">
          <p class="title">cheesekun</p>
          <p class="desc">GuangZhou,China</p>
        </div>
      </div>
      <div @click="toUser" class="item">
        <i class="icon-github"></i>
        <div class="content">
          <p class="title">Follow on Github</p>
        </div>
      </div>
      <div class="item">
        <i class="icon-envelop"></i>
        <div class="content">
          <p class="title">Email</p>
          <p class="desc">cheesekun1997@gmail.com</p>
        </div>
      </div>
    </div>
    <div class="todo block-bg">
      <h2>Todo</h2>
    </div>
  </div>
</template>

<script>
import wx from 'wx'

export default {
  methods: {
    toRepo () {
      wx.navigateTo({
        url: `/pages/repo/repo?owner=cheesekun&repo=wx-github`
      })
    },
    toUser () {
      wx.navigateTo({
        url: `/pages/info/info?login=cheesekun`
      })
    }
  }
}
</script>

<style scoped lang='scss'>
  @import './about.scss';
</style>
