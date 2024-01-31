import { User } from '@/types/db';
import { FaChevronUp, FaPlus, FaRegCompass } from 'react-icons/fa6';
import { AiFillHome } from 'react-icons/ai';
import { FaChevronDown } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import useOverlay from '@/hook/useOverlay';
import CircleCreateModal from '@/component/modal/CircleCreateModal';
import { HTMLAttributes, useState } from 'react';
import { cn } from '@/lib/utils';
import { useAppDispatch } from '@/hook/reduxHooks';
import { sideBarClose } from '@/redux/menubarReducer';
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
    <li className={cn('mb-4 px-4', className)} {...props}>
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

  return (
    <div
      className="relative flex h-full w-9/12 flex-col border-r border-gray-200 bg-white lg:w-64"
      onClick={(e) => e.stopPropagation()}
    >
      <nav className="flex-1 overflow-y-auto">
        <ul className="py-4">
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
                  'flex flex-col gap-4',
                  isAccordionOpen ? 'h-fit py-4 pl-2' : 'h-0 overflow-hidden'
                )}
              >
                <li>
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
                    className="mb-0 px-0"
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
