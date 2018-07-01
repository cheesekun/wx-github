
import request from './request'

const baseUrlApi = 'https://api.github.com'
const headers = {
  Authorization: ''
}

const api = {
  getUsers: (q) => request.get('/search/users', {...q}, {
    baseURL: baseUrlApi
  }),
  getRepos: (q) => request.get('/search/repositories', {...q}, {
    baseURL: baseUrlApi
  }),
  getCode: (q) => request.get('/search/code', {...q}, {
    baseURL: baseUrlApi
  }),
  getIssues: (q) => request.get('/search/issues', {...q}, {
    baseURL: baseUrlApi
  }),

  /**
   * me,自己的账户
   * FIXME: 记得改
   */
  // getMe: () => request.get('/user', null, {
  //   baseURL: baseUrlApi,
  //   headers
  // }),
  getMe: () => request.get(`/users/cheesekun`, null, {
    baseURL: baseUrlApi,
    headers
  }),

  getInfo: (user) => request.get(`/users/${user}`, null, {
    baseURL: baseUrlApi
  }),

  getStarred: (user) => request.get(`/users/${user}/starred`, null, {
    baseURL: baseUrlApi
  }),

  getEvents: (user) => request.get(`/users/${user}/events`, null, {
    baseURL: baseUrlApi
  }),

  getFollowers: (user) => request.get(`/users/${user}/followers`, null, {
    baseURL: baseUrlApi
  }),

  getFollowing: (user) => request.get(`/users/${user}/following`, null, {
    baseURL: baseUrlApi
  })
}

export default api
