import { useAppDispatch } from '@/hook/reduxHooks';
import { bottombarClose } from '@/redux/menubarReducer';

export default function Bottombar() {
  const dispatch = useAppDispatch();

  return (
    <>
      <div
        className="fixed inset-0 bg-black/25"
        onClick={() => dispatch(bottombarClose())}
      />
      <div className="fixed bottom-0 left-0 flex w-full flex-col items-center border-t border-gray-200 bg-white p-4">
        <a href="/profile" className="mb-2 text-gray-600 hover:text-gray-800">
          Profile
        </a>
        <a href="/settings" className="mb-2 text-gray-600 hover:text-gray-800">
          Settings
        </a>
        <a
          href="/edit-profile"
          className="mb-2 text-gray-600 hover:text-gray-800"
        >
          Edit Profile
        </a>
        <button
          onClick={() => {
            return; // TODO: add signout here
          }}
          className="mb-2 cursor-pointer text-gray-600 hover:text-gray-800"
        >
          Sign Out
        </button>
      </div>
    </>
  );
}
