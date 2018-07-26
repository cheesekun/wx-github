<template>
  <div class="following-container">
    <div v-for="(item, index) in followings" :key="index">
      <user-item :item="item" />
    </div>
    <Loading v-if="following.loading"/>
    <load-end v-else-if="following.loadEnd" />
    <no-data v-else-if="following.noData" />
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
    this.followingStack.push(options)

    this.getFollowings()
  },
  onShow () {
    const options = getQuery()
    // vuex
    let followingStack = JSON.parse(JSON.stringify(this.followingStack))
    let len = followingStack.length
    let endStack = followingStack[len - 1]
    if (JSON.stringify(endStack) === JSON.stringify(options)) {
      return
    }
    this.reset()
    user = options.login
    this.getFollowings()
  },
  onUnload () {
    // vuex
    this.followingStack.slice(0, -1)
  },
  onReachBottom () {
    this.getFollowings()
  },
  components: {
    UserItem,
    Loading,
    LoadEnd,
    NoData
  },
  data () {
    return {
      followings: [],
      following: {
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
      this.followings = []
      this.following = {
        q: {
          page: 0
        },
        loading: true,
        loadEnd: false,
        noData: false
      }
    },
    async getFollowings () {
      this.following.q.page += 1
      const q = _query(this.following.q)
      const data = await api.getFollowings(user, q)

      if (data.length === 0) {
        this.following.loading = false
        this.following.q.page -= 1
        if (this.following.q.page === 0) {
          this.following.noData = true
        } else {
          this.following.loadEnd = true
        }
        return
      } else if (data.length < per_page) {
        this.following.loading = false
        this.following.loadEnd = true
      }
      const followings = dealUsers(data)
      this.followings = this.followings.concat(followings)
    },
    ...mapMutations([
      'setFollowingStack'
    ])
  },
  computed: {
    ...mapState([
      'followingStack'
    ])
  }
}
</script>

<style scoped lang='scss'>
  @import './following.scss';
</style>
