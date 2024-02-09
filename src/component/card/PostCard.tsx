import { HTMLAttributes, useEffect, useRef, useState } from 'react';
import { cn, timeAgo } from '@/lib/utils';
import { Post } from '@/types/db';
import {
  Link,
  createSearchParams,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import { LuDot } from 'react-icons/lu';
import { FaRegCommentAlt, FaRegHeart, FaHeart } from 'react-icons/fa';
import ButtonWithIcon from '@/component/common/ButtonWithIcon';
import { GoKebabHorizontal } from 'react-icons/go';
import DropdownList from '@/component/common/DropdownList';
import PostEditForm from '@/component/form/PostEditForm';
import { db, storage } from '@/lib/firebase/config';
import { FirebaseError } from 'firebase/app';
import {
  FirestoreError,
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  getDoc,
  setDoc,
} from 'firebase/firestore';
import useAuth from '@/hook/useAuth';
import parse from 'html-react-parser';
import { ref, listAll, getDownloadURL, StorageError } from 'firebase/storage';
import ImageCarousel from '@/component/common/ImageCarousel';
import { getDownloadUrl } from '@/lib/firebase/storage';
import PromptLogin from '@/component/common/PromptLogin';

interface PostCardProps {
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
  className,
  commentCountInput,
  blur = true,
  ...props
}: PostCardProps) {
  const [textIsLong, setTextIsLong] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current)
      setTextIsLong(contentRef.current.clientHeight >= 200);
  }, []);
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [isEditMode, setIsEditMode] = useState(
    searchParams.get('edit') === 'true'
  );
  const [postData, setPostData] = useState(post);
  const navigate = useNavigate();
  const [, setDeleteError] = useState<string | null>(null);
  const [commentCount, setCommentCount] = useState(0);
  const [likeCount, setLikeCount] = useState(0);
  const [errors, setErrors] = useState<string | null>(null);
  const [circleImageUrl, setCircleImageUrl] = useState<string>(
    '/profile_placeholder.svg'
  );
  const [isLiked, setIsLiked] = useState(false);

  function onDelete() {
    deleteDoc(doc(db, `/circle/${circleId}/post/${postId}`))
      .then(() => {
        navigate('/circle/${circleId}', { replace: true });
      })
      .catch((e: FirebaseError) => setDeleteError(e.code));
  }

  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    getDownloadUrl('c', circleId)
      .then((downloadUrl) => {
        setCircleImageUrl(downloadUrl);
      })
      .catch(() => {
        setCircleImageUrl('/profile_placeholder.svg');
      });
  }, [circleId]);

  useEffect(() => {
    if (!post.hasImage) return;
    async function getImageUrls() {
      const imagesRef = ref(storage, `c/${circleId}/p/${postId}`);

      const imageList = await listAll(imagesRef);

      const downloadPromises = imageList.items.map(async (item) => {
        const url = await getDownloadURL(item);
        return url;
      });

      const fetchedImageUrls = await Promise.all(downloadPromises);

      setImageUrls(fetchedImageUrls);
    }

    getImageUrls().catch((e: StorageError) => setErrors(e.code));
  }, [circleId, post.hasImage, postId]);

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

  function likePost() {
    if (user) {
      const docRef = doc(
        db,
        `circle/${circleId}/post/${postId}/like/${user.uid}`
      );
      getDoc(docRef)
        .then((doc) => {
          if (doc.exists()) {
            deleteDoc(docRef)
              .then(() => {
                setLikeCount((p) => p - 1);
                setIsLiked(false);
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
                setIsLiked(true);
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
    async function getLikeCount() {
      const colRef = collection(db, `circle/${circleId}/post/${postId}/like`);
      const snapshot = await getCountFromServer(colRef);
      return snapshot.data().count;
    }

    getLikeCount()
      .then((count) => setLikeCount(count))
      .catch(() => setLikeCount(-1));
  }, [circleId, commentCountInput, postId]);

  useEffect(() => {
    async function fetchLikeStatus() {
      const docRef = doc(
        db,
        `circle/${circleId}/post/${postId}/like/${user?.uid}`
      );
      return getDoc(docRef);
    }

    fetchLikeStatus()
      .then((docSnap) => {
        if (docSnap.exists()) {
          setIsLiked(true);
        }
      })
      .catch(() => {
        return;
      });
  }, [circleId, postId, user?.uid]);

  return (
    <article
      className={cn(
        'flex w-full flex-col items-start gap-y-2 rounded-2xl bg-white px-4 py-3 text-slate-900',
        className
      )}
      {...props}
    >
      <header className="flex w-full flex-row items-center justify-between">
        <span className="flex flex-row items-center gap-1 text-xs">
          <Link
            to={`/c/${circleId}`}
            className="flex flex-row items-center gap-1 hover:underline"
          >
            <img
              src={circleImageUrl}
              alt="img"
              className="h-4 w-4 rounded-full object-cover"
            />
            <p className="font-bold text-slate-600">c/{circleId}</p>
          </Link>
          <LuDot className="text-slate-400" />
          <p>{timeAgo(post.postDate.toDate().toString())}</p>
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
                  if (blur) {
                    navigate({
                      pathname: `/c/${circleId}/p/${postId}`,
                      search: createSearchParams({
                        edit: 'true',
                      }).toString(),
                    });
                  }
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
            if (post.hasImage) {
              navigate(0);
            } else {
              setPostData(newPost);
              setIsEditMode(false);
            }
          }}
          onCancel={() => setIsEditMode(false)}
        />
      ) : !errors ? (
        <main
          className={cn(
            'relative flex w-full flex-col gap-y-1',
            blur && 'max-h-[200px] overflow-hidden'
          )}
          ref={contentRef}
        >
          <Link to={`/c/${circleId}/p/${postId}`} className="hover:underline">
            <h1 className="text-lg font-bold">{postData.title}</h1>
          </Link>
          {post.hasImage ? (
            <ImageCarousel imageUrls={imageUrls} />
          ) : (
            <div className="post-content">{parse(postData.description)}</div>
          )}
          {blur && textIsLong && (
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-white/50 to-white"></div>
          )}
        </main>
      ) : (
        <p>{errors}</p>
      )}
      <div className="mt-3 flex flex-row gap-2">
        <PromptLogin>
          <ButtonWithIcon
            icon={
              isLiked ? (
                <FaHeart size={14} className={'text-red-500'} />
              ) : (
                <FaRegHeart size={14} />
              )
            }
            className="items-center"
            onClick={likePost}
          >
            {likeCount}
          </ButtonWithIcon>
        </PromptLogin>
        <PromptLogin>
          <ButtonWithIcon
            icon={<FaRegCommentAlt size={14} />}
            to={`/c/${circleId}/p/${postId}?f=comment`}
          >
            {commentCountInput ?? commentCount}
          </ButtonWithIcon>
        </PromptLogin>
      </div>
    </article>
  );
}

export { PostCard };
