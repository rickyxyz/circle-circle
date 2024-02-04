import { db } from '@/lib/firebase/config';
import {
  DocumentData,
  FirestoreError,
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
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
import usePageBottom from '@/hook/usePageBottom';

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
  const [commentCount, setCommentCount] = useState(0);
  const isBottom = usePageBottom();
  const [lastVisibleDoc, setLastVisibleDoc] = useState<DocumentData | null>(
    null
  );

  useEffect(() => {
    async function getCommentCount() {
      const colRef = collection(
        db,
        `circle/${circleId}/post/${postId}/comment`
      );
      const snapshot = await getCountFromServer(colRef);
      return snapshot.data().count;
    }

    getCommentCount()
      .then((count) => setCommentCount(count))
      .catch(() => setCommentCount(-1));
  }, [circleId, postId]);

  useEffect(() => {
    const fetchData = async () => {
      const commentColRef = collection(
        db,
        `circle/${circleId}/post/${postId}/comment`
      );
      const q = query(
        commentColRef,
        orderBy('postDate'),
        startAfter(lastVisibleDoc),
        limit(25)
      );

      const querySnapshot = await getDocs(q);
      setLastVisibleDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);

      const dataObject: Record<string, Comment> = {};

      querySnapshot.forEach((doc) => {
        dataObject[doc.id] = doc.data() as Comment;
      });

      return dataObject;
    };

    if (Object.keys(comments).length < commentCount) {
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
    }
  }, [
    circleId,
    dispatch,
    postId,
    userCache,
    isBottom,
    comments,
    commentCount,
    lastVisibleDoc,
  ]);

  function onPostComment(newComment: Comment, commentId: string) {
    setCommentCount((p) => p + 1);
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
    <div className="flex flex-col gap-4 pb-8">
      <PostCard
        circleId={circleId ?? ''}
        post={post}
        postId={postId ?? ''}
        className="rounded-none"
        commentCountInput={commentCount}
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
        .reverse()
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
