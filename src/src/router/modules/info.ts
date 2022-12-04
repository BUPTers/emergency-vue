import type { RouteConfigsTable } from "/#/index";
const Layout = () => import("@/layout/index.vue");

const infoRouter: RouteConfigsTable = {
  path: "/info",
  redirect: "/info/index",
  name: "Info",
  component: Layout,
  meta: {
    icon: "search",
    title: "信息列表",
    rank: 1
  },
  children: [
    {
      path: "/info/index",
      name: "InfoIndex",
      component: () => import("@/views/info/index.vue"),
      meta: {
        title: "信息列表"
      }
    }
  ]
};

export default infoRouter;
