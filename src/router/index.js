import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from "@/views/Index";
import List from "@/components/user/List";
import Indexs from "@/components/index/indexs";

Vue.use(VueRouter)

  const routes = [
    {
      path: '/',
      redirect:'/indexs'
    },
    {
      path:'/index',
      component:Index,
      children:[
        {
          path:'/users',
          component:List
        },
        {
          path:'/indexs',
          component:Indexs
        }
      ]
    }
]

const router = new VueRouter({
  routes
})

export default router
