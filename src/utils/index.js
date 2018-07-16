/* eslint-disable */
import {per_page} from '@/utils/config'
import colors from './colors'
import moment from 'moment'

export function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

export function formatTime (date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('/')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}

/**
 * query数据封装
 */
export function _query (p, q) {
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
    created_at: moment(data['created_at']).format('LL'),
  }
}

/**
 * repo 数据处理
*/
export function dealRepo (data) {
  let repo = {
    name: data['name'],
    full_name: data['full_name'],
    owner: {
      login: data['owner'].login,
      avatar_url: data['owner']['avatar_url']
    },
    description: data['description'],
    created_at: moment(data['created_at']).format('LL'),
    pushed_at: moment(data['pushed_at']).format('LL'),
    size: data['size'],
    stargazers_count: data['stargazers_count'],
    forks_count: data['forks_count'],
    open_issues_count: data['open_issues_count'],
    subscribers_count: data['subscribers_count'],
    language: data['language'],
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
