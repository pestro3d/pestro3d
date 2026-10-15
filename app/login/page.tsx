import type { Metadata } from "next";
import LoginClient from "@/components/LoginClient";

export const metadata: Metadata = {
  title: "Sign in | Pestro3D",
  description: "Sign in to view your Pestro3D orders and keepsakes.",
};

export default function LoginPage() {
  return <LoginClient />;
}
