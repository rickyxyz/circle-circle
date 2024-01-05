import { useState } from 'react';
import { Circle } from '@/types/db';
import useAuth from '@/hook/useAuth';
import { useLoaderData } from 'react-router-dom';
import CircleCard from '@/component/card/CircleCard';
import CircleJoinButton from '@/component/common/CircleJoinButton';
import CircleCreateForm from '@/component/form/CircleCreateForm';

function PageCircle() {
  const [circles, setCircles] = useState<Circle[]>(useLoaderData() as Circle[]);
  const { user } = useAuth();

  function onSuccessCreate(newCircle: Circle) {
    setCircles((prev) => [...prev, newCircle]);
  }

  return (
    <div className="flex flex-col gap-4 py-4">
      <h1 className="px-4 text-xl font-bold">Browse Circles</h1>
      <ul className="flex flex-col gap-y-2 px-4">
        {circles.map((circle, idx) => (
          <li
            key={`circle_card-${circle.name}-${idx}`}
            className="flex flex-row items-center justify-between"
          >
            <CircleCard circle={circle} className="px-0" />
            <CircleJoinButton
              circle={circle}
              userHasJoined={user != null && user.circle.includes(circle.name)}
            />
          </li>
        ))}
      </ul>
      <CircleCreateForm onSuccessCallback={onSuccessCreate} />
    </div>
  );
}

export default PageCircle;
