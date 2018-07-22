<template>
  <div @click="toRepo(event.repo.name)" class="event-item">
    <img @click.stop="toInfo(event.actor.login)" lazy-load class="event-avatar" :src="event.actor['avatar_url']" alt="avatar">
    <div class="event">
      <div class="event-top">
        <p class="event-name">{{event.actor.login}}</p>
        <p class="event-date">{{event['created_at']}}</p>
      </div>
      <div v-if="event.type === 'PushEvent'" class="event-desc">
        <p class="title">Push to {{event.payload.ref}} at <span class="strong">{{event.repo.name}}</span></p>
        <div class="small">
          <p v-for="(item, index) in event.payload.commits" :key="index">
            <span class="sha">{{item.sha}}</span>
            <span class="msg">{{item.message}}</span>
          </p>
        </div>
      </div>
      <div v-if="event.type === 'WatchEvent'" class="event-desc">
        <p class="title">{{event.payload.action}} <span class="strong">{{event.repo.name}}</span></p>
      </div>
      <div v-if="event.type === 'CreateEvent'" class="event-desc">
        <p v-if="!event.payload.ref" class="title">Create <span class="strong">{{event.repo.name}}</span></p>
        <p v-else class="title">Create <span class="strong">{{event.payload['ref_type']}}</span> at <span class="stronger">{{event.repo.name}}</span></p>
      </div>
      <div v-if="event.type === 'PullRequestEvent'" class="event-desc">
        <p class="title">{{event.payload.action}} pull request <span class="strong">{{event.repo.name}}</span></p>
      </div>
      <div v-if="event.type === 'ForkEvent'" class="event-desc">
        <p class="title">Forked <span class="strong">{{event.repo.name}} </span><span class="strong">{{event.payload.forkee['full_name']}}</span></p>
      </div>
      <div v-if="event.type === 'IssuesEvent'" class="event-desc">
        <p class="title">{{event.payload.action}} issue {{event.payload.issue.number}} <span class="strong">{{event.repo.name}}</span></p>
        <p>{{event.payload.issue.title}}</p>
      </div>
      <div v-if="event.type === 'IssueCommentEvent'" class="event-desc">
        <p class="title">{{event.payload.action}} comment on issue {{event.payload.issue.number}} in <span class="strong">{{event.repo.name}}</span></p>
        <p>{{event.payload.comment.body}}</p>
      </div>
      <div v-if="event.type === 'CommitCommentEvent'" class="event-desc">
        <p class="title">Created comment on commit in <span class="strong">{{event.repo.name}}</span></p>
        <p>{{event.payload.comment.body}}</p>
      </div>
      <div v-if="event.type === 'GollumEvent'" class="event-desc">
        <p class="title">{{event.payload.pages.action}} a wiki named {{event.payload.pages['page_name']}} on <span class="strong">{{event.repo.name}}</span></p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      event: {
        type: Object,
        default: {}
      }
    },
    methods: {
      toInfo (user) {
        wx.navigateTo({
          url: `/pages/info/info?login=${user}`
        })
      },
      toRepo (ownerAndRepo) {
        let arr = ownerAndRepo.split('/')
        const [owner, repo] = arr
        wx.navigateTo({
          url: `/pages/repo/repo?owner=${owner}&repo=${repo}`
        })
      }
    }
  }
</script>

<style scoped lang='scss'>
  @import './eventItem.scss';
</style>
