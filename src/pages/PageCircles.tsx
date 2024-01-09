import { useState } from 'react';
import { Circle } from '@/types/db';
import useAuth from '@/hook/useAuth';
import { useLoaderData } from 'react-router-dom';
import CircleCard from '@/component/card/CircleCard';
import CircleJoinButton from '@/component/common/CircleJoinButton';
import ExpandableButton from '@/component/common/ExpandableButton';
import { FaPlus } from 'react-icons/fa6';
import useWindowSize from '@/hook/useWindowSize';
import useOverlay from '@/hook/useOverlay';
import CircleCreateModal from '@/component/modal/CircleCreateModal';

function PageCircles() {
  const [circles] = useState<Circle[]>(useLoaderData() as Circle[]);
  const { isMobile } = useWindowSize();
  const { setModal, setBottombar } = useOverlay();
  const { user } = useAuth();
  const { openModal, openBottombar } = useOverlay();

  function showCreateCircleForm() {
    if (isMobile) {
      setBottombar(<CircleCreateModal className="h-screen pt-12" />);
      openBottombar();
    } else {
      setModal(<CircleCreateModal />);
      openModal();
    }
  }

  return (
    <div className="flex flex-col gap-4 py-4">
      <span className="flex flex-row items-center justify-between pr-4">
        <h1 className="px-4 text-xl font-bold">Browse Circles</h1>
        <ExpandableButton icon={<FaPlus />} onclick={showCreateCircleForm}>
          create
        </ExpandableButton>
      </span>
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
    </div>
  );
}

export default PageCircles;
