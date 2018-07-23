<template>
  <div class="members-container">
    <div v-for="(item, index) in members" :key="index">
      <user-item :item="item" />
    </div>
    <Loading v-if="member.loading"/>
    <load-end v-else-if="member.loadEnd" />
    <no-data v-else-if="member.noData" />
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
import { mapState, mapMutations } from 'vuex'

let user = ''
export default {
  onLoad () {
    this.reset()
    const options = getQuery()
    user = options.login
    // vuex
    this.membersStack.push(options)

    this.getMembers()
  },
  onShow () {
    const options = getQuery()
    // vuex
    let membersStack = JSON.parse(JSON.stringify(this.membersStack))
    let len = membersStack.length
    let endStack = membersStack[len - 1]
    if (JSON.stringify(endStack) === JSON.stringify(options)) {
      return
    }
    this.reset()
    user = options.login
    this.getMembers()
  },
  onUnload () {
    // vuex
    this.membersStack.slice(0, -1)
  },
  onReachBottom () {
    this.getMembers()
  },
  components: {
    UserItem,
    Loading,
    LoadEnd,
    NoData
  },
  data () {
    return {
      members: [],
      member: {
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
      this.members = []
      this.member = {
        q: {
          page: 0
        },
        loading: true,
        loadEnd: false,
        noData: false
      }
    },
    async getMembers () {
      this.member.q.page += 1
      const q = _query(this.member.q)
      const data = await api.getMembers(user, q)

      if (data.length === 0) {
        this.member.loading = false
        this.member.q.page -= 1
        if (this.member.q.page === 0) {
          this.member.noData = true
        } else {
          this.member.loadEnd = true
        }
        return
      } else if (data.length < per_page) {
        this.member.loading = false
        this.member.loadEnd = true
      }
      const members = dealUsers(data)
      this.members = this.members.concat(members)
    },
    ...mapMutations([
      'setMembersStack'
    ])
  },
  computed: {
    ...mapState([
      'membersStack'
    ])
  }
}
</script>

<style scoped lang='scss'>
  @import './members.scss';
</style>
