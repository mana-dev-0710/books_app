'use client';

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

function Home() {

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // ローディング中は待機

    if (session) {
      router.replace("/bookshelf");
    } else {
      router.replace("/login");
    }
  }, [session, status, router]);

  return null;
}

export default Home;
