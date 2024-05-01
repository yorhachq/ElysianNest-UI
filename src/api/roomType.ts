import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";
import type { Result } from "@/api/user";

// 分页查询房间类型
export function getRoomTypeList() {
  return http.request<Result>("get", baseUrlApi("client/hotelRoomTypeList"));
}
