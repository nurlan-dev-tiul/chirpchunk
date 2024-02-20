import { Comment } from '@/components/features/comment';
import { ChirpCard } from '@/components/widgets/chirp-card'
import { fetchChirpbyId } from '@/lib/actions/chirp.action';
import { fetchUser } from '@/lib/actions/user.action';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

const Chirp = async({ params }: { params: { id: string } }) => {
  if (!params.id) return null;

  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const chirp = await fetchChirpbyId(params.id)

  return (
    <section className='relative'>
      <div>
        <ChirpCard 
          key={chirp._id}
          id={chirp._id}
          currentUserId={user.id}
          parentId={chirp.parentId}
          content={chirp.text}
          author={chirp.author}
          community={chirp.community}
          createdAt={chirp.createdAt}
          comments={chirp.children}
        />
      </div>
      <div className='mt-7'>
        <Comment
          chirpId={params.id}
          currentUserImg={user.imageUrl}
          currentUserId={JSON.stringify(userInfo._id)}
        />
      </div>
      <div className='mt-10'>
        {chirp.children.map((childItem: any) => (
          <ChirpCard
            key={childItem._id}
            id={childItem._id}
            currentUserId={user.id}
            parentId={childItem.parentId}
            content={childItem.text}
            author={childItem.author}
            community={childItem.community}
            createdAt={childItem.createdAt}
            comments={childItem.children}
            isComment
          />
        ))}
      </div>
    </section>  
  )
}

export default Chirp