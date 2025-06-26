'use client';

import React, { useEffect, useRef, useState } from 'react';

import * as Collapsible from '@radix-ui/react-collapsible';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../ui/button';

interface ShowMoreTextProps {
  text: string;
  initialLines?: number;
}

const ShowMoreText: React.FC<ShowMoreTextProps> = ({ text, initialLines = 3 }) => {
  const [open, setOpen] = useState(false);
  const [shouldShowButton, setShouldShowButton] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    const el = contentRef.current;
    const lineHeight = parseFloat(getComputedStyle(el).lineHeight || '20');
    const maxHeight = lineHeight * initialLines;

    setShouldShowButton(el.scrollHeight > maxHeight + 1);
  }, [text, initialLines]);

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen} className="relative w-full">
      <div className="relative">
        <Collapsible.Content
          forceMount
          className={`relative transition-max-height duration-300 ease-in-out overflow-hidden ${
            open ? 'max-h-[1000px]' : `line-clamp-${initialLines}`
          }`}
        >
          <div
            ref={contentRef}
            className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: text }}
          />

          {/* Gradient overlay on text (only when collapsed) */}
          {!open && shouldShowButton && (
            <>
              {/* Light mode gradient */}
              <div
                className="absolute bottom-0 left-0 w-full h-8 pointer-events-none dark:hidden"
                style={{
                  backgroundImage: `linear-gradient(to top, white, transparent)`,
                }}
              />

              {/* Dark mode gradient */}
              <div
                className="absolute bottom-0 left-0 w-full h-8 pointer-events-none hidden dark:block"
                style={{
                  backgroundImage: `linear-gradient(to top, #0f0f0f, transparent)`,
                }}
              />
            </>
          )}
        </Collapsible.Content>
      </div>

      {shouldShowButton && (
        <Collapsible.Trigger asChild>
          <Button variant="ghost" size="sm" className="mt-2 px-0 text-primary">
            {open ? (
              <>
                Thu gọn <ChevronUp className="ml-1 h-4 w-4" />
              </>
            ) : (
              <>
                Xem thêm <ChevronDown className="ml-1 h-4 w-4" />
              </>
            )}
          </Button>
        </Collapsible.Trigger>
      )}
    </Collapsible.Root>
  );
};

export default ShowMoreText;
