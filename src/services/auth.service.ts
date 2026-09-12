import api from "@/lib/api";
import {
  AdminLoginPayload,
  AdminLoginResponse,
} from "@/types/auth";

export const adminLogin = async (
  payload: AdminLoginPayload,
): Promise<AdminLoginResponse> => {
  return api<AdminLoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};