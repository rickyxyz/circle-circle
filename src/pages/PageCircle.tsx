import { useEffect, useState } from 'react';
import { FirestoreError } from 'firebase/firestore';
import { Circle, Post } from '@/types/db';
import { useLoaderData, useNavigate } from 'react-router-dom';
import CircleHeader from '@/component/circle/CircleHeader';
import { getCollectionAsObject } from '@/lib/firebase/firestore';
import PostCard from '@/component/card/PostCard';
import PostCreateForm from '@/component/form/PostCreateForm';
import useWindowSize from '@/hook/useWindowSize';
// function UpdateForm({
//   circleData,
//   onSuccessCallback,
// }: {
//   circleData: Circle;
//   onSuccessCallback?: (newCircle: Circle) => void;
// }) {
//   const circleCreateSchema = z.object({
//     description: z.string().max(300),
//   });
//   type CircleCreateSchema = z.infer<typeof circleCreateSchema>;

//   const { user } = useAuth();
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<CircleCreateSchema>({
//     resolver: zodResolver(circleCreateSchema),
//     defaultValues: {
//       description: circleData.description,
//     },
//   });
//   const [createError, setCreateError] = useState<string | null>(null);

//   function onSubmit(data: CircleCreateSchema) {
//     if (!user) {
//       throw new customError('unauthorize', 'you are not authorized to do this');
//     }
//     editCircle(
//       { ...circleData, ...data },
//       onSuccessCallback,
//       (e: FirestoreError) => {
//         setCreateError(e.code);
//       }
//     );
//   }

//   return (
//     <form
//       // eslint-disable-next-line @typescript-eslint/no-misused-promises
//       onSubmit={handleSubmit(onSubmit)}
//       className="mx-auto mt-8 max-w-md bg-white p-4 shadow-md"
//     >
//       <h2 className="mb-4 text-2xl font-bold">
//         you are editing {circleData.name}
//       </h2>

//       <div className="mb-4">
//         <label
//           htmlFor="circle-description"
//           className="mb-2 block text-sm font-bold text-gray-700"
//         >
//           Circle Description
//         </label>
//         <input
//           type="text"
//           id="circle-description"
//           {...register('description')}
//           className="w-full rounded-md border border-gray-300 p-2"
//         />
//         <p className="text-xs italic text-red-500">
//           {errors.description?.message}
//         </p>
//       </div>

//       {createError && <p className="text-red-500">{createError}</p>}

//       <button
//         type="submit"
//         className="rounded-md bg-blue-500 p-2 text-white hover:bg-blue-700"
//       >
//         Update
//       </button>
//     </form>
//   );
// }

function PageCircle() {
  const { circle, isMember } = useLoaderData() as {
    circle: Circle;
    isMember: boolean;
  };

  // const navigate = useNavigate();
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
