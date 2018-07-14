module.exports = [
  {
    path: '/pages/trending/trending',
    name: 'trending',
    config: {
      enablePullDownRefresh: false,
      navigationBarTitleText: 'Trending'
    }
  },
  {
    path: '/pages/search/search',
    name: 'search',
    config: {
      enablePullDownRefresh: false,
      navigationBarTitleText: 'Search'
    }
  },
  {
    path: '/pages/me/me',
    name: 'me',
    config: {
      enablePullDownRefresh: false,
      navigationBarTitleText: 'Me'
    }
  },
  {
    path: '/pages/info/info',
    name: 'info',
    config: {
      enablePullDownRefresh: false,
      navigationBarTitleText: 'Info'
    }
  },
  {
    path: '/pages/followers/followers',
    name: 'followers',
    config: {
      enablePullDownRefresh: true,
      navigationBarTitleText: 'Followers'
    }
  },
  {
    path: '/pages/following/following',
    name: 'following',
    config: {
      enablePullDownRefresh: true,
      navigationBarTitleText: 'Following'
    }
  },
  {
    path: '/pages/about/about',
    name: 'about',
    config: {
      enablePullDownRefresh: false,
      navigationBarTitleText: 'About'
    }
  }, {
    path: '/pages/repo/repo',
    name: 'repo',
    config: {
      enablePullDownRefresh: false,
      navigationBarTitleText: 'Repository'
    }
  }
]
