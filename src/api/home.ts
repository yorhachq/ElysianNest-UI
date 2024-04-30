import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";
import type { Result } from "@/api/user";


/**
 * 获取酒店信息
 */
export function getHotelInfo() {
  return http.request<Result>("get", baseUrlApi("client/hotelInfo"));
}
