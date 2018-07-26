<template>
  <div class="folloers-container">
    <div v-for="(item, index) in followers" :key="index">
      <user-item :item="item" />
    </div>
    <Loading v-if="follower.loading"/>
    <load-end v-else-if="follower.loadEnd" />
    <no-data v-else-if="follower.noData" />
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

let user = ''
export default {
  onLoad () {
    this.reset()
    const options = getQuery()
    user = options.login
    // vuex
    this.followersStack.push(options)

    this.getFollowers()
  },
  onShow () {
    const options = getQuery()
    // vuex
    let followersStack = JSON.parse(JSON.stringify(this.followersStack))
    let len = followersStack.length
    let endStack = followersStack[len - 1]
    if (JSON.stringify(endStack) === JSON.stringify(options)) {
      return
    }
    this.reset()
    user = options.login
    this.getFollowers()
  },
  onUnload () {
    // vuex
    this.followersStack.slice(0, -1)
  },
  onReachBottom () {
    this.getFollowers()
  },
  components: {
    UserItem,
    Loading,
    LoadEnd,
    NoData
  },
  data () {
    return {
      followers: [],
      follower: {
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
      this.followers = []
      this.follower = {
        q: {
          page: 0
        },
        loading: true,
        loadEnd: false,
        noData: false
      }
    },
    async getFollowers () {
      this.follower.q.page += 1
      const q = _query(this.follower.q)
      const data = await api.getFollowers(user, q)

      if (data.length === 0) {
        this.follower.loading = false
        this.follower.q.page -= 1
        if (this.follower.q.page === 0) {
          this.follower.noData = true
        } else {
          this.follower.loadEnd = true
        }
        return
      } else if (data.length < per_page) {
        this.follower.loading = false
        this.follower.loadEnd = true
      }
      const followers = dealUsers(data)
      this.followers = this.followers.concat(followers)
    },
    ...mapMutations([
      'setFollowersStack'
    ])
  },
  computed: {
    ...mapState([
      'followersStack'
    ])
  }
}
</script>

<style scoped lang='scss'>
  @import './followers.scss';
</style>
