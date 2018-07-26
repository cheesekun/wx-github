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
      enablePullDownRefresh: true,
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
    path: '/pages/members/members',
    name: 'members',
    config: {
      enablePullDownRefresh: true,
      navigationBarTitleText: 'Members'
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
      navigationBarTitleText: 'Repository',
      usingComponents: {
        wxparser: 'plugin://wxparserPlugin/wxparser'
      }
    }
  }, {
    path: '/pages/repos/repos',
    name: 'repos',
    config: {
      enablePullDownRefresh: false,
      navigationBarTitleText: 'Repositories'
    }
  }, {
    path: '/pages/stargazers/stargazers',
    name: 'stargazers',
    config: {
      enablePullDownRefresh: false,
      navigationBarTitleText: 'Stargazers'
    }
  }, {
    path: '/pages/forks/forks',
    name: 'forks',
    config: {
      enablePullDownRefresh: false,
      navigationBarTitleText: 'Forks'
    }
  }, {
    path: '/pages/subscribers/subscribers',
    name: 'subscribers',
    config: {
      enablePullDownRefresh: false,
      navigationBarTitleText: 'Subscribers'
    }
  }
]
