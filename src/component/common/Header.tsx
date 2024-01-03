import { User } from '@/types/db';
import { GoKebabHorizontal, GoSearch } from 'react-icons/go';
import { GiHamburgerMenu } from 'react-icons/gi';

export default function Header({ user }: { user: User | null }) {
  return (
    <header className="border-b border-gray-200 bg-white p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="mr-4 flex items-center md:hidden">
          <GiHamburgerMenu />
        </div>
        {/* Logo on the left */}
        <div className="flex items-center">
          {/* <img
            src="/reddit-logo.png" // Replace with your logo or image URL
            alt="Logo"
            className="mr-2 h-8 w-8"
          /> */}
          <span className="hidden text-lg font-bold text-gray-800 md:block">
            CircleCircle
          </span>
        </div>
        {/* Search bar or icon based on screen size */}
        <div className="hidden flex-grow items-center justify-center md:flex">
          <input
            type="text"
            placeholder="Search"
            className="w-full max-w-xl rounded-md bg-gray-100 px-3 py-2 text-gray-800"
          />
        </div>
        <div className="mr-4 flex flex-grow items-center justify-end md:hidden">
          {/* Search icon for mobile */}
          <GoSearch />
        </div>
        {/* User profile or kebab icon based on screen size */}
        <div className="flex items-center">
          {user ? (
            // Render user information when user is provided
            <div className="hidden items-center md:flex">
              <img
                src={user.profilePicture} // Replace with your user avatar image URL
                alt="User Avatar"
                className="mr-2 h-8 w-8 rounded-full"
              />
              <span className="text-gray-800">{user.username}</span>
            </div>
          ) : (
            // Render login button when user is not provided
            <button className="hidden rounded bg-blue-500 px-4 py-2 text-white md:flex">
              Login
            </button>
          )}
          <div className="flex items-center md:hidden">
            {/* Kebab icon for mobile */}
            <GoKebabHorizontal />
          </div>
        </div>
      </div>
    </header>
  );
}
