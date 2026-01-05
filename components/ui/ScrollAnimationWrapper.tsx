'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollAnimationWrapperProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

/* eslint-disable max-lines-per-function */
export const ScrollAnimationWrapper = ({
  children,
  className,
  id,
}: ScrollAnimationWrapperProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // 1. Block Animation: Bottom to Top (y: 100 -> 0)
      gsap.fromTo(
        containerRef.current,
        {
          y: 100,
          autoAlpha: 0, // Handles visibility:hidden + opacity:0
        },
        {
          y: 0,
          autoAlpha: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%', // Trigger when top of element hits 85% of viewport height
            toggleActions: 'play none none reverse', // Play on enter, reverse on leave back up
          },
        },
      );

      // 2. Internal Header Animation: Left to Right (x: -50 -> 0)
      // Target h4, h1, and specific headers inside
      const headers = gsap.utils.toArray(
        'h1, h4, p, a, img, th, td, button, .chart-header, .header, .info, .button-group, .flex-1, .price-change, .header-animate',
      );

      if (headers.length > 0) {
        gsap.fromTo(
          headers,
          {
            x: -50,
            autoAlpha: 0,
          },
          {
            x: 0,
            autoAlpha: 1,
            duration: 0.8,
            stagger: 0.05, // Stagger if multiple headers found
            delay: 0.2, // Wait for container to start appearing
            ease: 'power3.out',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 85%',
            },
          },
        );
      }
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef} className={className} id={id}>
      {children}
    </div>
  );
};
