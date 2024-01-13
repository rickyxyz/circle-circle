import { db } from '@/lib/firebase/config';
import {
  FirestoreError,
  collection,
  deleteDoc,
  doc,
  getDocs,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useLoaderData, useParams } from 'react-router-dom';
import { Comment, Post } from '@/types/db';
import PostCard from '@/component/card/PostCard';
import { CommentForm } from '@/component/form/CommentForm';
import CommentCard from '@/component/card/CommentCard';
import PromptLogin from '@/component/common/PromptLogin';
import { getData } from '@/lib/firebase/firestore';
import { useAppDispatch, useAppSelector } from '@/hook/reduxHooks';
import { addUsers } from '@/redux/cacheReducer';

function PagePost() {
  const dispatch = useAppDispatch();
  const post = useLoaderData() as Post;
  const { circleId, postId } = useParams();
  const [commentDeleteError, setCommentDeleteError] = useState<string | null>(
    null
  );
  const [comments, setComments] = useState<Record<string, Comment>>({});
  const [getError, setGetError] = useState<null | string>(null);
  const userCache = useAppSelector((state) => state.cache.users);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(
        collection(db, `circle/${circleId}/post/${postId}/comment`)
      );

      const dataObject: Record<string, Comment> = {};

      querySnapshot.forEach((doc) => {
        dataObject[doc.id] = doc.data() as Comment;
      });

      return dataObject;
    };

    fetchData()
      .then((comments) => {
        setComments(comments);

        const uniqUID = Object.values(comments).reduce(
          (accum: string[], comment) => {
            if (!accum.includes(comment.author)) {
              accum.push(comment.author);
            }
            return accum;
          },
          []
        );

        uniqUID.forEach((uid) => {
          if (!Object.keys(userCache).includes(uid)) {
            getData('user', uid)
              .then((user) => {
                if (user) {
                  dispatch(addUsers([user]));
                } else throw new Error('user not found');
              })
              .catch((e) => {
                throw e;
              });
          }
        });
      })
      .catch((e: FirestoreError) => {
        setGetError(e.code);
      });
  }, [circleId, dispatch, postId, userCache]);

  function onPostComment(newComment: Comment, commentId: string) {
    setComments({
      ...comments,
      [commentId]: newComment,
    });
  }

  function onCommentDelete(commentId: string) {
    deleteDoc(
      doc(db, `/circle/${circleId}/post/${postId}/comment/${commentId}`)
    )
      .then(() => {
        setComments((prev) => {
          const updatedComments = { ...prev };
          // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
          delete updatedComments[commentId];
          return updatedComments;
        });
      })
      .catch((e: FirestoreError) => {
        setCommentDeleteError(e.code);
      });
  }

  return (
    <div className="flex flex-col gap-4">
      <PostCard
        circleId={circleId ?? ''}
        post={post}
        postId={postId ?? ''}
        className="rounded-none"
      />
      <PromptLogin>
        <CommentForm
          onSuccessCallback={onPostComment}
          basePath={`circle/${circleId}/post/${postId}/comment`}
          className="px-3"
        />
      </PromptLogin>
      {getError}
      {Object.keys(comments)
        .sort((commentId1, commentId2) => {
          return comments[commentId1].postDate < comments[commentId2].postDate
            ? 1
            : -1;
        })
        .map((commentId) => (
          <div key={`comment-${commentId}}`} className="px-3">
            <CommentCard
              commentData={comments[commentId]}
              commentId={commentId}
              basepath={`circle/${circleId}/post/${postId}/comment`}
              onSuccessCallback={(newComment) => {
                setComments(() => ({ ...comments, [commentId]: newComment }));
              }}
              onDelete={() => {
                onCommentDelete(commentId);
              }}
            />
            {commentDeleteError}
          </div>
        ))}
    </div>
  );
}

export default PagePost;
