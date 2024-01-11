import useAuth from '@/hook/useAuth';
import { HTMLAttributes, useEffect, useState } from 'react';
import { Comment } from '@/types/db';
import { CommentForm } from '@/component/form/CommentForm';
import { db } from '@/lib/firebase/config';
import { getDocs, collection, FirestoreError } from 'firebase/firestore';
import DropdownList from '@/component/common/DropdownList';
import { timeAgo } from '@/lib/utils';
import { GoKebabHorizontal } from 'react-icons/go';
import { LuDot } from 'react-icons/lu';
import ButtonWithIcon from '@/component/common/ButtonWithIcon';
import { FaRegCommentAlt, FaRegHeart } from 'react-icons/fa';
import { CommentEditForm } from '@/component/form/CommentEditForm';

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

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(
        collection(db, `${basepath}/${commentId}/comment`)
      );

      const dataObject: Record<string, Comment> = {};

      querySnapshot.forEach((doc) => {
        dataObject[doc.id] = doc.data() as Comment;
      });

      return dataObject;
    };

    fetchData()
      .then((comments) => setComments(comments))
      .catch((e: FirestoreError) => {
        // eslint-disable-next-line no-console
        console.log(e.code);
      });
  }, [basepath, commentId]);

  function onComment(newComment: Comment, commentId: string) {
    setComments({
      ...comments,
      [commentId]: newComment,
    });
    setIsReplyMode(false);
  }

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
        <img src="/profile_placeholder.svg" alt="img" className="h-4" />
        <div className="mx-auto w-px flex-1 bg-gray-300"></div>
      </div>
      <div className="flex w-full flex-col gap-1 pb-1">
        <header className="flex w-full flex-row items-center justify-between">
          <span className="flex flex-row items-center gap-1 text-xs">
            <p className="font-bold text-slate-600">{commentData.author}</p>
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
          <p className="">{commentData.text}</p>
        </main>
        <div className="mt-1 flex flex-row gap-3">
          <ButtonWithIcon icon={<FaRegHeart />} size={'xs'} variant={'clear'}>
            123
          </ButtonWithIcon>
          <ButtonWithIcon
            icon={<FaRegCommentAlt />}
            size={'xs'}
            variant={'clear'}
            onClick={() => setIsReplyMode(!isReplyMode)}
          >
            Reply
          </ButtonWithIcon>
        </div>
        {isReplyMode && (
          <CommentForm
            basePath={`${basepath}/${commentId}/comment`}
            onSuccessCallback={onComment}
            className="mt-4"
            label="Put your reply here"
            onCancel={() => {
              setIsReplyMode(false);
            }}
            cancelable
          />
        )}
        <div className="mt-4">
          {Object.keys(comments).map((commentId) => (
            <div key={`comment-${commentId}}`}>
              <CommentCard
                commentData={comments[commentId]}
                commentId={commentId}
                basepath={`${basepath}/${commentId}/comment`}
                onSuccessCallback={(newComment) => {
                  setComments(() => ({ ...comments, [commentId]: newComment }));
                  setIsReplyMode(false);
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
