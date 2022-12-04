import type { RouteConfigsTable } from "/#/index";
const Layout = () => import("@/layout/index.vue");

const enterRouter: RouteConfigsTable = {
  path: "/enter",
  redirect: "/enter/index",
  name: "Enter",
  component: Layout,
  meta: {
    icon: "edit-pen",
    title: "录入信息",
    rank: 2
  },
  children: [
    {
      path: "/enter/index",
      name: "EnterIndex",
      component: () => import("@/views/enter/index.vue"),
      meta: {
        title: "录入信息"
      }
    }
  ]
};

export default enterRouter;
