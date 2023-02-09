import { sleep } from "@/types/time";
import type { User } from "@/types/domain";
import { getToken } from "@/features/token";

const FAKE_ACCESS_TOKEN = "abc";

export async function postLogin(name: string): string {
  await sleep(500);

  if (name !== "john") {
    throw new Error("postLogin: login failed");
  }

  return FAKE_ACCESS_TOKEN;
}

export async function postAuthorize() {
  await sleep(500);

  if (getToken() !== FAKE_ACCESS_TOKEN) {
    throw new Error("postAuthorize: authorization failed");
  }

  return { name: "john doe" } as User;
}
