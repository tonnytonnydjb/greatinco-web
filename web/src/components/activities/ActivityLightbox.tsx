"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type TouchEvent,
} from "react";

import type { CmsImage } from "@/types/cms";

type Props = {
  images: CmsImage[];
  trigger: (open: (index?: number) => void) => ReactNode;
};

export function ActivityLightbox({ images, trigger }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const touchStart = useRef<number | null>(null);
  const touchEnd = useRef<number | null>(null);

  const open = useCallback(
    (nextIndex = 0) => {
      if (!images.length) return;

      setIndex(
        Math.max(0, Math.min(nextIndex, images.length - 1)),
      );
      setIsOpen(true);
    },
    [images.length],
  );

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const previous = useCallback(() => {
    setIndex((current) =>
      current === 0 ? images.length - 1 : current - 1,
    );
  }, [images.length]);

  const next = useCallback(() => {
    setIndex((current) =>
      current === images.length - 1 ? 0 : current + 1,
    );
  }, [images.length]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close();

      if (images.length > 1 && event.key === "ArrowLeft") {
        previous();
      }

      if (images.length > 1 && event.key === "ArrowRight") {
        next();
      }
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [close, images.length, isOpen, next, previous]);

  function onTouchStart(event: TouchEvent) {
    touchStart.current =
      event.targetTouches[0]?.clientX ?? null;
    touchEnd.current = null;
  }

  function onTouchMove(event: TouchEvent) {
    touchEnd.current =
      event.targetTouches[0]?.clientX ?? null;
  }

  function onTouchEnd() {
    if (
      touchStart.current === null ||
      touchEnd.current === null ||
      images.length <= 1
    ) {
      return;
    }

    const distance =
      touchStart.current - touchEnd.current;

    if (distance > 50) next();
    if (distance < -50) previous();

    touchStart.current = null;
    touchEnd.current = null;
  }

  const activeImage = images[index];

  return (
    <>
      {trigger(open)}

      {isOpen && activeImage && (
        <div
          className="activity-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Activity gallery"
          onClick={close}
        >
          <button
            type="button"
            className="activity-lightbox-close"
            aria-label="Close gallery"
            onClick={close}
          >
            ×
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                className="activity-lightbox-nav activity-lightbox-prev"
                aria-label="Previous image"
                onClick={(event) => {
                  event.stopPropagation();
                  previous();
                }}
              >
                ‹
              </button>

              <button
                type="button"
                className="activity-lightbox-nav activity-lightbox-next"
                aria-label="Next image"
                onClick={(event) => {
                  event.stopPropagation();
                  next();
                }}
              >
                ›
              </button>
            </>
          )}

          <div
            className="activity-lightbox-content"
            onClick={(event) => event.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div className="activity-lightbox-image">
              <Image
                src={activeImage.src}
                alt={activeImage.alt}
                fill
                priority
                sizes="100vw"
              />
            </div>

            <div className="activity-lightbox-footer">
              <span>{activeImage.alt}</span>

              <span>
                {index + 1} / {images.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
