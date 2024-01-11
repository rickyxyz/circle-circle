import Button from '@/component/common/Button';
import useClickedOutside from '@/hook/useClickedOutside';
import useOverlay from '@/hook/useOverlay';
import useWindowSize from '@/hook/useWindowSize';
import { cn } from '@/lib/utils';
import {
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactNode,
  useRef,
  useState,
} from 'react';

interface DropdownListItem {
  text: string;
  onClick: () => void;
  className?: HTMLAttributes<HTMLButtonElement>['className'];
}

interface DropdownListProps
  extends ButtonHTMLAttributes<HTMLButtonElement | HTMLAnchorElement> {
  triggerComponent: ReactNode;
  dropdownList: DropdownListItem[];
}

export default function DropdownList({
  triggerComponent,
  dropdownList,
  className,
  ...props
}: DropdownListProps) {
  const { isMobile } = useWindowSize();
  const { setBottombar, openBottombar, closeBottombar } = useOverlay();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const buttonRef = useRef(null);
  const dropdownRef = useClickedOutside(() => {
    setDropdownOpen(false);
  }, buttonRef);

  const handleButtonClick = () => {
    if (!isMobile) {
      setDropdownOpen(!isDropdownOpen);
    } else {
      setBottombar(
        <>
          {dropdownList.map((listItem, idx) => (
            <button
              key={`dropdown-item-${listItem.text}-${idx}`}
              onClick={() => {
                setDropdownOpen(false);
                closeBottombar();
                listItem.onClick();
              }}
              className={cn(
                'block w-full px-4 py-2 text-base capitalize text-gray-700 hover:bg-gray-100 hover:text-gray-900',
                listItem.className
              )}
              role="menuitem"
            >
              {listItem.text}
            </button>
          ))}
        </>
      );
      openBottombar();
    }
  };

  return (
    <div className="relative inline-block text-left">
      <Button
        type="button"
        onClick={handleButtonClick}
        className={cn(
          'inline-flex items-center justify-center bg-transparent',
          className
        )}
        ref={buttonRef}
        {...props}
      >
        {triggerComponent}
      </Button>

      {isDropdownOpen && (
        <div
          className={cn(
            'absolute right-0 z-20 mt-1 w-max origin-top-right rounded-sm bg-white py-1 shadow-sm ring-1 ring-black ring-opacity-5'
          )}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
          ref={dropdownRef}
        >
          {dropdownList.map((listItem, idx) => (
            <button
              key={`dropdown-item-${listItem.text}-${idx}`}
              onClick={() => {
                setDropdownOpen(false);
                listItem.onClick();
              }}
              className={cn(
                'block w-full px-4 py-2 text-sm capitalize text-gray-700 hover:bg-gray-100 hover:text-gray-900',
                listItem.className
              )}
              role="menuitem"
            >
              {listItem.text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
