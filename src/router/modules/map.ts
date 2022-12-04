import type { RouteConfigsTable } from "/#/index";
const Layout = () => import("@/layout/index.vue");

const mapRouter: RouteConfigsTable = {
  path: "/map",
  redirect: "/map/index",
  name: "Map",
  component: Layout,
  meta: {
    icon: "map-location",
    title: "灾情地图",
    rank: 3
  },
  children: [
    {
      path: "/map/index",
      name: "MapIndex",
      component: () => import("@/views/map/index.vue"),
      meta: {
        title: "灾情地图"
      }
    }
  ]
};

export default mapRouter;
