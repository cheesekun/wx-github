
import request from './request'

const baseUrlApi = 'https://api.github.com'
const headers = {
  Authorization: ''
}

const api = {
  getUsers: (q) => request.get('/search/users', {...q}, {
    baseURL: baseUrlApi,
    headers
  }),
  getRepos: (q) => request.get('/search/repositories', {...q}, {
    baseURL: baseUrlApi,
    headers
  }),
  getCode: (q) => request.get('/search/code', {...q}, {
    baseURL: baseUrlApi,
    headers
  }),
  getIssues: (q) => request.get('/search/issues', {...q}, {
    baseURL: baseUrlApi,
    headers
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

  login: (username, password) => request.post('/login', {username, password}, {
    baseURL: 'https://github.konsonx.com'
  }),

  getInfo: (user) => request.get(`/users/${user}`, null, {
    baseURL: baseUrlApi,
    headers
  }),

  getRepo: (owner, repo) => request.get(`/repos/${owner}/${repo}`, null, {
    baseURL: baseUrlApi,
    headers
  }),

  getOwnRepos: (user) => request.get(`/users/${user}/repos`, null, {
    baseURL: baseUrlApi,
    headers
  }),

  getStarred: (user) => request.get(`/users/${user}/starred`, null, {
    baseURL: baseUrlApi,
    headers
  }),

  getEvents: (user) => request.get(`/users/${user}/events`, null, {
    baseURL: baseUrlApi,
    headers
  }),

  getFollowers: (user) => request.get(`/users/${user}/followers`, null, {
    baseURL: baseUrlApi,
    headers
  }),

  getFollowing: (user) => request.get(`/users/${user}/following`, null, {
    baseURL: baseUrlApi,
    headers
  }),

  getReadme: (owner, repo) => request.get(`/repos/${owner}/${repo}/contents/README.md`, null, {
    baseURL: baseUrlApi,
    headers
  }),

  getCommit: (owner, repo, q) => request.get(`/repos/${owner}/${repo}/commits`, {...q}, {
    baseURL: baseUrlApi,
    headers
  }),

  /**
   * TODO: 对baseUrl做处理
   * TODO: 之后统一对code做处理
  */
  getTrending: (time, lang) => request.get(`/trending`, {time, lang}, {
    baseURL: 'https://github.konsonx.com'
  })
}

export default api
