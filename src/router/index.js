import { createRouter, createWebHashHistory } from 'vue-router'

import LayoutContainer from '@/views/layout/LayoutContainer.vue'
import HomeTab from '@/views/home/HomeTab.vue'
import VideoTab from '@/views/video/VideoTab.vue'
import MessageTab from '@/views/message/MessageTab.vue'
import UserTab from '@/views/user/UserTab.vue'
import SearchPage from '@/views/search/SearchPage.vue'
import ArticlePage from '@/views/article/ArticlePage.vue'
import VideoPage from '@/views/video/VideoPage.vue'
import MessagePage from '@/views/message/MessagePage.vue'
import UserLogin from '@/views/user/UserLogin.vue'
import UserProfile from '@/views/user/UserProfile.vue'
import UserFollow from '@/views/user/UserFollow.vue'
import UserFavorites from '@/views/user/UserFavorites.vue'
import UserBrowsingHistory from '@/views/user/UserBrowsingHistory.vue'
import AccountSecurity from '@/views/security/AccountSecurity.vue'
import ChangePassword from '@/views/security/ChangePassword.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: LayoutContainer,
      redirect: '/home',
      children: [
        {
          path: 'home',
          name: 'home',
          component: HomeTab
        },
        {
          path: 'video',
          name: 'video',
          component: VideoTab
        },
        {
          path: 'message',
          name: 'message',
          component: MessageTab
        },
        {
          path: 'user',
          name: 'user',
          component: UserTab
        }
      ]
    },
    {
      path: '/home/search',
      name: 'search',
      component: SearchPage
    },
    {
      path: '/article/detail/:articleId',
      name: 'articledetail',
      component: ArticlePage,
      props: true
    },
    {
      path: '/video/detail/:videoId',
      name: 'videodetail',
      component: VideoPage,
      props: true
    },
    {
      path: '/message/detail/:authorId',
      name: 'messagedetail',
      component: MessagePage,
      props: true
    },
    {
      path: '/user/login',
      name: 'userlogin',
      component: UserLogin
    },
    {
      path: '/user/profile',
      name: 'userprofile',
      component: UserProfile
    },
    {
      path: '/user/follow',
      name: 'userfollow',
      component: UserFollow
    },
    {
      path: '/user/favorites',
      name: 'userfavorites',
      component: UserFavorites
    },
    {
      path: '/user/browsinghistory',
      name: 'userbrowsinghistory',
      component: UserBrowsingHistory
    },
    {
      path: '/security',
      name: 'security',
      component: AccountSecurity
    },
    {
      path: '/security/password',
      name: 'password',
      component: ChangePassword
    },
    {
      path: '/:catchAll(.*)',
      redirect: '/home'
    }
  ]
})

export default router
