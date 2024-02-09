import useAuth from '@/hook/useAuth';
import { HTMLAttributes, useCallback, useEffect, useState } from 'react';
import { Comment } from '@/types/db';
import { CommentForm } from '@/component/form/CommentForm';
import { db } from '@/lib/firebase/config';
import {
  getDocs,
  collection,
  FirestoreError,
  deleteDoc,
  doc,
  getCountFromServer,
  getDoc,
  setDoc,
} from 'firebase/firestore';
import DropdownList from '@/component/common/DropdownList';
import { timeAgo } from '@/lib/utils';
import { GoKebabHorizontal } from 'react-icons/go';
import { LuDot } from 'react-icons/lu';
import ButtonWithIcon from '@/component/common/ButtonWithIcon';
import { FaRegCommentAlt, FaRegHeart } from 'react-icons/fa';
import { CommentEditForm } from '@/component/form/CommentEditForm';
import { useAppDispatch, useAppSelector } from '@/hook/reduxHooks';
import parse from 'html-react-parser';
import Button from '@/component/common/Button';
import { getData } from '@/lib/firebase/firestore';
import { addUsers } from '@/redux/cacheReducer';

function CommentCardFallback({ onRetry }: { onRetry: () => void }) {
  return (
    <div>
      <p>Uh oh something went wrong</p>
      <Button
        onClick={() => {
          onRetry();
        }}
      ></Button>
    </div>
  );
}

interface CommentCardProps extends HTMLAttributes<HTMLDivElement> {
  commentData: Comment;
  commentId: string;
  basepath: string;
  onSuccessCallback?: (newComment: Comment) => void;
  onDelete?: () => void;
}

