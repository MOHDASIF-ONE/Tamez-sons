"use client";
import { useEffect } from "react";

export default function ScrollReveals() {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(
      ".home-service-card, .workshop-image, .workshop-copy, .visit-card, .contact-band .site-container",
    );
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.12 },
    );
    elements.forEach((element, index) => {
      element.classList.add("motion-reveal");
      element.style.transitionDelay = `${(index % 3) * 70}ms`;
      observer.observe(element);
    });
    return () => {
      observer.disconnect();
      elements.forEach((element) => {
        element.classList.remove("motion-reveal", "is-visible");
        element.style.transitionDelay = "";
      });
    };
  }, []);
  return null;
}
