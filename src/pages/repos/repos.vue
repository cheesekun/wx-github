<template>
  <div class="repos-container">
    <div v-for="(item, index) in repos" :key="index">
      <repo-item :repo="item" />
    </div>
  </div>
</template>

<script>
  import api from '@/utils/api'
  import { dealRepos } from '@/utils'
  import RepoItem from '@/components/repoItem/repoItem'

  export default {
    async mounted () {
      this.repos = []
      let user = this.$root.$mp.query.login
      this.repos = await this.getOwnRepos(user)
    },
    components: {
      RepoItem
    },
    data () {
      return {
        repos: []
      }
    },
    methods: {
      async getOwnRepos (user) {
        const data = await api.getOwnRepos(user)
        const repos = dealRepos(data)
        return repos
      }
    }

  }
</script>

<style scoped lang='scss'>
  @import './repos.scss';
</style>
