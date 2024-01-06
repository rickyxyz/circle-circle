import { User } from '@/types/db';
import { FaPlus, FaRegCompass } from 'react-icons/fa6';
import { AiFillHome } from 'react-icons/ai';
import { FaChevronDown } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import useModal from '@/hook/useModal';
import CircleCreateModal from '@/component/modal/CircleCreateModal';

export default function Navbar({ user }: { user: User | null }) {
  const { setModal, openModal, closeModal } = useModal();
  const navigate = useNavigate();

  return (
    <div className="relative flex h-full w-64 flex-col border-r border-gray-200 bg-white">
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
            <li className="mb-4 px-4">
              <div className="flex items-center text-gray-700 hover:text-black">
                <FaChevronDown className="mr-2" />
                Circles
              </div>
              <ul className="ml-4">
                <li className="mb-4">
                  <button
                    className="flex items-center text-gray-700 hover:text-black"
                    onClick={() => {
                      setModal(
                        <CircleCreateModal
                          onSuccessCallback={(newCircle) => {
                            closeModal();
                            navigate(`/c/${newCircle.name}`);
                          }}
                        />
                      );
                      openModal();
                    }}
                  >
                    <FaPlus className="mr-2" />
                    Create A Circle
                  </button>
                </li>
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
        <br />
      </nav>
    </div>
  );
}
