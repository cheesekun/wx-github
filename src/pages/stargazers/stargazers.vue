<template>
  <div class="stargazers-container">
    <div v-for="(item, index) in stargazers" :key="index">
      <user-item :item="item" />
    </div>
    <Loading v-if="stargazer.loading"/>
    <load-end v-else-if="stargazer.loadEnd" />
    <no-data v-else-if="stargazer.noData" />
  </div>
</template>

<script>
import api from '@/http/api'
/* eslint-disable */
import { per_page } from '@/utils/config'
import { _query, getQuery, dealUsers } from '@/utils'
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
    this.stargazersStack.push(options)

    this.getStargazers()
  },
  onShow () {
    const options = getQuery()
    // vuex
    let stargazersStack = JSON.parse(JSON.stringify(this.stargazersStack))
    let len = stargazersStack.length
    let endStack = stargazersStack[len - 1]
    if (JSON.stringify(endStack) === JSON.stringify(options)) {
      return
    }
    this.reset()
    owner = options.login
    repo = options.repo
    this.getStargazers()
  },
  onUnload () {
    // vuex
    this.stargazersStack.slice(0, -1)
  },
  onReachBottom () {
    this.getStargazers()
  },
  components: {
    UserItem,
    Loading,
    LoadEnd,
    NoData
  },
  data () {
    return {
      stargazers: [],
      stargazer: {
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
      this.stargazers = []
      this.stargazer= {
        q: {
          page: 0
        },
        loading: true,
        loadEnd: false,
        noData: false
      }
    },
    async getStargazers () {
      this.stargazer.q.page += 1
      const q = _query(this.stargazer.q)
      const data = await api.getStargazers(owner, repo, q)

      if (data.length === 0) {
        this.stargazer.loading = false
        this.stargazer.q.page -= 1
        if (this.stargazers.q.page === 0) {
          this.stargazer.noData = true
        } else {
          this.stargazer.loadEnd = true
        }
        return
      } else if (data.length < per_page) {
        this.stargazer.loading = false
        this.stargazer.loadEnd = true
      }
      const stargazers = dealUsers(data)
      this.stargazers = this.stargazers.concat(stargazers)
    },
    ...mapMutations([
      'setStargazersStack'
    ])
  },
  computed: {
    ...mapState([
      'stargazersStack'
    ])
  }
}
</script>

<style scoped lang='scss'>
  @import './stargazers.scss';
</style>
