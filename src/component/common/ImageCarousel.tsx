import Button from '@/component/common/Button';
import { useState } from 'react';
import { FaRegCircleXmark } from 'react-icons/fa6';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';

interface ImageCarouselProps {
  imageUrls: string[];
  onRemove?: (idx: number) => void;
  editable?: boolean;
}

export default function ImageCarousel({
  imageUrls,
  onRemove,
  editable = false,
}: ImageCarouselProps) {
  const [activeImage, setActiveImage] = useState(0);

  return (
    <div className="relative flex aspect-square w-full flex-row items-center gap-2">
      {activeImage !== 0 && (
        <Button
          variant={'icon'}
          onClick={() => {
            setActiveImage((p) => p - 1);
          }}
          className="absolute left-1 top-1/2 z-20"
        >
          <MdKeyboardArrowLeft />
        </Button>
      )}
      <div className="relative flex flex-1 items-center justify-center bg-black">
        {editable && (
          <Button
            variant={'icon'}
            className="absolute right-0 top-0 -translate-y-1/3 translate-x-1/3 bg-white"
            onClick={() => {
              onRemove && onRemove(activeImage);
            }}
          >
            <FaRegCircleXmark size={16} />
          </Button>
        )}
        <img
          src={imageUrls[activeImage]}
          className="aspect-square w-full object-contain"
        />
      </div>
      {activeImage !== imageUrls.length - 1 && (
        <Button
          variant={'icon'}
          onClick={() => {
            setActiveImage((p) => p + 1);
          }}
          className="absolute right-1 top-1/2 z-20"
        >
          <MdKeyboardArrowRight />
        </Button>
      )}
    </div>
  );
}
