/* eslint-disable */
import {per_page} from '@/utils/config'
import colors from './colors'

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

// export const utils =  {
//   formatNumber,
//   formatTime,
//   _throttle,
//   dealRepos,
//   dealUsers,
//   _query
// }
