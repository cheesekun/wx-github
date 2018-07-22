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
    this.followings = []
    this.following = {
      q: {
        page: 0
      },
      loading: true,
      loadEnd: false,
      noData: false
    }
    const options = getQuery()
    user = options.login
    this.getFollowings()
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
    }
  }

}
</script>

<style scoped lang='scss'>
  @import './following.scss';
</style>
