import { User } from '@/types/db';
import { GoSearch } from 'react-icons/go';
import { GiHamburgerMenu } from 'react-icons/gi';
import Button from '@/component/common/Button';
import { useAppDispatch } from '@/hook/reduxHooks';
import { sidebarToggle } from '@/redux/menubarReducer';
import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import DropdownList from '@/component/common/DropdownList';
import useAuth from '@/hook/useAuth';

interface HeaderProps extends HTMLAttributes<HTMLDivElement> {
  user: User | null;
}

const Header = ({ user, className, ...props }: HeaderProps) => {
  const dispatch = useAppDispatch();
  const { logout } = useAuth();

  return (
    <header
      className={cn('border-b border-gray-200 bg-white p-4', className)}
      {...props}
    >
      <div className="flex items-center justify-between">
        <button
          className="mr-4 flex items-center md:hidden"
          onClick={() => dispatch(sidebarToggle())}
        >
          <GiHamburgerMenu />
        </button>
        <Link to={'/'} className="flex items-center">
          <svg
            width="283"
            height="204"
            viewBox="0 0 283 204"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-10"
          >
            <circle cx="101.5" cy="101.5" r="52.5" fill="#155E75" />
            <circle
              cx="181"
              cy="102"
              r="90"
              stroke="#155E75"
              strokeWidth="24"
            />
            <circle
              cx="102"
              cy="102"
              r="90"
              stroke="#155E75"
              strokeWidth="24"
            />
          </svg>
        </Link>
        <div className="hidden flex-grow items-center justify-center md:flex">
          <div className="flex w-full max-w-xl items-center rounded-md bg-gray-100 px-3 py-2 text-gray-800">
            <div className="mr-2">
              <GoSearch />
            </div>
            <input
              type="text"
              placeholder="Search"
              className="w-full bg-gray-100 focus:outline-none"
            />
          </div>
        </div>
        <div className="mr-4 flex flex-grow items-center justify-end md:hidden">
          <GoSearch />
        </div>
        <div className="flex items-center justify-end md:min-w-20">
          {user ? (
            <DropdownList
              triggerComponent={
                <img
                  src={user.profilePicture ?? '/profile_placeholder.svg'}
                  alt="User Avatar"
                  className="h-8 w-8 items-center rounded-full"
                />
              }
              dropdownList={[
                {
                  text: 'profile',
                  to: `/u/${user.uid}`,
                },
                {
                  text: 'sign out',
                  onClick: () => {
                    logout();
                  },
                },
              ]}
            />
          ) : (
            <>
              <Button to="/account/login" variant="default">
                Login
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
