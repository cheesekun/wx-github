import request from './request'

const api = {
  /**
   * Treanding
  */
  getTrending: (time, lang) => request.get(`/trending`, {time, lang}),

  /**
   * search
  */
  getUsers: (q) => request.get('/search/users', {...q}),
  getRepos: (q) => request.get('/search/repositories', {...q}),
  getCode: (q) => request.get('/search/code', {...q}),
  getIssues: (q) => request.get('/search/issues', {...q}),

  /**
   * ME
  */
  getMe: () => request.get(`/user`),
  login: (username, password) => request.post('/login', {username, password}),
  getIsFollow: (user) => request.get(`/user/following/${user}`),
  putFollow: (user) => request.put(`/user/following/${user}`),
  deleteFollow: (user) => request.delete(`/user/following/${user}`),
  getIsStar: (owner, repo) => request.get(`/user/starred/${owner}/${repo}`),
  putStar: (owner, repo) => request.put(`/user/starred/${owner}/${repo}`),
  deleteStar: (owner, repo) => request.delete(`user/starred/${owner}/${repo}`),

  /**
   * FIXME: 改下文档
   */
  getInfo: (user) => request.get(`/users/${user}`),
  getRepo: (owner, repo) => request.get(`/repos/${owner}/${repo}`),
  getStarred: (user, q) => request.get(`/users/${user}/starred`, q),
  getUserEvents: (user, q) => request.get(`/users/${user}/events`, q),
  getRepoEvents: (owner, repo, q) => request.get(`/repos/${owner}/${repo}/events`, q),
  getMyEvents: (user, q) => request.get(`/users/${user}/received_events`, q),
  getFollowers: (user, q) => request.get(`/users/${user}/followers`, q),
  getFollowings: (user, q) => request.get(`/users/${user}/following`, q),
  getOwnRepos: (user, q) => request.get(`/users/${user}/repos`, q),
  getMembers: (org, q) => request.get(`/orgs/${org}/members`, q),
  getReadme: (owner, repo) => request.get(`/repos/${owner}/${repo}/contents/README.md`),
  getCommits: (owner, repo, q) => request.get(`/repos/${owner}/${repo}/commits`, q)
}

export default api
