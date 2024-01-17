/* eslint-disable react-refresh/only-export-components */
import { VariantProps, cva } from 'class-variance-authority';
import { HTMLAttributes, useEffect, useMemo, useState } from 'react';
import { cn, timeAgo } from '@/lib/utils';
import { Post } from '@/types/db';
import { Link, useNavigate } from 'react-router-dom';
import { LuDot } from 'react-icons/lu';
import { FaRegHeart, FaRegCommentAlt } from 'react-icons/fa';
import ButtonWithIcon from '@/component/common/ButtonWithIcon';
import { GoKebabHorizontal } from 'react-icons/go';
import DropdownList from '@/component/common/DropdownList';
import PostEditForm from '@/component/form/PostEditForm';
import { db } from '@/lib/firebase/config';
import { FirebaseError } from 'firebase/app';
import {
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
} from 'firebase/firestore';
import useAuth from '@/hook/useAuth';
import parse from 'html-react-parser';

const postCardVariant = cva('', {
  variants: {
    variant: {
      default: '',
      compact: '',
      text: '',
    },
    size: { default: '', sm: '' },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

interface PostCardProps extends VariantProps<typeof postCardVariant> {
  post: Post;
  postId: string;
  circleId: string;
  className?: HTMLAttributes<HTMLDivElement>['className'];
  blur?: boolean;
  commentCountInput?: number;
}

export default function PostCard({
  post,
  postId,
  circleId,
  variant,
  className,
  commentCountInput,
  blur = false,
  ...props
}: PostCardProps) {
  const isTextLong = useMemo(() => post.description.length > 1000, [post]);
  const { user } = useAuth();
  const [isEditMode, setIsEditMode] = useState(false);
  const [postData, setPostData] = useState(post);
  const navigate = useNavigate();
  const [, setDeleteError] = useState<string | null>(null);
  const [commentCount, setCommentCount] = useState(0);

  function onDelete() {
    deleteDoc(doc(db, `/circle/${circleId}/post/${postId}`))
      .then(() => {
        navigate('/circle/${circleId}', { replace: true });
      })
      .catch((e: FirebaseError) => setDeleteError(e.code));
  }

  useEffect(() => {
    async function getCommentCount() {
      const colRef = collection(
        db,
        `circle/${circleId}/post/${postId}/comment`
      );
      const snapshot = await getCountFromServer(colRef);
      return snapshot.data().count;
    }

    !commentCountInput &&
      getCommentCount()
        .then((count) => setCommentCount(count))
        .catch(() => setCommentCount(-1));
  }, [circleId, commentCountInput, postId]);

  return (
    <article
      className={cn(
        'flex w-full flex-col items-start gap-y-2 rounded-2xl bg-white px-4 py-3 text-slate-900',
        postCardVariant({ variant, className })
      )}
      {...props}
    >
      <header className="flex w-full flex-row items-center justify-between">
        <span className="flex flex-row items-center gap-1 text-xs">
          <Link
            to={`/c/${circleId}`}
            className="flex flex-row items-center gap-1 hover:underline"
          >
            <img src="/profile_placeholder.svg" alt="img" className="h-4" />
            <p className="font-bold text-slate-600">c/{circleId}</p>
          </Link>
          <LuDot className="text-slate-400" />
          <p>
            {/* Posted by {user.username}{' '} */}
            {timeAgo(post.postDate.toDate().toString())}
          </p>
        </span>
        {user && user.uid === post.author && (
          <DropdownList
            data-testid={'post-action-trigger'}
            className="flex items-center px-0"
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
                  onDelete();
                },
                className: 'text-red-500',
              },
            ]}
          />
        )}
      </header>
      {isEditMode ? (
        <PostEditForm
          post={postData}
          onSuccessCallback={(newPost) => {
            setPostData(newPost);
            setIsEditMode(false);
          }}
          onCancel={() => setIsEditMode(false)}
        />
      ) : (
        <main className="relative flex w-full flex-col gap-y-1">
          <Link to={`/c/${circleId}/p/${postId}`} className="hover:underline">
            <h1 className="text-lg font-bold">{postData.title}</h1>
          </Link>
          <div className="post-content">{parse(postData.description)}</div>
          {!blur && isTextLong && (
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-white/50 to-white"></div>
          )}
        </main>
      )}
      <div className="mt-3 flex flex-row gap-2">
        <ButtonWithIcon
          icon={<FaRegHeart size={14} />}
          className="items-center"
        >
          123
        </ButtonWithIcon>
        <ButtonWithIcon icon={<FaRegCommentAlt size={14} />}>
          {commentCountInput ?? commentCount}
        </ButtonWithIcon>
      </div>
    </article>
  );
}

export { PostCard, postCardVariant };
