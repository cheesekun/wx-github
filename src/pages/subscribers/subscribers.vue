<template>
  <div class="subscribers-container">
    <div v-for="(item, index) in subscribers" :key="index">
      <user-item :item="item" />
    </div>
    <Loading v-if="subscriber.loading"/>
    <load-end v-else-if="subscriber.loadEnd" />
    <no-data v-else-if="subscriber.noData" />
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
    this.subscribersStack.push(options)

    this.getSubscribers()
  },
  onShow () {
    const options = getQuery()
    // vuex
    let subscribersStack = JSON.parse(JSON.stringify(this.subscribersStack))
    let len = subscribersStack.length
    let endStack = subscribersStack[len - 1]
    if (JSON.stringify(endStack) === JSON.stringify(options)) {
      return
    }
    this.reset()
    owner = options.login
    repo = options.repo
    this.getSubscribers()
  },
  onUnload () {
    // vuex
    this.subscribersStack.slice(0, -1)
  },
  onReachBottom () {
    this.getSubscribers()
  },
  components: {
    UserItem,
    Loading,
    LoadEnd,
    NoData
  },
  data () {
    return {
      subscribers: [],
      subscriber: {
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
      this.subscribers = []
      this.subscriber= {
        q: {
          page: 0
        },
        loading: true,
        loadEnd: false,
        noData: false
      }
    },
    async getSubscribers () {
      this.subscriber.q.page += 1
      const q = _query(this.subscriber.q)
      const data = await api.getSubscribers(owner, repo, q)

      if (data.length === 0) {
        this.subscriber.loading = false
        this.subscriber.q.page -= 1
        if (this.subscriber.q.page === 0) {
          this.subscriber.noData = true
        } else {
          this.subscriber.loadEnd = true
        }
        return
      } else if (data.length < per_page) {
        this.subscriber.loading = false
        this.subscriber.loadEnd = true
      }
      const subscribers = dealUsers(data)
      this.subscribers = this.subscribers.concat(subscribers)
    },
    ...mapMutations([
      'setSubscribersStack'
    ])
  },
  computed: {
    ...mapState([
      'subscribersStack'
    ])
  }
}
</script>

<style scoped lang='scss'>
  @import './subscribers.scss';
</style>
