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
import api from '@/utils/api'
/* eslint-disable */
import { per_page } from '@/utils/config'
import { _query, getQuery, dealRepos } from '@/utils'
import RepoItem from '@/components/repoItem/repoItem'
import Loading from '@/components/loading/loading'
import LoadEnd from '@/components/loadEnd/loadEnd'
import NoData from '@/components/noData/noData'

let user = ''
export default {
  onShow () {
    this.repos = []
    this.repo = {
      q: {
        page: 0
      },
      loading: true,
      loadEnd: false,
      noData: false
    }
    const options = getQuery()
    user = options.login
    this.getRepos()
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
    }
  }

}
</script>

<style scoped lang='scss'>
  @import './repos.scss';
</style>
