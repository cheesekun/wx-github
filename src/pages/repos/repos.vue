<template>
  <div class="repos-container">
    <div v-for="(item, index) in repos" :key="index">
      <repo-item :repo="item" />
    </div>
    <Loading v-if="repo.loading"/>
    <load-end v-else-if="repo.loadEnd" />
    <no-data v-else-if="repo.noData" />
  </div>
</template>

<script>
import api from '@/http/api'
/* eslint-disable */
import { per_page } from '@/utils/config'
import { _query, getQuery, dealRepos } from '@/utils'
import RepoItem from '@/components/repoItem/repoItem'
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
    this.reposStack.push(options)

    this.getRepos()
  },
  onShow () {
    const options = getQuery()
    // vuex
    let reposStack = JSON.parse(JSON.stringify(this.reposStack))
    let len = reposStack.length
    let endStack = reposStack[len - 1]
    if (JSON.stringify(endStack) === JSON.stringify(options)) {
      return
    }
    this.reset()
    user = options.login
    this.getRepos()
  },
  onUnload () {
    // vuex
    this.reposStack.slice(0, -1)
  },
  onReachBottom () {
    this.getRepos()
  },
  components: {
    RepoItem,
    Loading,
    LoadEnd,
    NoData
  },
  data () {
    return {
      repos: [],
      repo: {
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
      this.repos = []
      this.repo = {
        q: {
          page: 0
        },
        loading: true,
        loadEnd: false,
        noData: false
      }
    },
    async getRepos () {
      this.repo.q.page += 1
      const q = _query(this.repo.q)
      const data = await api.getOwnRepos(user, q)

      if (data.length === 0) {
        this.repo.loading = false
        this.repo.q.page -= 1
        if (this.repo.q.page === 0) {
          this.repo.noData = true
        } else {
          this.repo.loadEnd = true
        }
        return
      } else if (data.length < per_page) {
        this.repo.loading = false
        this.repo.loadEnd = true
      }
      const repos = dealRepos(data)
      this.repos = this.repos.concat(repos)
    },
    ...mapMutations([
      'setReposStack'
    ])
  },
  computed: {
    ...mapState([
      'reposStack'
    ])
  }
}
</script>

<style scoped lang='scss'>
  @import './repos.scss';
</style>
