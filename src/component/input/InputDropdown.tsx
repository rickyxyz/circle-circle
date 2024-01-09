import { cn } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';
import {
  HTMLAttributes,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { FieldValues } from 'react-hook-form';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';

const inputDropdownVariant = cva('', {
  variants: {
    variant: {
      default: '',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

interface InputDropdownProps<T extends FieldValues>
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof inputDropdownVariant> {
  field: T;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleOptionClick: (value: any) => void;
  dropdownOptions: string[];
  placeholder: string;
}

export default function InputDropdown<T extends FieldValues>({
  field,
  handleOptionClick,
  dropdownOptions,
  placeholder,
  className,
  id,
  ...props
}: InputDropdownProps<T>) {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleSelect = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (value: any) => {
      setDropdownOpen(false);
      handleOptionClick(value);
    },
    [handleOptionClick]
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const dropdownContent = useMemo(() => {
    return (
      <div className="absolute left-0 top-full mt-1 w-full rounded-md border border-gray-200 bg-white py-1 shadow-lg">
        {dropdownOptions.map((option) => {
          return (
            <div
              key={`topic_${option.replace(' ', '_')}`}
              className="cursor-pointer px-4 py-2 capitalize hover:bg-gray-100"
              onClick={() => handleSelect(option)}
            >
              {option}
            </div>
          );
        })}
      </div>
    );
  }, [dropdownOptions, handleSelect]);

  return (
    <div
      ref={dropdownRef}
      className={cn(
        'relative w-full cursor-pointer rounded-md border border-gray-300 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none',
        inputDropdownVariant({ className })
      )}
      aria-label={id}
      {...props}
    >
      <div
        onClick={() => setDropdownOpen(!isDropdownOpen)}
        className="flex h-10 w-full items-center px-2 capitalize"
      >
        {field.value ? (
          <span>{field.value}</span>
        ) : (
          <span className="text-gray-500">{placeholder}</span>
        )}
      </div>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        {isDropdownOpen ? <FaAngleUp /> : <FaAngleDown />}
      </div>
      {isDropdownOpen && dropdownContent}
    </div>
  );
}
