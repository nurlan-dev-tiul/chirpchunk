import { AccountFeature } from "@/components/features/profile"
import { currentUser } from "@clerk/nextjs"

const Page = async () => {
  const user = await currentUser()
  const userInfo = {}
  
  const userData = {
    id: user?.id,
    objectId: userInfo?._id,
    username: userInfo?.username || user?.username,
    name: userInfo?.name || user?.firstName,
    bio: userInfo?.bio || "",
    image: userInfo?.image || user?.imageUrl
  }

  return (
    <main className='bg-slate-800 mx-auto flex max-w-3xl flex-col justify-start px-10 py-20'>
      <h1 className='head-text'>Страница профиля</h1>
      <p className='mt-3 text-base-regular text-light-2'>
        Заполните свой профиль сейчас
      </p>

      <section className='mt-9 bg-slate-900 p-10'>
        <AccountFeature 
          user={userData}
          btnTitle="Продолжить"
        />
      </section>
    </main>
  )
}

export default Page