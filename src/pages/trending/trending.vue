<template>
  <div class="trending-container">
    <div id="picker" class="picker">
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
    <!-- <Loading /> -->
    <swiper @change="pageChange" :style="{height: height}" class="list" :current-item-id="currentId" duration="200">
      <swiper-item item-id="daily">
        <scroll-view
        class="list-view"
        :style="{height: height}"
        enable-back-to-top="true"
        scroll-y="true">
          <div class="repo-item" v-for="(item, index) in trendingD" :key="index">
            <trending-item :trending="item"></trending-item>
          </div>
        </scroll-view>
      </swiper-item>
      <swiper-item item-id="weekly">
        <p>2</p>
      </swiper-item>
      <swiper-item item-id="monthly">
        <p>3</p>
      </swiper-item>
    </swiper>
  </div>
</template>

<script>
/**
 * FIXME: 那个高1px是什么玩意
 * TODO: 给weekly和monthly添加转场的loading
*/
// import wx from 'wx'
// import api from '@/utils/api'
import Tabs from '@/components/tabs/tabs'
import Loading from '@/components/loading/loading'
import TrendingItem from '@/components/trendingItem/trendingItem'
import api from '@/utils/api'
import { dealTrending } from '@/utils'
import { mapMutations } from 'vuex'

export default {
  async created () {
    wx.getSystemInfo({
      success: (res) => {
        this.height = res.windowHeight
      }
    })

    this.trendingD = await this.getTrending(this.currentId, this.langs[this.index])
  },
  onLoad () {
    let query = wx.createSelectorQuery()

    query.select('#picker').boundingClientRect()
    query.select('#tabs').boundingClientRect()
    query.exec(res => {
      let pickerH = res[0].height
      let tabsH = res[1].height

      this.height = this.height - pickerH - tabsH + 'px'
      this.assignTabsH(tabsH)
    })
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
      height: '',
      trendingD: [],
      trendingW: [],
      trendingM: [],
      currentId: 'daily',
      currentIndex: 0
    }
  },
  components: {
    Tabs,
    Loading,
    TrendingItem
  },
  methods: {
    pickerChange (e) {
      this.index = e.mp.detail.value
      console.log(e.mp.detail.value)
    },
    getTab (data) {
      // this.currentId = data.id
      console.log(data)
    },
    async getTrending (time, lang) {
      const data = await api.getTrending(time, lang)
      return dealTrending(data.data)
    },
    ...mapMutations([
      'assignTabsH'
    ])
  }
}
</script>

<style scoped lang="scss">
 @import './trending.scss';
</style>
