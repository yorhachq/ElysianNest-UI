import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";
import type { Result } from "@/api/user";

// 获取会员详情
export function getMemberInfo(id?: number) {
  return http.request<Result>("get", baseUrlApi(`client/memberInfo/${id}`));
}

//会员充值
export function rechargeMember(data?: object) {
  return http.request<Result>("post", baseUrlApi("client/recharge"), {
    data
  });
}
