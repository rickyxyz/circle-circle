import { User } from '@/types/db';
import { FaRegCompass } from 'react-icons/fa6';
import { AiFillHome } from 'react-icons/ai';
import { FaChevronDown } from 'react-icons/fa';

export default function Sidebar({ user }: { user: User | null }) {
  return (
    <div className="flex h-screen w-64 flex-col border-r border-gray-200 bg-white">
      <nav className="flex-1 overflow-y-auto">
        <ul className="p-4">
          <li className="mb-4">
            <a
              href="#"
              className="flex items-center text-gray-700 hover:text-black"
            >
              <AiFillHome className="mr-2" />
              Home
            </a>
          </li>
          <li className="mb-4">
            <a
              href="#"
              className="flex items-center text-gray-700 hover:text-black"
            >
              <FaRegCompass className="mr-2" />
              Explore
            </a>
          </li>
          {user && (
            <li className="mb-4">
              <div className="flex items-center text-gray-700 hover:text-black">
                <FaChevronDown className="mr-2" />
                My Communities
              </div>
              <ul className="ml-4">
                {/* TODO: circle data fetch logic */}
                {user.circle.map((circle) => (
                  <li key={circle} className="mb-2">
                    <a href="#" className="text-gray-500 hover:text-gray-700">
                      {circle}
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
}
