import axios from "axios";
import { env } from "./env";
import type {
  ApiEnvelope,
  AuthSuccessResponse,
  AvatarItem,
  MapItem,
} from "../types";

const client = axios.create({
  baseURL: `${env.apiBaseUrl}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function signIn(payload: { username: string; password: string }) {
  const response = await client.post<ApiEnvelope<AuthSuccessResponse>>(
    "/auth/signin",
    payload,
  );

  return response.data.data;
}

export async function signUp(payload: {
  username: string;
  password: string;
  role?: "user" | "admin";
}) {
  const response = await client.post<ApiEnvelope<AuthSuccessResponse>>(
    "/auth/signup",
    payload,
  );

  return response.data.data;
}

export async function listMaps() {
  const response = await client.get<ApiEnvelope<{ items: MapItem[] }>>("/maps");
  return response.data.data.items;
}

export async function listAvatars() {
  const response =
    await client.get<ApiEnvelope<{ items: AvatarItem[] }>>("/avatars");
  return response.data.data.items;
}
