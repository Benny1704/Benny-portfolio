import React, {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
  type RefObject,
  useEffect,
  useMemo,
  useRef
} from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface CardSwapProps {
  width?: number | string;
  height?: number | string;
  cardDistance?: number;
  verticalDistance?: number;
  delay?: number;
  pauseOnHover?: boolean;
  onCardClick?: (idx: number) => void;
  onActiveIndexChange?: (idx: number) => void;
  scrollDriven?: boolean;
  scrollTrigger?: Element | string | null;
  scrollPin?: boolean | Element | string;
  scrollStart?: string;
  scrollEnd?: string;
  className?: string;
  style?: CSSProperties;
  skewAmount?: number;
  easing?: 'linear' | 'elastic';
  children: ReactNode;
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  customClass?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({ customClass, ...rest }, ref) => (
  <div
    ref={ref}
    {...rest}
    className={`card-swap-card ${customClass ?? ''} ${rest.className ?? ''}`.trim()}
  />
));
Card.displayName = 'Card';

type CardRef = RefObject<HTMLDivElement | null>;
interface Slot {
  x: number;
  y: number;
  z: number;
  zIndex: number;
}

const makeSlot = (i: number, distX: number, distY: number, total: number): Slot => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 1.5,
  zIndex: total - i
});

const makeOrder = (frontIndex: number, total: number) =>
  Array.from({ length: total }, (_, i) => (frontIndex + i) % total);

const placeNow = (el: HTMLElement, slot: Slot, skew: number) =>
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: 'center center',
    zIndex: slot.zIndex,
    force3D: true
  });

