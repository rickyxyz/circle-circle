import { Circle, User } from '@/types/db';
import { GoSearch } from 'react-icons/go';
import { GiHamburgerMenu } from 'react-icons/gi';
import Button from '@/component/common/Button';
import { useAppDispatch } from '@/hook/reduxHooks';
import { sidebarToggle } from '@/redux/menubarReducer';
import { HTMLAttributes, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import DropdownList from '@/component/common/DropdownList';
import useAuth from '@/hook/useAuth';
import { searchCircle } from '@/lib/search';
import useClickedOutside from '@/hook/useClickedOutside';
import { FirebaseError } from 'firebase/app';
import useWindowSize from '@/hook/useWindowSize';
import { FaXmark } from 'react-icons/fa6';

function SearchOverlay({ className }: HTMLAttributes<HTMLDivElement>) {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Record<string, Circle>>(
    {}
  );
  const [isLoadingSearch, setIsLoadingSearch] = useState(true);
  const [isResultVisible, setIsResultVisible] = useState(false);
  const searchBarRef = useRef(null);
  const resultRef = useClickedOutside(() => {
    setIsResultVisible(false);
  }, searchBarRef);
  const [searchError, setSearchError] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      if (query.length > 0) {
        setIsLoadingSearch(true);
        searchCircle(query)
          .then((result) => {
            setSearchResults(result);
          })
          .catch((e: FirebaseError) => {
            setSearchError(e.code);
          })
          .finally(() => {
            setIsLoadingSearch(false);
          });
      }
    }, 200);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  return (
    <div
      className={cn(
        'relative flex-grow items-center justify-center md:flex',
        className
      )}
      ref={searchBarRef}
    >
      <div className="flex w-full max-w-xl items-center rounded-md bg-gray-100 px-3 py-2 text-gray-800">
        <div className="mr-2">
          <GoSearch />
        </div>
        <input
          type="text"
          placeholder="Search"
          className="w-full bg-gray-100 focus:outline-none"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => {
            setIsResultVisible(true);
          }}
        />
      </div>
      {isResultVisible && query.length > 0 && (
        <div
          className="absolute -bottom-1 z-30 flex w-full max-w-xl translate-y-full flex-col rounded-md bg-white text-black shadow-md"
          ref={resultRef}
        >
          {isLoadingSearch && <span className="px-4 py-2">Loading</span>}
          {!isLoadingSearch && searchError && (
            <span className="px-4 py-2">{searchError}</span>
          )}
          {!isLoadingSearch &&
          !searchError &&
          Object.keys(searchResults).length > 0
            ? Object.keys(searchResults).map((result) => (
                <SearchResult
                  key={`sr-${result}`}
                  resultId={result}
                  result={searchResults[result]}
                  onClick={() => {
                    setIsLoadingSearch(true);
                    setIsResultVisible(false);
                    setSearchResults({});
                    setQuery('');
                  }}
                />
              ))
            : !isLoadingSearch &&
              !searchError && <span className="px-4 py-2">No result</span>}
        </div>
      )}
    </div>
  );
}

interface SearchResultProps extends HTMLAttributes<HTMLAnchorElement> {
  resultId: string;
  result: Circle;
}
function SearchResult({ result, resultId, ...props }: SearchResultProps) {
  return (
    <Link
      to={`/c/${resultId}`}
      className="flex flex-row items-center gap-2 px-4 py-2 hover:bg-gray-100"
      {...props}
    >
      <img
        src={result.thumbnailUrl ?? '/profile_placeholder.svg'}
        alt={result.name}
        className="h-4 w-4 rounded-full"
      />
      c/{result.name}
    </Link>
  );
}

interface HeaderProps extends HTMLAttributes<HTMLDivElement> {
  user: User | null;
}

export default function Header({ user, className, ...props }: HeaderProps) {
  const { isMobile } = useWindowSize();
  const dispatch = useAppDispatch();
  const { logout } = useAuth();
  const [isSearchOverlayVisible, setIsSearchOverlayVisible] = useState(false);

  return (
    <header
      className={cn('border-b border-gray-100 bg-white p-4', className)}
      {...props}
    >
      {!isSearchOverlayVisible ? (
        <div className="flex items-center justify-between">
          <button
            className="mr-4 flex items-center md:hidden"
            onClick={() => dispatch(sidebarToggle())}
          >
            <GiHamburgerMenu />
          </button>
          <Link
            to={'/'}
            className="flex items-center"
            aria-label="circle-circle"
          >
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
          {!isMobile && <SearchOverlay />}
          {isMobile && (
            <div className="mr-4 flex flex-grow items-center justify-end">
              <Button
                onClick={() => {
                  setIsSearchOverlayVisible((p) => !p);
                }}
                variant={'noStyle'}
                hover={'none'}
                className="bg-transparent"
              >
                <GoSearch />
              </Button>
            </div>
          )}
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
      ) : (
        <div className="flex w-full flex-row">
          <Button
            hover={'none'}
            variant={'noStyle'}
            onClick={() => {
              setIsSearchOverlayVisible(false);
            }}
          >
            <FaXmark size={20} />
          </Button>
          <SearchOverlay className={''} />
        </div>
      )}
    </header>
  );
}
