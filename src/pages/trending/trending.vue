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
    <swiper @change="pageChange" :style="{height: height}" class="list" :current-item-id="currentId" duration="200">
      <swiper-item item-id="daily">
        <Loading v-if="!trendingD.length" />
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
        <Loading v-if="!trendingW.length" />
        <scroll-view
        v-if="trendingW.length"
        class="list-view"
        :style="{height: height}"
        enable-back-to-top="true"
        scroll-y="true">
          <div class="repo-item" v-for="(item, index) in trendingW" :key="index">
            <trending-item :trending="item"></trending-item>
          </div>
        </scroll-view>
      </swiper-item>
      <swiper-item item-id="monthly">
        <Loading v-if="!trendingM.length" />
        <scroll-view
        v-if="trendingM.length"
        class="list-view"
        :style="{height: height}"
        enable-back-to-top="true"
        scroll-y="true">
          <div class="repo-item" v-for="(item, index) in trendingM" :key="index">
            <trending-item :trending="item"></trending-item>
          </div>
        </scroll-view>
      </swiper-item>
    </swiper>
  </div>
</template>

<script>
/**
 * FIXME: 那个高1px是什么玩意
*/
import Tabs from '@/components/tabs/tabs'
import Loading from '@/components/loading/loading'
import TrendingItem from '@/components/trendingItem/trendingItem'
import api from '@/http/api'
import { dealTrending } from '@/utils'
import { mapMutations } from 'vuex'

export default {
  onShareAppMessage () {
    return {
      title: 'Trending'
    }
  },
  async created () {
    wx.getSystemInfo({
      success: (res) => {
        this.height = res.windowHeight
      }
    })
  },
  async onLoad () {
    let query = wx.createSelectorQuery()

    query.select('#picker').boundingClientRect()
    query.select('#tabs').boundingClientRect()
    query.exec(res => {
      let pickerH = res[0].height
      let tabsH = res[1].height

      this.height = this.height - pickerH - tabsH + 'px'
      this.assignTabsH(tabsH)
    })

    this.trendingD = await this.getTrending(this.currentId, this.langs[this.index])
  },
  data () {
    return {
      langs: ['All Language', 'JavaScript', 'PHP', 'Java', 'C++', 'C', 'Python', 'Go', 'Vue', 'TypeScript', 'C#'],
      index: 0,
      tabs: [{
        id: 'daily',
        name: 'DAILY'
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
      if (e.mp.detail.value === this.index) {
        return
      }
      this.index = e.mp.detail.value
      this.trendingD = []
      this.trendingW = []
      this.trendingM = []
      this.switchPage()
    },
    getTab (data) {
      this.currentId = data.id
    },
    async getTrending (time, lang) {
      const data = await api.getTrending(time, lang)
      return dealTrending(data)
    },
    async pageChange (e) {
      const currentItemId = e.mp.detail.currentItemId
      this.currentId = currentItemId
      this.currentIndex = e.mp.detail.current
      this.switchPage()
    },
    async switchPage () {
      if (!this.trendingW.length && this.currentId === 'weekly') {
        this.trendingW = await this.getTrending('weekly', this.langs[this.index])
      } else if (!this.trendingM.length && this.currentId === 'monthly') {
        this.trendingM = await this.getTrending('monthly', this.langs[this.index])
      } else if (!this.trendingD.length && this.currentId === 'daily') {
        this.trendingD = await this.getTrending('daily', this.langs[this.index])
      }
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
