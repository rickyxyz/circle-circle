import { useEffect, useState } from 'react';
import {
  query,
  orderBy,
  limit,
  collection,
  startAt,
  getDoc,
  getDocs,
  doc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Post, PostFeed } from '@/types/db';
import PostCard from '@/component/card/PostCard';

export default function PageHome() {
  const [posts, setPosts] = useState<PostFeed[]>([]);
  const [getFeedError, setGetFeedError] = useState<string | null>('');

  useEffect(() => {
    async function fetchGlobalFeed() {
      const q = query(
        collection(db, '/feed'),
        orderBy('postDate'),
        startAt(1),
        limit(10)
      );

      const querySnapshot = await getDocs(q);

      const postPromises = querySnapshot.docs.map(async (feedDoc) => {
        const docRef = doc(
          db,
          `/circle/${feedDoc.data().circleId}/post`,
          feedDoc.data().postId as string
        );
        const docSnap = await getDoc(docRef);
        const data = docSnap.data() as Post;
        return {
          ...data,
          circleId: feedDoc.data().circleId as string,
          postId: feedDoc.data().postId as string,
        } as PostFeed;
      });

      return Promise.all(postPromises);
    }

    fetchGlobalFeed()
      .then((feed) => {
        setPosts([...feed]);
      })
      .catch(() => {
        setGetFeedError("Whoops can't get feed content");
      });
  }, []);

  return (
    <main className="flex flex-col gap-6 pb-8">
      <div>
        <h2>{getFeedError}</h2>
      </div>
      <div className="divide-y">
        {posts.reverse().map((post) => (
          <PostCard
            key={`pf-${post.circleId}-${post.postId}`}
            circleId={post.circleId}
            post={post}
            postId={post.postId}
            className="rounded-none"
          />
        ))}
      </div>
    </main>
  );
}
