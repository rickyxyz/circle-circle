import { User } from '@/types/db';
import { GoKebabHorizontal, GoSearch } from 'react-icons/go';
import { GiHamburgerMenu } from 'react-icons/gi';
import Button from '@/component/common/Button';
import { useAppDispatch } from '@/hook/reduxHooks';
import { sidebarToggle } from '@/redux/menubarReducer';

export default function Header({ user }: { user: User | null }) {
  const dispatch = useAppDispatch();

  return (
    <header className="border-b border-gray-200 bg-white p-4">
      <div className="container mx-auto flex items-center justify-between">
        <button
          className="mr-4 flex items-center md:hidden"
          onClick={() => dispatch(sidebarToggle())}
        >
          <GiHamburgerMenu />
        </button>
        <div className="flex items-center">
          <img src="/logo2.svg" alt="Logo" className="mr-2 h-8" />
        </div>
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
            <div className="hidden items-center md:flex">
              <img
                src={user.profilePicture}
                alt="User Avatar"
                className="h-8 w-8 rounded-full"
              />
            </div>
          ) : (
            <Button variant="default" className="hidden  md:flex">
              Login
            </Button>
          )}
          <div className="flex items-center md:hidden">
            <GoKebabHorizontal />
          </div>
        </div>
      </div>
    </header>
  );
}
