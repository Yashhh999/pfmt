"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <>
      <div className="navbar bg-base-100 justify-between ">
        <Link href="/" className="btn btn-ghost text-2xl ml-28 ">Finage</Link>

        {session?.user?.image && (
            <div className="">
                <h1 className=" m-2 text-lg font-medium">{session.user.name}</h1>
          <Image
            src={session.user.image}
            width={40}   
            height={40}
            alt={session.user.name || "Profile Image"}
            className="rounded-full mr-28"
          />
          </div>
        )}
      </div>
    </>
  );
}
