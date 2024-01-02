import useAuth from '@/hook/useAuth';
import { useEffect, useState } from 'react';
import { Comment } from '@/types/db';
import { CommentEditForm, CommentForm } from '@/component/CommentForm';
import { db } from '@/lib/firebase/config';
import { getDocs, collection, FirestoreError } from 'firebase/firestore';

export default function CommentCard({
  commentData,
  commentId,
  basepath,
  onSuccessCallback,
  onDelete,
}: {
  commentData: Comment;
  commentId: string;
  basepath: string;
  onSuccessCallback?: (newComment: Comment) => void;
  onDelete?: () => void;
}) {
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
        onSuccessCallback={(newComment) => {
          onSuccessCallback && onSuccessCallback(newComment);
          setIsEditMode(false);
        }}
        commentId={commentId}
      />
    </div>
  ) : (
    <div>
      {user && user.uid === commentData.author && (
        <>
          <button
            onClick={() => {
              setIsEditMode(true);
            }}
          >
            edit
          </button>
          <button
            onClick={() => {
              onDelete && onDelete();
            }}
          >
            delete
          </button>
        </>
      )}
      <p>{commentData.author}</p>
      <p>{commentData.text}</p>
      <button onClick={() => setIsReplyMode(true)}>reply</button>
      {isReplyMode && (
        <CommentForm
          basePath={`${basepath}/${commentId}/comment`}
          onSuccessCallback={onComment}
        />
      )}
      <div className="pl-4">
        <p>child</p>
        {Object.keys(comments).map((commentId) => (
          <div key={`comment-${commentId}}`}>
            <CommentCard
              commentData={comments[commentId]}
              commentId={commentId}
              basepath={`${basepath}/${commentId}/comment`}
              onSuccessCallback={(newComment) => {
                setComments(() => ({ ...comments, [commentId]: newComment }));
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
