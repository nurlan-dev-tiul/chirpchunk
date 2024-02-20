import { PostChirp } from "@/components/features/post-chirp"
import { fetchUser } from "@/lib/actions/user.action"
import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"

const Page = async () => {
  const user = await currentUser()

  if(!user) return null

  const userInfo = await fetchUser(user.id) 
  if(!userInfo?.onboarded) redirect("/onboarding")
  
  return (
    <>
      <h1 className='head-text'>Create Chirp</h1>
      <PostChirp userId={userInfo._id} />
    </>
  )
}

export default Page