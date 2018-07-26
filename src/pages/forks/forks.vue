<template>
  <div class="forks-container">
    <div v-for="(item, index) in forks" :key="index">
      <user-item :item="item" />
    </div>
    <Loading v-if="fork.loading"/>
    <load-end v-else-if="fork.loadEnd" />
    <no-data v-else-if="fork.noData" />
  </div>
</template>

<script>
import api from '@/http/api'
/* eslint-disable */
import { per_page } from '@/utils/config'
import { _query, getQuery, dealForks } from '@/utils'
import UserItem from '@/components/userItem/userItem'
import Loading from '@/components/loading/loading'
import LoadEnd from '@/components/loadEnd/loadEnd'
import NoData from '@/components/noData/noData'
import { mapState, mapMutations } from 'vuex'

let owner = ''
let repo = ''
export default {
  onLoad () {
    this.reset()
    const options = getQuery()
    owner = options.login
    repo = options.repo
    // vuex
    this.forksStack.push(options)

    this.getForks()
  },
  onShow () {
    const options = getQuery()
    // vuex
    let forksStack = JSON.parse(JSON.stringify(this.forksStack))
    let len = forksStack.length
    let endStack = forksStack[len - 1]
    if (JSON.stringify(endStack) === JSON.stringify(options)) {
      return
    }
    this.reset()
    owner = options.login
    repo = options.repo
    this.getForks()
  },
  onUnload () {
    // vuex
    this.forksStack.slice(0, -1)
  },
  onReachBottom () {
    this.getForks()
  },
  components: {
    UserItem,
    Loading,
    LoadEnd,
    NoData
  },
  data () {
    return {
      forks: [],
      fork: {
        q: {
          page: 0
        },
        loading: true,
        loadEnd: false,
        noData: false
      }
    }
  },
  methods: {
    reset () {
      this.forks = []
      this.fork= {
        q: {
          page: 0
        },
        loading: true,
        loadEnd: false,
        noData: false
      }
    },
    async getForks () {
      this.fork.q.page += 1
      const q = _query(this.fork.q)
      const data = await api.getForks(owner, repo, q)

      if (data.length === 0) {
        this.fork.loading = false
        this.fork.q.page -= 1
        if (this.fork.q.page === 0) {
          this.fork.noData = true
        } else {
          this.fork.loadEnd = true
        }
        return
      } else if (data.length < per_page) {
        this.fork.loading = false
        this.fork.loadEnd = true
      }
      const forks = dealForks(data)
      this.forks = this.forks.concat(forks)
    },
    ...mapMutations([
      'setForksStack'
    ])
  },
  computed: {
    ...mapState([
      'forksStack'
    ])
  }
}
</script>

<style scoped lang='scss'>
  @import './forks.scss';
</style>
