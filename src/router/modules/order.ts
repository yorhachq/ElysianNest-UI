export default {
  path: "/order",
  redirect: "/hotel/order",
  meta: {
    icon: "icon-park-outline:order",
    title:  "我的订单",
    rank: 3
  },
  children: [
    {
      path: "/hotel/order",
      name: "Order",
      component: () => import("@/views/hotel/order.vue"),
      meta: {
        icon: "icon-park-outline:order",
        title: "我的订单"
      }
    }
  ]
} satisfies RouteConfigsTable;
