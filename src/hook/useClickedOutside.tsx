import { useEffect, useRef } from 'react';

export default function useClickedOutside(
  onClickedOutside: (event?: MouseEvent) => void
) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClickedOutside(event);
      }
    };

    document.addEventListener('click', handleClickOutside, true);

    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [onClickedOutside]);

  return ref;
}
