import { useLoaderData } from 'react-router-dom';

interface LoaderType {
  isLoggedIn: boolean;
  userId: string;
}

function PageProfile() {
  const { isLoggedIn, userId } = useLoaderData() as LoaderType;
  const text = isLoggedIn && !userId ? 'your' : `${userId}'s`;

  return (
    <div>
      <h2>this is {text} profile page</h2>
    </div>
  );
}

export default PageProfile;
