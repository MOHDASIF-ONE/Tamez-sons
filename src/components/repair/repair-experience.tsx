"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import {
  Component,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
  type PointerEvent,
} from "react";
import {
  ArrowDown,
  ArrowUpRight,
  Disc3,
  MapPin,
  Phone,
  Wrench,
} from "lucide-react";
import { business } from "@/data/business";

const RepairCanvas = dynamic(() => import("./repair-canvas"), {
  ssr: false,
  loading: () => <ScenePlaceholder />,
});
const motionQuery = "(prefers-reduced-motion: reduce)";
function subscribe(update: () => void) {
  const query = window.matchMedia(motionQuery);
  query.addEventListener("change", update);
  return () => query.removeEventListener("change", update);
}
const snapshot = () => window.matchMedia(motionQuery).matches;
const serverSnapshot = () => false;
export type SceneInput = {
  scroll: number;
  hover: number;
  x: number;
  y: number;
};

function ScenePlaceholder() {
  return (
    <div className="repair-loading">
      <Wrench size={25} />
      <span>Opening the workshop…</span>
    </div>
  );
}
class SceneBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <div className="repair-loading">
        <Wrench size={30} />
        <p>
          Every detail matters.
          <br />
          Call us about your vehicle.
        </p>
      </div>
    ) : (
      this.props.children
    );
  }
}

const chapters = [
  {
    number: "01",
    label: "Brake systems",
    title: (
      <>
        Confidence.
        <br />
        <em>At every stop.</em>
      </>
    ),
    description:
      "Behind every wheel, a system working together. The rotor, pads and caliper each play a part in how your vehicle stops.",
    detail:
      "A noise. A vibration. A change in pedal feel. Tell us what you’ve noticed.",
    link: "brake-repair",
    parts: ["Ventilated rotor", "Caliper & pads", "Wheel hub"],
  },
  {
    number: "02",
    label: "Engine & maintenance",
    title: (
      <>
        Small details.
        <br />
        <em>Moving you.</em>
      </>
    ),
    description:
      "Thousands of movements. One connected system. A closer look at the moving parts helps make sense of what’s happening inside.",
    detail:
      "A warning light or a rough idle? Start with a conversation about your engine.",
    link: "engine-diagnostics",
    parts: ["Piston & rings", "Connecting rod", "Crankshaft"],
  },
  {
    number: "03",
    label: "Suspension & steering",
    title: (
      <>
        Connected.
        <br />
        <em>To the road.</em>
      </>
    ),
    description:
      "Springs absorb movement. Dampers control it. Together, these components help keep your vehicle settled over a changing road.",
    detail:
      "Pulling, vibration or a different feel over bumps? Share the symptoms with the shop.",
    link: "suspension-steering",
    parts: ["Coil spring", "Damper", "Upper mount"],
  },
];

function useScene(kind: "vehicle" | "mechanical") {
  const reduced = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const root = useRef<HTMLElement>(null);
  const input = useRef<SceneInput>({ scroll: 0, hover: 0, x: 0, y: 0 });
  const [visible, setVisible] = useState(kind === "vehicle");
  const [loaded, setLoaded] = useState(kind === "vehicle");
  const [chapter, setChapter] = useState(0);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const rect = element.getBoundingClientRect();
      const distance =
        kind === "vehicle"
          ? rect.height * 0.85
          : rect.height - window.innerHeight;
      const progress = Math.max(
        0,
        Math.min(1, -rect.top / Math.max(1, distance)),
      );
      input.current.scroll = progress;
      if (kind === "mechanical") {
        element.style.setProperty("--story-progress", String(progress));
        setChapter(Math.min(2, Math.floor(progress * 3)));
      }
    };
    const update = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    const target = element.querySelector(".mechanical-visual") ?? element;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const active = entry.isIntersecting && entry.intersectionRatio >= 0.05;
        setVisible(active);
        if (active) setLoaded(true);
      },
      { threshold: 0.05 },
    );
    observer.observe(target);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    measure();
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [kind]);
  const move = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === "touch") return;
    const rect = event.currentTarget.getBoundingClientRect();
    input.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    input.current.y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
    input.current.hover = 1;
  };
  const leave = () => {
    input.current.x = 0;
    input.current.y = 0;
    input.current.hover = 0;
  };
  return { root, input, visible, loaded, chapter, reduced, move, leave };
}

