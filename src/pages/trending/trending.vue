<template>
  <div class="trending-container">
    <div class="picker">
      <div class="bg"></div>
      <div class="picker-item">
        <picker @change="pickerChange" :value="index" :range="langs">
          <div class="picker-item">
            {{langs[index]}} <span class="icon-move-down"></span>
          </div>
        </picker>
      </div>
    </div>
    <div id="tabs" class="tabs">
      <Tabs @getTab="getTab" :tabs="tabs" :index="currentIndex" />
    </div>
  </div>
</template>

<script>
/**
 * FIXME: 那个高1px是什么玩意
*/
// import wx from 'wx'
// import api from '@/utils/api'
import Tabs from '@/components/tabs/tabs'

export default {
  created () {

  },
  data () {
    return {
      langs: ['All Language', 'JavaScript', 'PHP', 'Node', 'Java', 'C++', 'C', 'Python', 'Go'],
      index: 0,
      tabs: [{
        id: 'daily',
        name: 'DAYLY'
      }, {
        id: 'weekly',
        name: 'WEEKLY'
      }, {
        id: 'monthly',
        name: 'MONTHLY'
      }],
      currentIndex: 1
    }
  },
  components: {
    Tabs
  },
  methods: {
    pickerChange (e) {
      this.index = e.mp.detail.value
      console.log(e.mp.detail.value)
    },
    getTab (data) {
      // this.currentId = data.id
      console.log(data)
    }
  }
}
</script>

<style scoped lang="scss">
 @import './trending.scss';
</style>
