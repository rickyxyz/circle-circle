import { RefObject, useEffect, useRef } from 'react';

export default function useClickedOutside(
  onClickedOutside: (event?: MouseEvent) => void,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extraRef?: RefObject<any>
) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        if (
          !extraRef ||
          (extraRef.current &&
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
            !extraRef.current.contains(event.target as Node))
        ) {
          onClickedOutside(event);
        }
      }
    };

    document.addEventListener('click', handleClickOutside, true);

    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [extraRef, onClickedOutside]);

  return ref;
}