export default function CommentCard({
  commentData,
  commentId,
  basepath,
  onSuccessCallback,
}: CommentCardProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isReplyMode, setIsReplyMode] = useState(false);
  const { user } = useAuth();
  const [comments, setComments] = useState<Record<string, Comment>>({});
  const [likeCount, setLikeCount] = useState(0);
  const userCache = useAppSelector((state) => state.cache.users);
  const dispatch = useAppDispatch();
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    const querySnapshot = await getDocs(
      collection(db, `${basepath}/${commentId}/comment`)
    );

    getData('user', commentData.author)
      .then((data) => {
        if (data) dispatch(addUsers([data]));
      })
      .catch(() => {
        return;
      });

    const dataObject: Record<string, Comment> = {};

    querySnapshot.forEach((doc) => {
      dataObject[doc.id] = doc.data() as Comment;
    });

    return dataObject;
  }, [basepath, commentData.author, commentId, dispatch]);

  useEffect(() => {
    fetchData()
      .then((comments) => setComments(comments))
      .catch(() => {
        setHasError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [basepath, commentId, fetchData]);

  function onComment(newComment: Comment, commentId: string) {
    setComments({
      ...comments,
      [commentId]: newComment,
    });
    setIsReplyMode(false);
  }

  function likeComment() {
    if (user) {
      const docRef = doc(db, `${basepath}/${commentId}/like/${user.uid}`);
      getDoc(docRef)
        .then((doc) => {
          if (doc.exists()) {
            deleteDoc(docRef)
              .then(() => {
                setLikeCount((p) => p - 1);
              })
              .catch((e) => {
                throw e;
              });
          } else {
            setDoc(docRef, {
              uid: user.uid,
            })
              .then(() => {
                setLikeCount((p) => p + 1);
              })
              .catch((e) => {
                throw e;
              });
          }
        })
        .catch((e: FirestoreError) => {
          // eslint-disable-next-line no-console
          console.error(e.code);
        });
    }
  }

  useEffect(() => {
    const colRef = collection(db, `${basepath}/${commentId}/like`);
    async function getLikeCount() {
      const snapshot = await getCountFromServer(colRef);
      return snapshot.data().count;
    }

    getLikeCount()
      .then((count) => setLikeCount(count))
      .catch(() => setLikeCount(-1));
  }, [basepath, commentId]);

  if (isLoading) {
    return <>Loading</>;
  } else if (hasError) {
    return (
      <CommentCardFallback
        onRetry={() => {
          setHasError(false);
          fetchData()
            .then((comments) => setComments(comments))
            .catch(() => {
              setHasError(true);
            });
        }}
      />
    );
  } else {
    return isEditMode ? (
      <div>
        <CommentEditForm
          comment={commentData}
          onSuccessCallback={(newComment: Comment) => {
            onSuccessCallback && onSuccessCallback(newComment);
            setIsEditMode(false);
          }}
          commentId={commentId}
          onCancel={() => {
            setIsEditMode(false);
          }}
          cancelable
        />
      </div>
    ) : (
      <div className="flex flex-row gap-2 bg-white px-2 pt-2">
        <div className="flex flex-col gap-1">
          <img
            src={
              // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
              userCache[commentData.author] === undefined
                ? '/profile_placeholder.svg'
                : userCache[commentData.author].profilePicture ??
                  '/profile_placeholder.svg'
            }
            alt="avatar"
            className="size-4 overflow-hidden rounded-full object-cover"
          />
          <div className="mx-auto w-px flex-1 bg-gray-300"></div>
        </div>
        <div className="flex w-full flex-col gap-1 pb-1">
          <header className="flex w-full flex-row items-start justify-between">
            <span className="flex flex-row items-center gap-1 text-xs">
              <p className="font-bold text-slate-600">
                {/* eslint-disable-next-line
                @typescript-eslint/no-unnecessary-condition */}
                {userCache[commentData.author] === undefined
                  ? commentData.author
                  : userCache[commentData.author].username}
              </p>
              <LuDot className="text-slate-400" />
              <p>
                {/* Posted by {user.username}{' '} */}
                {timeAgo(commentData.postDate.toDate().toString())}
              </p>
            </span>
            {user && user.uid === commentData.author && (
              <DropdownList
                data-testid={'comment-action-trigger'}
                className="flex items-center p-0"
                triggerComponent={<GoKebabHorizontal />}
                dropdownList={[
                  {
                    text: 'report',
                    onClick: () => {
                      return;
                    },
                  },
                  {
                    text: 'edit',
                    onClick: () => {
                      setIsEditMode(true);
                    },
                  },
                  {
                    text: 'delete',
                    onClick: () => {
                      return;
                    },
                    className: 'text-red-500',
                  },
                ]}
              />
            )}
          </header>
          <main className="flex flex-row">
            <div>{parse(commentData.text)}</div>
          </main>
          <div className="mt-1 flex flex-row gap-3">
            <ButtonWithIcon
              icon={<FaRegHeart />}
              size={'xs'}
              variant={'clear'}
              onClick={likeComment}
              className="px-2 py-1"
            >
              {likeCount}
            </ButtonWithIcon>
            <ButtonWithIcon
              icon={<FaRegCommentAlt />}
              size={'xs'}
              variant={'clear'}
              onClick={() => setIsReplyMode(!isReplyMode)}
              className="px-2 py-1"
            >
              Reply
            </ButtonWithIcon>
          </div>
          {isReplyMode && (
            <CommentForm
              basePath={`${basepath}/${commentId}/comment`}
              onSuccessCallback={onComment}
              className="pt-4"
              label="Put your reply here"
              onCancel={() => {
                setIsReplyMode(false);
              }}
              cancelable
            />
          )}
          {Object.keys(comments).length > 0 && (
            <div className="pt-4">
              {Object.keys(comments).map((commentId) => (
                <div key={`comment-${commentId}}`}>
                  <CommentCard
                    commentData={comments[commentId]}
                    commentId={commentId}
                    basepath={`${basepath}/${commentId}/comment`}
                    onSuccessCallback={(newComment) => {
                      setComments(() => ({
                        ...comments,
                        [commentId]: newComment,
                      }));
                      setIsReplyMode(false);
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
}
