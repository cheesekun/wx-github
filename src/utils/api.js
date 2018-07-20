import request from './request'

// const baseURL = 'https://api.github.com'
const baseURL = 'https://github.konsonx.com'
// const baseURL = ''

const api = {
  getUsers: (q) => request.get('/search/users', {...q}, {
    baseURL
  }),
  getRepos: (q) => request.get('/search/repositories', {...q}, {
    baseURL
  }),
  getCode: (q) => request.get('/search/code', {...q}, {
    baseURL
  }),
  getIssues: (q) => request.get('/search/issues', {...q}, {
    baseURL
  }),

  getMe: () => request.get(`/user`, null, {
    baseURL
  }),

  login: (username, password) => request.post('/login', {username, password}, {
    baseURL
  }),

  getInfo: (user) => request.get(`/users/${user}`, null, {
    baseURL
  }),

  getRepo: (owner, repo) => request.get(`/repos/${owner}/${repo}`, null, {
    baseURL
  }),

  getOwnRepos: (user) => request.get(`/users/${user}/repos`, null, {
    baseURL
  }),

  /**
   * FIXME: 改下文档
   */
  getStarred: (user, q) => request.get(`/users/${user}/starred`, q, {
    baseURL
  }),

  getUserEvents: (user) => request.get(`/users/${user}/events`, null, {
    baseURL
  }),

  getRepoEvents: (owner, repo) => request.get(`/repos/${owner}/${repo}/events`, null, {
    baseURL
  }),

  getFollowers: (user) => request.get(`/users/${user}/followers`, null, {
    baseURL
  }),

  getFollowing: (user) => request.get(`/users/${user}/following`, null, {
    baseURL
  }),

  getMembers: (org) => request.get(`/orgs/${org}/members`, null, {
    baseURL
  }),

  getReadme: (owner, repo) => request.get(`/repos/${owner}/${repo}/contents/README.md`, null, {
    baseURL
  }),

  getCommits: (owner, repo, q) => request.get(`/repos/${owner}/${repo}/commits`, q, {
  // getCommits: (owner, repo) => request.get(`/repos/${owner}/${repo}/commits`, null, {
    baseURL
  }),

  /**
   * TODO: 对baseURL做处理
   * TODO: 之后统一对code做处理
  */
  getTrending: (time, lang) => request.get(`/trending`, {time, lang}, {
    baseURL
  }),

  /**
   * 判断用户follow
  */
  getIsFollow: (user) => request.get(`/user/following/${user}`, null, {
    baseURL
  }),
  putFollow: (user) => request.put(`/user/following/${user}`, null, {
    baseURL
  }),
  deleteFollow: (user) => request.delete(`/user/following/${user}`, null, {
    baseURL
  }),
  /**
   * 判断仓库star
  */
  getIsStar: (owner, repo) => request.get(`/user/starred/${owner}/${repo}`, null, {
    baseURL
  }),
  putStar: (owner, repo) => request.put(`/user/starred/${owner}/${repo}`, null, {
    baseURL
  }),
  deleteStar: (owner, repo) => request.delete(`user/starred/${owner}/${repo}`, null, {
    baseURL
  })
}

export default api
