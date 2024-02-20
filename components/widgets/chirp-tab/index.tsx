import { redirect } from "next/navigation";

// import { fetchCommunityPosts } from "@/lib/actions/community.action";
import { fetchUserPosts } from "@/lib/actions/user.action";

import { ChirpCard } from "@/components/widgets/chirp-card";
import { Result } from "./type";

interface Props {
  currentUserId: string;
  accountId: string;
  accountType: string;
}

async function ChirpTab({ currentUserId, accountId, accountType }: Props) {
  let result: Result = await fetchUserPosts(accountId);

  if (accountType === "Community") {
    // result = await fetchCommunityPosts(accountId);
  } else {
    
  }

  // if (!result) {
  //   redirect("/");
  // }

  return (
    <section className='mt-9 flex flex-col gap-2'>
      {result.chirps.map((chirp) => (
        <ChirpCard
          key={chirp._id}
          id={chirp._id}
          currentUserId={currentUserId}
          parentId={chirp.parentId}
          content={chirp.text}
          author={
            accountType === "User"
              ? { name: result.name, image: result.image, id: result.id }
              : {
                  name: chirp.author.name,
                  image: chirp.author.image,
                  id: chirp.author.id,
                }
          }
          community={
            accountType === "Community"
              ? { name: result.name, id: result.id, image: result.image }
              : chirp.community
          }
          createdAt={chirp.createdAt}
          comments={chirp.children}
        />
      ))}
    </section>
  );
}

export default ChirpTab;