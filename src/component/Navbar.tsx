import { User } from '@/types/db';
import { FaChevronUp, FaPlus, FaRegCompass } from 'react-icons/fa6';
import { AiFillHome } from 'react-icons/ai';
import { FaChevronDown } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import useOverlay from '@/hook/useOverlay';
import CircleCreateModal from '@/component/modal/CircleCreateModal';
import useWindowSize from '@/hook/useWindowSize';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function Navbar({ user }: { user: User | null }) {
  const { setModal, openModal, setBottombar, openBottombar } = useOverlay();
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const { isMobile } = useWindowSize();

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
    <div className="relative flex h-full flex-col border-r border-gray-200 bg-white lg:w-64">
      <nav className="flex-1 overflow-y-auto">
        <ul className="py-4">
          <li className="mb-4 px-4">
            <Link
              to={'/'}
              className="flex items-center text-gray-700 hover:text-black"
            >
              <AiFillHome className="mr-2" />
              Home
            </Link>
          </li>
          <li className="mb-4 px-4">
            <Link
              to={'/c'}
              className="flex items-center text-gray-700 hover:text-black"
            >
              <FaRegCompass className="mr-2" />
              Explore
            </Link>
          </li>
          <hr />
          {user && (
            <li className="mb-4 p-4">
              <button
                className="flex w-full flex-row items-center justify-between gap-2 text-gray-700 hover:text-black"
                onClick={() => {
                  setIsAccordionOpen((p) => !p);
                }}
              >
                Circles
                {isAccordionOpen ? (
                  <FaChevronUp className="mr-2" />
                ) : (
                  <FaChevronDown className="mr-2" />
                )}
              </button>
              <ul
                className={cn(
                  'flex flex-col gap-4',
                  isAccordionOpen ? 'h-fit p-4' : 'h-0 overflow-hidden'
                )}
              >
                <li>
                  <button
                    className="flex items-center text-gray-700 hover:text-black"
                    onClick={showCreateCircleForm}
                  >
                    <FaPlus className="mr-2" />
                    Create A Circle
                  </button>
                </li>
                {user.circle.map((circle) => (
                  <li key={circle}>
                    <Link
                      to={`c/${circle}`}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {circle}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          )}
        </ul>
        <br />
      </nav>
    </div>
  );
}
