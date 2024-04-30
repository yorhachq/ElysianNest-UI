import {$t, transformI18n} from "@/plugins/i18n";
import Hotel from "@iconify-icons/ri/hotel-line";
import RoomCalendar from "@iconify-icons/ri/calendar-2-line";
import Room from "@iconify-icons/ic/baseline-hotel";
import RoomType from "@iconify-icons/ic/baseline-meeting-room";

export default {
  path: "/hotel",
  redirect: "/hotel/roomList",
  meta: {
    icon: Hotel,
    title:  "客房预订",
    rank: 3
  },
  children: [
    {
      path: "/hotel/roomList",
      name: "RoomList",
      component: () => import("@/views/hotel/roomList.vue"),
      meta: {
        icon: RoomCalendar,
        title: "客房预订"
      }
    }
  ]
} satisfies RouteConfigsTable;
