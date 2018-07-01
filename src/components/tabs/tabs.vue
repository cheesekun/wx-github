<template>
  <div class="tabs">
    <div @click="pickTab(item, index)"
      v-for="(item, index) in tabs"
      :key="index"
      class="tabs-item">
      {{item.name}}
    </div>
    <div class="slider" :style="{transform: activeTrans, width: activeWidth}"></div>
  </div>
</template>

<script>
  /**
   * TODO: 给被选中项加高亮
   */
  export default {
    created () {
      const len = 100 / this.tabs.length + '%'
      this.activeWidth = len
    },
    props: {
      tabs: {
        type: Array,
        defalt: []
      },
      index: {
        type: Number,
        defalt: 0
      }
    },
    watch: {
      index (index) {
        const len = index * 100 + '%'
        this.activeTrans = `translateX(${len})`
      }
    },
    data () {
      return {
        activeTrans: 'translateX(0)',
        activeWidth: '',
        currentItem: {}
      }
    },
    methods: {
      pickTab (item, index) {
        const len = index * 100 + '%'
        this.activeTrans = `translateX(${len})`
        this.currentItem = item
        this.$emit('getTab', item)
      }
    }
  }
</script>

<style scoped lang='scss'>
  @import './tabs.scss';
</style>
