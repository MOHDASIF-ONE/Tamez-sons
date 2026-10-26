"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { LoaderCircle } from "lucide-react";

const BrakeRotorCanvas = dynamic(
  () => import("@/components/brake-rotor-canvas"),
  {
    ssr: false,
    loading: () => <RotorPlaceholder />,
  },
);

function RotorPlaceholder() {
  return (
    <div aria-hidden="true" className="rotor-placeholder">
      <div className="rotor-placeholder-disc">
        <span />
        <i />
        <b />
      </div>
      <span className="rotor-placeholder-caliper" />
    </div>
  );
}

export function BrakeRotorExperience() {
  const stage = useRef<HTMLDivElement>(null);
  const [nearViewport, setNearViewport] = useState(false);

  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: "240px 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="rotor-experience" ref={stage}>
      <div
        className="rotor-stage"
        aria-label="Interactive illustration of a generic brake rotor"
      >
        {nearViewport ? <BrakeRotorCanvas /> : <RotorPlaceholder />}
      </div>
      <p className="rotor-hint">
        <LoaderCircle aria-hidden="true" size={13} /> Drag to rotate the model
      </p>
    </div>
  );
}
