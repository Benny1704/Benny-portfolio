'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export interface BlobCursorProps {
  blobType?: 'circle' | 'square';
  fillColor?: string;
  trailCount?: number;
  sizes?: number[];
  innerSizes?: number[];
  innerColor?: string;
  opacities?: number[];
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  filterId?: string;
  filterStdDeviation?: number;
  filterColorMatrixValues?: string;
  useFilter?: boolean;
  fastDuration?: number;
  slowDuration?: number;
  fastEase?: string;
  slowEase?: string;
  zIndex?: number;
}

export default function BlobCursor({
  blobType = 'circle',
  fillColor = '#5227FF',
  trailCount = 3,
  sizes = [60, 125, 75],
  innerSizes = [20, 35, 25],
  innerColor = 'rgba(255,255,255,0.8)',
  opacities = [0.6, 0.6, 0.6],
  shadowColor = 'rgba(0,0,0,0.75)',
  shadowBlur = 5,
  shadowOffsetX = 10,
  shadowOffsetY = 10,
  filterId = 'blob',
  filterStdDeviation = 30,
  filterColorMatrixValues = '1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 35 -10',
  useFilter = true,
  fastDuration = 0.1,
  slowDuration = 0.5,
  fastEase = 'power3.out',
  slowEase = 'power1.out',
  zIndex = 100
}: BlobCursorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const blobsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const blobElements = blobsRef.current.slice();
    const movers = blobElements.map((el, i) => {
      if (!el) return null;

      const isLead = i === 0;
      gsap.set(el, {
        x: -9999,
        y: -9999,
        xPercent: -50,
        yPercent: -50
      });

      return {
        x: gsap.quickTo(el, 'x', {
          duration: isLead ? fastDuration : slowDuration,
          ease: isLead ? fastEase : slowEase
        }),
        y: gsap.quickTo(el, 'y', {
          duration: isLead ? fastDuration : slowDuration,
          ease: isLead ? fastEase : slowEase
        })
      };
    });

    const handlePointerMove = (event: PointerEvent) => {
      movers.forEach(mover => {
        if (!mover) return;
        mover.x(event.clientX);
        mover.y(event.clientY);
      });
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      blobElements.forEach(el => {
        if (el) gsap.killTweensOf(el);
      });
    };
  }, [fastDuration, slowDuration, fastEase, slowEase, trailCount]);

  const getTrailValue = <T,>(values: T[], index: number, fallback: T): T =>
    values[index] ?? values[values.length - 1] ?? fallback;

  return (
    <div
      ref={containerRef}
      className="blob-cursor"
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex,
        overflow: 'hidden',
        pointerEvents: 'none'
      }}
    >
      {useFilter && (
        <svg
          aria-hidden="true"
          style={{ position: 'absolute', width: 0, height: 0 }}
        >
          <filter
            id={filterId}
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation={filterStdDeviation} />
            <feColorMatrix in="blur" values={filterColorMatrixValues} />
          </filter>
        </svg>
      )}

      <div
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          userSelect: 'none',
          filter: useFilter ? `url(#${filterId})` : undefined
        }}
      >
        {Array.from({ length: trailCount }).map((_, i) => {
          const size = getTrailValue(sizes, i, 60);
          const innerSize = getTrailValue(innerSizes, i, 20);
          const opacity = getTrailValue(opacities, i, 0.6);

          return (
            <div
              key={i}
              ref={el => {
                blobsRef.current[i] = el;
              }}
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: size,
                height: size,
                borderRadius: blobType === 'circle' ? '50%' : '0',
                backgroundColor: fillColor,
                opacity,
                boxShadow: `${shadowOffsetX}px ${shadowOffsetY}px ${shadowBlur}px 0 ${shadowColor}`,
                willChange: 'transform'
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  width: innerSize,
                  height: innerSize,
                  top: (size - innerSize) / 2,
                  left: (size - innerSize) / 2,
                  backgroundColor: innerColor,
                  borderRadius: blobType === 'circle' ? '50%' : '0'
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
