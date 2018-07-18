
import request from './request'

// const baseUrl = 'https://api.github.com'
const baseUrl = ''
const headers = {
  'x-id': 0,
  'Authorization': ''
}

const api = {
  getUsers: (q) => request.get('/search/users', {...q}, {
    baseURL,
    headers
  }),
  getRepos: (q) => request.get('/search/repositories', {...q}, {
    baseURL,
    headers
  }),
  getCode: (q) => request.get('/search/code', {...q}, {
    baseURL,
    headers
  }),
  getIssues: (q) => request.get('/search/issues', {...q}, {
    baseURL,
    headers
  }),

  /**
   * me,自己的账户
   * FIXME: 记得改
   */
  // getMe: () => request.get('/user', null, {
  //   baseURL: ,
  //   headers
  // }),
  getMe: () => request.get(`/users/cheesekun`, null, {
    baseURL,
    headers
  }),

  login: (username, password) => request.post('/login', {username, password}, {
    baseURL:
  }),

  getInfo: (user) => request.get(`/users/${user}`, null, {
    baseURL,
    headers
  }),

  getRepo: (owner, repo) => request.get(`/repos/${owner}/${repo}`, null, {
    baseURL,
    headers
  }),

  getOwnRepos: (user) => request.get(`/users/${user}/repos`, null, {
    baseURL,
    headers
  }),

  /**
   * FIXME: 改下文档
   */
  getStarred: (user, q) => request.get(`/users/${user}/starred`, q, {
    baseURL,
    headers
  }),

  getEvents: (user) => request.get(`/users/${user}/events`, null, {
    baseURL,
    headers
  }),

  getFollowers: (user) => request.get(`/users/${user}/followers`, null, {
    baseURL,
    headers
  }),

  getFollowing: (user) => request.get(`/users/${user}/following`, null, {
    baseURL,
    headers
  }),

  getReadme: (owner, repo) => request.get(`/repos/${owner}/${repo}/contents/README.md`, null, {
    baseURL: ,
    headers
  }),

  getCommits: (owner, repo, q) => request.get(`/repos/${owner}/${repo}/commits`, q, {
  // getCommits: (owner, repo) => request.get(`/repos/${owner}/${repo}/commits`, null, {
    baseURL: ,
    headers
  }),

  /**
   * TODO: 对baseUrl做处理
   * TODO: 之后统一对code做处理
  */
  getTrending: (time, lang) => request.get(`/trending`, {time, lang}, {
    baseURL:
  })
}

export default api