const CardSwap: React.FC<CardSwapProps> = ({
  width = 500,
  height = 400,
  cardDistance = 60,
  verticalDistance = 70,
  delay = 5000,
  pauseOnHover = false,
  onCardClick,
  onActiveIndexChange,
  scrollDriven = false,
  scrollTrigger = null,
  scrollPin = false,
  scrollStart = 'top center',
  scrollEnd = 'bottom center',
  className,
  style,
  skewAmount = 6,
  easing = 'elastic',
  children
}) => {
  const config = useMemo(
    () =>
      easing === 'elastic'
        ? {
            ease: 'elastic.out(0.6,0.9)',
            durDrop: 2,
            durMove: 2,
            durReturn: 2,
            promoteOverlap: 0.9,
            returnDelay: 0.05
          }
        : {
            ease: 'power3.out',
            durDrop: 0.8,
            durMove: 0.8,
            durReturn: 0.8,
            promoteOverlap: 0.45,
            returnDelay: 0.2
          },
    [easing]
  );

  const childArr = useMemo(() => Children.toArray(children) as ReactElement<CardProps>[], [children]);
  const childCount = childArr.length;
  const refs = useMemo<CardRef[]>(
    () => Array.from({ length: childCount }, () => React.createRef<HTMLDivElement>()),
    [childCount]
  );

  const order = useRef<number[]>(Array.from({ length: childCount }, (_, i) => i));

  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const intervalRef = useRef<number>(0);
  const activeIndexRef = useRef(0);
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const total = refs.length;
    const elements = refs
      .map(ref => ref.current)
      .filter((element): element is HTMLDivElement => Boolean(element));

    if (!total || elements.length !== total) return;

    refs.forEach((r, i) => placeNow(r.current!, makeSlot(i, cardDistance, verticalDistance, total), skewAmount));
    order.current = makeOrder(activeIndexRef.current, total);

    const moveToFront = (frontIndex: number, immediate = false) => {
      const nextOrder = makeOrder(frontIndex, total);
      order.current = nextOrder;
      activeIndexRef.current = frontIndex;
      tlRef.current?.kill();

      nextOrder.forEach((idx, i) => {
        const el = refs[idx].current;
        if (!el) return;
        const slot = makeSlot(i, cardDistance, verticalDistance, total);

        if (immediate) {
          placeNow(el, slot, skewAmount);
          return;
        }

        gsap.to(el, {
          x: slot.x,
          y: slot.y,
          z: slot.z,
          xPercent: -50,
          yPercent: -50,
          skewY: skewAmount,
          zIndex: slot.zIndex,
          duration: 0.9,
          ease: 'expo.out',
          overwrite: 'auto',
          force3D: true
        });
      });
    };

    const setActiveIndex = (idx: number, immediate = false) => {
      const clamped = Math.max(0, Math.min(total - 1, idx));
      if (!immediate && clamped === activeIndexRef.current) return;

      moveToFront(clamped, immediate);
      onActiveIndexChange?.(clamped);
    };

    if (scrollDriven) {
      setActiveIndex(0, true);

      const triggerElement =
        typeof scrollTrigger === 'string'
          ? document.querySelector(scrollTrigger)
          : scrollTrigger ?? container.current?.parentElement ?? container.current;
      const pinElement =
        typeof scrollPin === 'string'
          ? document.querySelector(scrollPin)
          : scrollPin;

      const trigger = ScrollTrigger.create({
        trigger: triggerElement,
        pin: pinElement || scrollPin,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        start: scrollStart,
        end: scrollEnd,
        onUpdate: self => {
          const idx = Math.min(total - 1, Math.floor(self.progress * total));
          setActiveIndex(idx);
        },
        onLeave: () => setActiveIndex(total - 1),
        onLeaveBack: () => setActiveIndex(0)
      });

      return () => {
        trigger.kill();
        tlRef.current?.kill();
        gsap.killTweensOf(elements);
      };
    }

    const swap = () => {
      if (order.current.length < 2) return;

      const [front, ...rest] = order.current;
      const elFront = refs[front].current!;
      const tl = gsap.timeline();
      tlRef.current = tl;

      tl.to(elFront, {
        y: '+=500',
        duration: config.durDrop,
        ease: config.ease
      });

      tl.addLabel('promote', `-=${config.durDrop * config.promoteOverlap}`);
      rest.forEach((idx, i) => {
        const el = refs[idx].current!;
        const slot = makeSlot(i, cardDistance, verticalDistance, refs.length);
        tl.set(el, { zIndex: slot.zIndex }, 'promote');
        tl.to(
          el,
          {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            duration: config.durMove,
            ease: config.ease
          },
          `promote+=${i * 0.15}`
        );
      });

      const backSlot = makeSlot(refs.length - 1, cardDistance, verticalDistance, refs.length);
      tl.addLabel('return', `promote+=${config.durMove * config.returnDelay}`);
      tl.call(
        () => {
          gsap.set(elFront, { zIndex: backSlot.zIndex });
        },
        undefined,
        'return'
      );
      tl.to(
        elFront,
        {
          x: backSlot.x,
          y: backSlot.y,
          z: backSlot.z,
          duration: config.durReturn,
          ease: config.ease
        },
        'return'
      );

      tl.call(() => {
        order.current = [...rest, front];
      });
    };

    swap();
    intervalRef.current = window.setInterval(swap, delay);

    if (pauseOnHover) {
      const node = container.current!;
      const pause = () => {
        tlRef.current?.pause();
        clearInterval(intervalRef.current);
      };
      const resume = () => {
        tlRef.current?.play();
        intervalRef.current = window.setInterval(swap, delay);
      };
      node.addEventListener('mouseenter', pause);
      node.addEventListener('mouseleave', resume);
      return () => {
        node.removeEventListener('mouseenter', pause);
        node.removeEventListener('mouseleave', resume);
        clearInterval(intervalRef.current);
        tlRef.current?.kill();
        gsap.killTweensOf(elements);
      };
    }
    return () => {
      clearInterval(intervalRef.current);
      tlRef.current?.kill();
      gsap.killTweensOf(elements);
    };
  }, [
    refs,
    cardDistance,
    verticalDistance,
    delay,
    pauseOnHover,
    skewAmount,
    scrollDriven,
    scrollTrigger,
    scrollPin,
    scrollStart,
    scrollEnd,
    onActiveIndexChange,
    config
  ]);

  const rendered = childArr.map((child, i) =>
    isValidElement<CardProps>(child)
      ? cloneElement(child, {
          key: i,
          ref: refs[i],
          style: { width, height, ...(child.props.style ?? {}) },
          onClick: e => {
            child.props.onClick?.(e as React.MouseEvent<HTMLDivElement>);
            onCardClick?.(i);
          }
        } as CardProps & React.RefAttributes<HTMLDivElement>)
      : child
  );

  return (
    <div
      ref={container}
      className={`card-swap-container ${className ?? ''}`.trim()}
      style={{ width, height, ...style }}
    >
      {rendered}
    </div>
  );
};

export default CardSwap;
