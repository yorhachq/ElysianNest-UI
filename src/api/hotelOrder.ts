import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";
import type { Result } from "@/api/user";

export interface HotelOrder {
  orderId: number;
  userId: number;
  roomId: number;
  roomNumber: number;
  orderNum: string;
  reserveDate: string;
  checkinDate: string;
  checkoutDate: string;
  status: string;
  payment: number;
  createTime: string;
  updateTime: string;
  username: string;
  phone: string;
  gender: string;
  typeName: string;
  days: number;
}

// 查询酒店订单列表
export function getHotelOrderList(params: any) {
  return http.request<Result>("get", baseUrlApi("client/orderList"), {
    params
  });
}


// 取消订单
export function cancelOrder(orderId: number) {
  return http.request<Result>(
    "put",
    baseUrlApi("client/cancel/" + orderId)
  );
}
