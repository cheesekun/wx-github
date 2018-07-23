import {per_page} from '@/utils/config' // eslint-disable-line
import colors from './colors'
import moment from 'moment'

/**
 * query数据封装
 */
export function _query (p = {}, q = {}) {
  return Object.assign({
    per_page
  }, p, q)
}

/**
 * 节流函数
 */
export function _throttle (fn, interval = 500) {
  let canRun = true
  return function () {
    if (!canRun) return
    canRun = false
    window.setTimeout(() => {
      canRun = true
      fn.apply(this, arguments)
    }, interval)
  }
}

/**
 * repos 数据处理
 */
export function dealRepos (data) {
  let repos = []
  repos = data.map(item => {
    return {
      owner: {
        avatar_url: item.owner['avatar_url'],
        login: item.owner.login
      },
      name: item.name,
      language: item.language,
      description: item.description,
      stargazers_count: item['stargazers_count'],
      forks_count: item['forks_count'],
      color: colors[item.language]
    }
  })
  return repos
}

/**
 * users 数据处理
 */
export function dealUsers (data) {
  let users = []
  users = data.map(item => {
    return {
      avatar_url: item['avatar_url'],
      login: item['login']
    }
  })
  return users
}

/**
 * user 数据处理
*/
export function dealUser (data) {
  return {
    login: data.login,
    avatar_url: data['avatar_url'],
    type: data.type,
    name: data.name,
    company: data.company,
    blog: data.blog,
    email: data.email,
    bio: data.bio,
    public_repos: data['public_repos'],
    public_gists: data['public_gists'],
    followers: data.followers,
    following: data.following,
    created_at: moment(data['created_at']).format('ll')
  }
}

/**
 * repo 数据处理
*/
function dealSize (size) {
  if (size < 1024) {
    return size.toFixed(2) + ' KB'
  } else {
    return (size / 1024).toFixed(2) + ' MB'
  }
}
export function dealRepo (data) {
  let repo = {
    name: data['name'],
    full_name: data['full_name'],
    owner: {
      login: data['owner'].login,
      avatar_url: data['owner']['avatar_url']
    },
    description: data['description'],
    created_at: moment(data['created_at']).format('ll'),
    pushed_at: moment(data['pushed_at']).format('ll'),
    size: dealSize(data['size']),
    stargazers_count: data['stargazers_count'],
    forks_count: data['forks_count'],
    open_issues_count: data['open_issues_count'],
    subscribers_count: data['subscribers_count'],
    language: data['language']
  }
  return repo
}

/**
 * trending 数据处理
*/
export function dealTrending (data) {
  let repos = []
  repos = data.map(item => {
    return {
      owner: {
        login: item.owner.login
      },
      name: item.name,
      language: item.language,
      description: item.description,
      stargazers_count: item['stargazers_count'],
      forks_count: item['forks_count'],
      increment: item.increment,
      color: colors[item.language]
    }
  })
  return repos
}

/**
 * commits 数据处理
*/
export function dealCommits (data) {
  let commits = []
  commits = data.map(item => {
    return {
      sha: item.sha.slice(0, 7),
      author: {
        login: item.author.login,
        avatar_url: item.author['avatar_url']
      },
      commit: {
        message: item.commit.message,
        comment_count: item.commit['comment_count'],
        date: moment(item.commit.committer.date).format('ll')
      }
    }
  })
  return commits
}

/**
 * events 数据处理
*/
function firstUpperCase (str) {
  return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase())
}
function getPushCommits (commits) {
  return commits.map(item => {
    return {
      message: item.message,
      sha: item.sha.slice(0, 7)
    }
  })
}
function dealEventType (type, payload) {
  let obj = {}
  switch (type) {
    case 'PushEvent':
      obj = {
        ref: payload.ref.split('/').pop(),
        commits: getPushCommits(payload.commits)
      }
      break
    case 'WatchEvent':
      obj = {
        action: firstUpperCase(payload.action)
      }
      break
    case 'CreateEvent':
      obj = {
        ref: payload.ref, // 通过是否为null，来判断是create repo，还是create branch
        ref_type: payload['ref_type']
      }
      break
    case 'PullRequestEvent':
      obj = {
        action: firstUpperCase(payload.action)
      }
      break
    case 'ForkEvent':
      obj = {
        forkee: {
          full_name: payload['full_name']
        }
      }
      break
    case 'IssuesEvent':
      obj = {
        action: firstUpperCase(payload.action),
        issue: {
          number: payload.issue.number,
          title: payload.issue.title
        }
      }
      break
    case 'IssueCommentEvent':
      obj = {
        action: firstUpperCase(payload.action),
        comment: {
          body: payload.comment.body
        },
        issue: {
          number: payload.issue.number
        }
      }
      break
    case 'CommitCommentEvent':
      obj = {
        comment: {
          body: payload.comment.body
        }
      }
      break
    case 'GollumEvent':
      obj = {
        pages: {
          action: firstUpperCase(payload.pages[0].action),
          page_name: payload.pages[0]['page_name']
        }
      }
      break
    default:
      obj = {}
  }

  return obj
}

export function dealEvents (data) {
  let events = []
  events = data.map(item => {
    return {
      type: item.type,
      actor: {
        login: item.actor.login,
        avatar_url: item.actor['avatar_url']
      },
      repo: {
        name: item.repo.name
      },
      payload: dealEventType(item.type, item.payload),
      created_at: moment(item['created_at']).format('ll')
    }
  })
  return events
}

/**
 * 获取当前路径参数
 * 不用mpvue提供的this.$root.$mp.query
 * 因为其进入同一页面，参数不会变化
*/
export function getQuery () {
  /* eslint-disable */
  /* 获取当前路由栈数组 */
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const options = currentPage.options

  return options
}
