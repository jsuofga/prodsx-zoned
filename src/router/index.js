import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import VideowallConfig from '@/components/VideowallConfig'
import Videowall2x2 from '@/components/Videowall2x2'
import Videowall2x3 from '@/components/Videowall2x3'
import Videowall3x3 from '@/components/Videowall3x3'
import Videowall1x3 from '@/components/Videowall1x3'
import Name_zones from '@/components/Name_zones'
import Name_inputs from '@/components/Name_inputs'
import Name_outputs from '@/components/Name_outputs'
import Zone from '@/components/Zone'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/videowall2x2",
      name: "videowall2x2",
      component: Videowall2x2
    },
    {
      path: "/videowall2x3",
      name: "videowall2x3",
      component: Videowall2x3
    },
    {
      path: "/videowall3x3",
      name: "videowall3x3",
      component: Videowall3x3
    },
        {
      path: "/videowall1x3",
      name: "videowall1x3",
      component: Videowall1x3
    },
    {
      path: "/videowallconfig",
      name: "videowallconfig",
      component: VideowallConfig
    },
    {
      path: "/name-zones",
      name: "name_zones",
      component: Name_zones
    },
    {
      path: "/name-inputs",
      name: "name_inputs",
      component: Name_inputs
    },
    {
      path: "/name-outputs",
      name: "name_outputs",
      component: Name_outputs
    },
      {
      path: "/zone",
      name: "zone",
      component: Zone
    },

  ]
});