export default function RepairExperience() {
  const {
    root: hero,
    input: heroInput,
    visible: heroVisible,
    reduced,
    move,
    leave,
  } = useScene("vehicle");
  return (
    <section
      ref={hero}
      className="repair-experience"
      aria-label="Auto repair in Houston"
    >
      <div className="hero-ambient" aria-hidden="true" />
      <div className="repair-hero site-container">
        <div className="repair-hero-copy">
          <p className="repair-eyebrow">
            <span className="status-dot" /> Houston, Texas · Tamez & Sons
          </p>
          <h1>
            Auto care.
            <br />
            <span>
              Down to
              <br className="hero-title-break" /> the detail.
            </span>
          </h1>
          <p className="repair-hero-description">
            The sound you can’t place. The maintenance on your mind. Let’s talk
            about what your vehicle needs to keep moving.
          </p>
          <div className="hero-actions">
            <a
              className="button button-acid repair-hero-call"
              href={business.phoneHref}
            >
              Let’s talk repairs <ArrowUpRight size={18} aria-hidden="true" />
            </a>
            <a className="button hero-service-button" href="#services">
              Explore services <ArrowDown size={16} aria-hidden="true" />
            </a>
          </div>
          <div className="hero-local-note">
            <MapPin size={15} aria-hidden="true" />
            <span>Local auto repair. Right here in Houston.</span>
          </div>
        </div>
        <div className="repair-bay" onPointerMove={move} onPointerLeave={leave}>
          <div className="repair-bay-top">
            <span className="glass-label">
              <Wrench size={14} /> A closer look at what moves you
            </span>
          </div>
          <div
            className="repair-canvas"
            data-motion={reduced ? "reduced" : "full"}
            role="img"
            aria-label="Detailed 3D vehicle with an illustrative engine repair cutaway. Hover or scroll to open the bonnet, reveal six pistons, cylinder heads, intake pipes, radiator and belts, and separate its wheel assemblies. The parts fit back together when you move away."
          >
            <SceneBoundary>
              <RepairCanvas
                mode="vehicle"
                input={heroInput}
                reduced={reduced}
                visible={heroVisible}
              />
            </SceneBoundary>
          </div>
          <div className="repair-bay-caption glass-surface">
            <span className="cursor-orbit">
              <Disc3 size={22} />
            </span>
            <div>
              <strong>Inside the engine.</strong>
              <span>Hover or scroll to explore the repair cutaway.</span>
            </div>
            <ArrowUpRight size={19} />
          </div>
          <div className="hero-stage-index" aria-hidden="true">
            <span>01</span> THE DETAILS MATTER
          </div>
        </div>
      </div>
      <div className="hero-quickbar site-container glass-surface">
        <a href={business.phoneHref}>
          <span className="quickbar-icon">
            <Phone size={19} />
          </span>
          <div>
            <span>Let’s talk about your car</span>
            <strong>{business.phone}</strong>
          </div>
          <ArrowUpRight size={18} />
        </a>
        <a href={business.directionsHref} target="_blank" rel="noreferrer">
          <span className="quickbar-icon">
            <MapPin size={19} />
          </span>
          <div>
            <span>Find us in Houston</span>
            <strong>1605 S Sgt Macario Garcia Dr</strong>
          </div>
          <ArrowUpRight size={18} />
        </a>
        <a href="#inside-the-repair">
          <span className="quickbar-icon">
            <Disc3 size={20} />
          </span>
          <div>
            <span>Behind every repair</span>
            <strong>See how it fits together</strong>
          </div>
          <ArrowDown size={17} />
        </a>
      </div>
      <div className="hero-bottomline site-container">
        <span>Automotive repair & maintenance</span>
        <span>Care starts with understanding.</span>
      </div>
    </section>
  );
}

export function MechanicalStory() {
  const {
    root: story,
    input: storyInput,
    visible: storyVisible,
    loaded: storyLoaded,
    chapter,
    reduced,
    move,
    leave,
  } = useScene("mechanical");
  return (
    <>
      <section
        className="mechanical-story"
        id="inside-the-repair"
        ref={story}
        data-chapter={chapter}
        data-motion={reduced ? "reduced" : "full"}
        aria-label="Inside the repair: a scrolling mechanical study"
      >
        <div className="mechanical-sticky">
          <div className="mechanical-topline site-container">
            <span>
              <i /> Beneath the surface
            </span>
            <span>Scroll to explore / 01—03</span>
          </div>
          <div className="mechanical-layout site-container">
            <div
              className="mechanical-visual"
              onPointerMove={move}
              onPointerLeave={leave}
            >
              <span className="mechanical-watermark" aria-hidden="true">
                {chapters[chapter].number}
              </span>
              {storyLoaded && (
                <SceneBoundary>
                  <RepairCanvas
                    mode="mechanical"
                    input={storyInput}
                    reduced={reduced}
                    visible={storyVisible}
                  />
                </SceneBoundary>
              )}
              <div className="mechanical-part-list">
                {chapters[chapter].parts.map((part, i) => (
                  <span key={part}>
                    <i>0{i + 1}</i>
                    {part}
                  </span>
                ))}
              </div>
            </div>
            <div className="mechanical-copy">
              {chapters.map((item, index) => (
                <article
                  key={item.number}
                  className={chapter === index ? "active" : ""}
                  aria-hidden={chapter !== index}
                >
                  <p className="mechanical-chapter-label">
                    {item.number} / {item.label}
                  </p>
                  <h2>{item.title}</h2>
                  <p className="mechanical-description">{item.description}</p>
                  <p className="mechanical-detail">{item.detail}</p>
                  <Link
                    className="mechanical-service-link"
                    href={`/services#${item.link}`}
                    tabIndex={chapter === index ? 0 : -1}
                  >
                    Talk about this service <ArrowUpRight size={16} />
                  </Link>
                </article>
              ))}
            </div>
          </div>
          <div className="mechanical-bottom site-container">
            <div className="mechanical-chapters">
              {chapters.map((item, index) => (
                <span
                  key={item.number}
                  className={chapter === index ? "active" : ""}
                >
                  <i>{item.number}</i>
                  {item.label}
                </span>
              ))}
            </div>
            <div className="mechanical-progress">
              <span />
            </div>
            <p>
              Illustrative assemblies · Your vehicle’s components may differ.
            </p>
          </div>
        </div>
      </section>
      <div className="repair-model-credit site-container">
        Vehicle study:{" "}
        <a
          href="https://sketchfab.com/models/57bf6cc56931426e87494f554df1dab6"
          target="_blank"
          rel="noreferrer"
        >
          Ferrari 458 Italia by vicent091036
        </a>{" "}
        ·{" "}
        <a
          href="https://creativecommons.org/licenses/by/4.0/"
          target="_blank"
          rel="noreferrer"
        >
          CC BY 4.0
        </a>{" "}
        · Adapted materials and assembly motion. Illustrative engine cutaway.
      </div>
    </>
  );
}
