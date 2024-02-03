import { User } from '@/types/db';
import { FaChevronUp, FaPlus, FaRegCompass } from 'react-icons/fa6';
import { AiFillHome } from 'react-icons/ai';
import { FaChevronDown } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import useOverlay from '@/hook/useOverlay';
import CircleCreateModal from '@/component/modal/CircleCreateModal';
import { HTMLAttributes, useState } from 'react';
import { cn } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/hook/reduxHooks';
import { sideBarClose, unMountMenubarAnimation } from '@/redux/menubarReducer';
import useWindowSize from '@/hook/useWindowSize';

interface ListItemLinkProps extends HTMLAttributes<HTMLLIElement> {
  to: string;
}

function ListItemLink({
  children,
  to,
  className,
  ...props
}: ListItemLinkProps) {
  const dispatch = useAppDispatch();

  return (
    <li className={cn('px-4 py-2 hover:bg-gray-200', className)} {...props}>
      <Link
        to={to}
        className="flex items-center text-gray-700 hover:text-black"
        onClick={() => {
          dispatch(sideBarClose());
        }}
      >
        {children}
      </Link>
    </li>
  );
}

export default function Navbar({ user }: { user: User | null }) {
  const { showModal } = useOverlay();
  const { isMobile } = useWindowSize();
  const [isAccordionOpen, setIsAccordionOpen] = useState(true);
  const hasMounted = useAppSelector((state) => state.menubar.hasMounted);
  const dispatch = useAppDispatch();

  return (
    <div
      className={cn(
        'relative flex h-full w-9/12 flex-col border-r border-gray-200 bg-white lg:w-64',
        !hasMounted &&
          isMobile &&
          'origin-left animate-expand overflow-hidden whitespace-nowrap'
      )}
      onClick={(e) => e.stopPropagation()}
      onAnimationEnd={() => {
        dispatch(unMountMenubarAnimation());
      }}
    >
      <nav className="flex-1 overflow-y-auto">
        <ul className="pb-4">
          <ListItemLink to="/">
            <AiFillHome className="mr-2" />
            Home
          </ListItemLink>
          <ListItemLink to="/c">
            <FaRegCompass className="mr-2" />
            Explore
          </ListItemLink>
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
                  'flex flex-col',
                  isAccordionOpen ? 'h-fit py-4 pl-2' : 'h-0 overflow-hidden'
                )}
              >
                <li className="mb-2">
                  <button
                    className="flex items-center text-gray-700 hover:text-black"
                    onClick={() => {
                      showModal(CircleCreateModal, isMobile);
                    }}
                  >
                    <FaPlus className="mr-2" />
                    Create A Circle
                  </button>
                </li>
                {user.circle.map((circle) => (
                  <ListItemLink
                    to={`c/${circle}`}
                    key={circle}
                    className="mb-0 rounded-md px-1"
                  >
                    {circle}
                  </ListItemLink>
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
