import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";
import type { Result } from "@/api/user";

// 获取指定日期的可用房间列表
export function getAvailableRooms(date?: {
  checkoutDate: string;
  checkinDate: string;
}) {
  return http.request<Result>(
    "get",
    baseUrlApi("client/availableRooms"),
    {
      params: date
    }
  );
}
// 预订房间
export function reserveRoom(data?: object) {
  return http.request<Result>("post", baseUrlApi("client/reserve"), {
    data
  });
}
