import { useEffect, useState } from 'react';
import { FirestoreError } from 'firebase/firestore';
import { Circle, Post } from '@/types/db';
import { useLoaderData, useNavigate } from 'react-router-dom';
import CircleHeader from '@/component/circle/CircleHeader';
import { getCollectionAsObject } from '@/lib/firebase/firestore';
import PostCard from '@/component/card/PostCard';
import PostCreateForm from '@/component/form/PostCreateForm';
import useWindowSize from '@/hook/useWindowSize';

function PageCircle() {
  const { circle, isMember } = useLoaderData() as {
    circle: Circle;
    isMember: boolean;
  };

  const [posts, setPosts] = useState<Record<string, Post>>({});
  const [getPostError, setGetPostError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isMobile } = useWindowSize();

  useEffect(() => {
    getCollectionAsObject<Post>(`circle/${circle.name}/post`)
      .then((posts) => setPosts(posts))
      .catch((e: FirestoreError) => {
        setGetPostError(e.code);
      });
  }, [circle.name]);

  return (
    <div className="flex flex-col divide-y divide-solid divide-gray-200">
      <div>{/* TODO: add banner image here */}</div>
      <CircleHeader circle={circle} />
      {!isMobile && isMember && (
        <PostCreateForm
          circleId={circle.name}
          onSuccessCallback={(postId) => {
            navigate(`/c/${circle.name}/p/${postId}`);
          }}
          className="p-4"
        />
      )}
      {getPostError}
      {Object.entries(posts).map(([postId, post], idx) => (
        <PostCard
          key={`post-${idx}}`}
          post={post}
          postId={postId}
          className="rounded-none"
          circleId={circle.name}
          blur={true}
        />
      ))}
    </div>
  );
}

export default PageCircle;
