"use client";

import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/client";
import { clearSessionCookie } from "@/lib/actions/auth_action";

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      await clearSessionCookie();

      router.push("/sign-in");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return <button className="btn-primary" onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
