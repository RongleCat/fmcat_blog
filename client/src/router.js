import Vue from 'vue'
import Router from 'vue-router'
import store from './store';
import HomeContainer from './views/index.vue'
import HomeIndex from './views/index/index.vue'
import HomeBlog from './views/index/blog/index.vue'
import HomeBlogDetail from './views/index/blog/detail.vue'
import HomeChat from './views/index/chat.vue'
import HomeDesign from './views/index/design.vue'
import HomeWorks from './views/index/works.vue'

import FmcatContainer from "./views/fmcat.vue";
import FmcatIndex from "./views/fmcat/index.vue";
import FmcatBlog from "./views/fmcat/blog/index.vue";
import FmcatLogin from "./views/fmcat/login.vue";
import FmcatMusic from "./views/fmcat/music.vue";
import FmcatBlogAdd from "./views/fmcat/blog/add.vue";
import FmcatBlogClass from "./views/fmcat/blog/class.vue";
import FmcatBlogTag from "./views/fmcat/blog/tag.vue";
import FmcatBlogDetail from "./views/fmcat/blog/detail.vue";
import FmcatBlogEdit from "./views/fmcat/blog/edit.vue";
import FmcatRole from "./views/fmcat/role.vue";



Vue.use(Router)

export default new Router({
  mode: 'hash',
  base: '/',
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  routes: [{
    path: "/fmcat",
    component: FmcatContainer,
    children: [{
      path: "",
      component: FmcatIndex,
      name: "fmcat"
    }, {
      path: "blog",
      component: FmcatBlog,
      name: "fmcat-blog"
    }, {
      path: "login",
      component: FmcatLogin,
      name: "fmcat-login"
    }, {
      path: "music",
      component: FmcatMusic,
      name: "fmcat-music"
    }, {
      path: "role",
      component: FmcatRole,
      name: "fmcat-role"
    }, {
      path: "blog/add",
      component: FmcatBlogAdd,
      name: "fmcat-blog-add"
    }, {
      path: "blog/class",
      component: FmcatBlogClass,
      name: "fmcat-blog-class"
    }, {
      path: "blog/tag",
      component: FmcatBlogTag,
      name: "fmcat-blog-tag"
    }, {
      path: "blog/detail/:id?",
      component: FmcatBlogDetail,
      name: "fmcat-blog-detail-id"
    }, {
      path: "blog/edit/:id?",
      component: FmcatBlogEdit,
      name: "fmcat-blog-edit-id"
    }]
  }, {
    path: "/",
    component: HomeContainer,
    children: [{
      path: "",
      component: HomeIndex,
      name: "index"
    }, {
      path: "blog",
      component: HomeBlog,
      name: "index-blog",
      meta: {
        cache: true
      }
    }, {
      path: "blog/:id",
      component: HomeBlogDetail,
      name: "index-blog-detail"
    }, {
      path: "chat",
      component: HomeChat,
      name: "index-chat"
    }, {
      path: "design",
      component: HomeDesign,
      name: "index-design"
    }, {
      path: "works",
      component: HomeWorks,
      name: "index-works"
    }],
    beforeEnter: (to, from, next) => {
      // ...
      if (to.fullPath !== "/") {
        store.commit("setAsideClose", true);
      } else {
        store.commit("setAsideClose", false);
      }
      next()
    }
  }]
})