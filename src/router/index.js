import { createRouter, createWebHashHistory } from 'vue-router'
import { showToast } from 'vant'
import 'vant/es/toast/style'
import { useUserStore } from '@/stores'

import HomeTab from '@/views/HomeTab'
import HotTab from '@/views/HotTab'
import MessageTab from '@/views/MessageTab'
import UserTab from '@/views/UserTab'
import PublishArticle from '@/views/PublishArticle'
import PublishVideo from '@/views/PublishVideo'
import SearchDetail from '@/views/SearchDetail'
import ArticleDetail from '@/views/ArticleDetail'
import VideoDetail from '@/views/VideoDetail'
import NoticeDetail from '@/views/NoticeDetail'
import ConversationDetail from '@/views/ConversationDetail'
import UserLogin from '@/views/UserLogin'
import UserSpace from '@/views/UserSpace'
import UserFollows from '@/views/UserFollows'
import UserFavorite from '@/views/UserFavorite'
import UserBrowse from '@/views/UserBrowse'
import UserProfile from '@/views/UserProfile'
import AccountSecurity from '@/views/AccountSecurity'
import ChangePassword from '@/views/ChangePassword'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
      name: 'home',
      component: HomeTab,
      meta: {
        keepAlive: true,
      },
    },
    {
      path: '/hot',
      name: 'hot',
      component: HotTab,
    },
    {
      path: '/message',
      name: 'message',
      component: MessageTab,
      meta: {
        keepAlive: true,
      },
    },
    {
      path: '/user',
      name: 'user',
      component: UserTab,
    },
    {
      path: '/publish/article',
      name: 'publisharticle',
      component: PublishArticle,
    },
    {
      path: '/publish/video',
      name: 'publishvideo',
      component: PublishVideo,
    },
    {
      path: '/home/search',
      name: 'search',
      component: SearchDetail,
    },
    {
      path: '/article/detail/:articleId',
      name: 'articledetail',
      component: ArticleDetail,
      props: true,
    },

    {
      path: '/video/detail/:videoId',
      name: 'videodetail',
      component: VideoDetail,
      props: true,
    },
    {
      path: '/notice/detail/:noticeType',
      name: 'noticedetail',
      component: NoticeDetail,
      props: true,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/conversation/detail/:conversationId',
      name: 'conversationdetail',
      component: ConversationDetail,
      props: true,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/user/login',
      name: 'userlogin',
      component: UserLogin,
    },
    {
      path: '/user/space/:userId',
      name: 'userspace',
      component: UserSpace,
      props: true,
    },
    {
      path: '/user/profile',
      name: 'userprofile',
      component: UserProfile,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/user/follows/:userId',
      name: 'userfollows',
      component: UserFollows,
      props: true,
    },
    {
      path: '/user/favorite',
      name: 'userfavorite',
      component: UserFavorite,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/user/browse',
      name: 'userbrowse',
      component: UserBrowse,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/security',
      name: 'security',
      component: AccountSecurity,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/security/password',
      name: 'password',
      component: ChangePassword,
    },
    {
      path: '/:catchAll(.*)',
      redirect: '/home',
    },
  ],
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  // 检查该路由是否需要登录
  if (to.meta.requiresAuth && !userStore.token) {
    // 如果用户未登录，提示并取消跳转
    showToast('登录后查看更多')
    next(false)
  } else {
    // 如果用户已登录，或者该路由不需要登录，继续跳转
    // 转换参数为 Number 类型
    if (to.params.userId) {
      to.params.userId = Number(to.params.userId)
    }
    next()
  }
})

export default router
