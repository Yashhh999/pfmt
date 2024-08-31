"use client"
import { useSession, signIn, signOut } from "next-auth/react"
import { FcGoogle } from "react-icons/fc";
export default function Page() {
  const { data: session }= useSession()
  if(session) {
    return <>
      Signed in as {session.user?.email} <br/>
      <button onClick={() => signOut() } className="btn">Sign out</button>
    </>
  }
  return <>
  <div className="justify-center items-center flex">
    <div className=" justify-center text-center items-start bg-slate-800 my-20 lg:w-1/3 p-2  ">
        <h1 className="text-4xl font-bold text-center m-5  " >SignIn</h1>
        <button className="btn" onClick={() => signIn("google")}> 
                <FcGoogle className="size-5 "/>
                Sign in with Google
        </button>
        
    </div>
</div>

    
    
  </>
}