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
import api from '@/utils/api'
/* eslint-disable */
import { per_page } from '@/utils/config'
import { _query, getQuery, dealUsers } from '@/utils'
import UserItem from '@/components/userItem/userItem'
import Loading from '@/components/loading/loading'
import LoadEnd from '@/components/loadEnd/loadEnd'
import NoData from '@/components/noData/noData'

let user = ''
export default {
  onShow () {
    this.followers = []
    this.follower = {
      q: {
        page: 0
      },
      loading: true,
      loadEnd: false,
      noData: false
    }
    const options = getQuery()
    user = options.login
    this.getFollowers()
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
    }
  }

}
</script>

<style scoped lang='scss'>
  @import './followers.scss';
</style>
