import { User } from '@/types/db';
import { useLoaderData } from 'react-router-dom';

function PageProfile() {
  const loaderData = useLoaderData() as User;

  return (
    <div>
      <h2>this is {loaderData.username} profile page</h2>
    </div>
  );
}

export default PageProfile;
