import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default async function Home() {

  const { data: session } = useSession();
  if (session) {
    redirect("/bookshelf");
  } else {
    redirect("/login");
  }
  
}