import { ChirpCard } from "@/components/widgets/chirp-card";
import { fetchPosts } from "@/lib/actions/chirp.action";
import { currentUser } from "@clerk/nextjs";

export default async function Home () {
  // В параметрах у нас номер для пагинации
  const { posts } = await fetchPosts(1, 30)
  const user = await currentUser()
  if (!user) return null;
  
  return (
    <section>
      {posts.length === 0 ? (
        <p>Ничего нет</p>
      ): (
        posts.map(post => (
          <ChirpCard 
            key={post._id}
            id={post._id}
            currentUserId={user.id}
            parentId={post.parentId}
            content={post.text}
            author={post.author}
            community={post.community}
            createdAt={post.createdAt}
            comments={post.children}
          />
        ))
      )}
    </section>
  );
}
