// Rebuild the adaptation from the untouched, pinned release. No media processing.
import { readFile, writeFile, mkdir, cp } from "node:fs/promises";
import postcss from "postcss";

const reference = new URL(
  "../.reference/veyra-interactive-car-1.0.0/",
  import.meta.url,
);
const destination = new URL("../src/components/vehicle/", import.meta.url);
await mkdir(destination, { recursive: true });
await mkdir(new URL("../public/veyra/", import.meta.url), { recursive: true });
await cp(
  new URL("public/media/", reference),
  new URL("../public/media/", import.meta.url),
  { recursive: true },
);
for (const name of ["LICENSE", "THIRD_PARTY_NOTICES.md"]) {
  await cp(
    new URL(name, reference),
    new URL(`../public/veyra/${name}`, import.meta.url),
  );
}
// These three files, especially the decoded-frame hover controller, are byte copies.
for (const name of [
  "HoverVideo.tsx",
  "AppearanceMenu.tsx",
  "appearance.ts",
  "content.ts",
]) {
  await cp(new URL(`src/${name}`, reference), new URL(name, destination));
}
let app = await readFile(new URL("src/App.tsx", reference), "utf8");
app = '"use client";\n\n' + app;
app = app.replace(
  "import { systems,",
  "import { SceneNavigation } from './scene-navigation'\nimport { systems,",
);
app = app.replace(
  "export default function App()",
  "export default function VehicleExperience()",
);
// React 19 requires an explicit initial value for timer refs.
app = app.replaceAll(
  "useRef<number>()",
  "useRef<number | undefined>(undefined)",
);
// React 19 can commit after a zero-delay timer. Restore detail focus after commit.
// The release's separately documented appearance-close focus race stays unchanged.
app = app.replace(
  "  const current = systems[selected]",
  "  const pendingDetailFocus = useRef<SystemId | null>(null)\n  const current = systems[selected]",
);
app = app.replace(
  "    setPhase(returning ? 'overview' : 'detail')",
  "    pendingDetailFocus.current = id\n    setPhase(returning ? 'overview' : 'detail')",
);
app = app.replace(
  "    setTimeout(() => returning ? entryButtons.current[id]?.focus({ preventScroll: true }) : closeButton.current?.focus({ preventScroll: true }), 0)",
  "",
);
app = app.replace(
  "  function transition(id: SystemId, returning = false)",
  `  useEffect(() => {
    const id = pendingDetailFocus.current
    if (!id || (phase !== 'overview' && phase !== 'detail')) return
    pendingDetailFocus.current = null
    if (phase === 'overview') entryButtons.current[id]?.focus({ preventScroll: true })
    else closeButton.current?.focus({ preventScroll: true })
  }, [phase])

  function transition(id: SystemId, returning = false)`,
);
app = app.replace(
  "return <main className={`experience",
  'return <section aria-label="Interactive vehicle illustration" className={`veyra-scene experience',
);
app = app.replace("  </main>", "  </section>");
const headerStart = app.indexOf('    <header className="masthead">');
const headerEnd =
  app.indexOf("    </header>", headerStart) + "    </header>".length;
app =
  app.slice(0, headerStart) + "    <SceneNavigation />" + app.slice(headerEnd);
app = app.replace(
  "<h1>Electric, inside out.</h1>",
  "<h1>Care, inside out.</h1>",
);
app = app.replace(
  "<h3>Electric drive</h3><p>Lift the hood. Explore how the motor turns electricity into motion.</p>",
  "<h3>Under the hood</h3><p>Lift the hood. Take a closer look at the electric drive illustration.</p>",
);
app = app.replace(
  "<h3>Battery architecture</h3><p>Look beneath the body. Discover the energy stored under the cabin.</p>",
  "<h3>Beneath the surface</h3><p>Reveal the battery. Explore the details you don’t usually see.</p>",
);
app = app.replace(
  "<h3>Body finishes</h3><p>Five colours. From studio silver to a vivid electric green.</p>",
  "<h3>A different finish</h3><p>Five colours. See the same vehicle in a different light.</p>",
);
app = app.replace(
  "<h3>Wheel designs</h3><p>Three expressions. Compare multi-spoke, aero and forged wheels.</p>",
  "<h3>The finer details</h3><p>Three wheel designs. A new perspective on every detail.</p>",
);
app = app.replace(
  "VEYRA — Design study",
  "Houston, Texas · Independent concept",
);
app = app.replace(
  "Explore systems. Personalise the exterior.",
  "Vehicle illustration · Explore below ↓",
);
await writeFile(new URL("vehicle-experience.tsx", destination), app);

// Keep every reference layout declaration, scoped away from the business pages.
const css = postcss.parse(
  await readFile(new URL("src/index.css", reference), "utf8"),
);
css.walkAtRules((rule) => {
  if (rule.name === "tailwind" || rule.name === "import") rule.remove();
});
css.walkRules((rule) => {
  if (rule.parent.type === "atrule" && /keyframes$/.test(rule.parent.name))
    return;
  rule.selectors = rule.selectors.map((selector) => {
    if (selector === ":root" || selector === "body") return ".veyra-scene";
    if (/^\.(experience|phase-|reduced)/.test(selector))
      return `.veyra-scene${selector}`;
    return `.veyra-scene ${selector}`;
  });
});
await writeFile(
  new URL("../src/app/veyra-reference.css", import.meta.url),
  "/* VEYRA v1.0.0 / Amir Mušić / MIT. Layout scoped for the Next.js adaptation. */\n" +
    css.toString(),
);
console.log(
  "Copied 18 unchanged media files, the original playback controller, and scoped reference layout.",
);

// Copy approved digests from the release; never derive a new baseline from the adaptation.
const baseline = JSON.parse(
  await readFile(new URL("reference-manifest.json", reference), "utf8"),
);
const unchangedSource = [
  "HoverVideo.tsx",
  "AppearanceMenu.tsx",
  "appearance.ts",
  "content.ts",
];
const files = baseline.files
  .filter(
    (entry) =>
      entry.path.startsWith("public/media/") ||
      unchangedSource.some((name) => entry.path === `src/${name}`),
  )
  .map((entry) => ({
    ...entry,
    localPath: entry.path.startsWith("public/")
      ? entry.path
      : entry.path.replace("src/", "src/components/vehicle/"),
  }));
await writeFile(
  new URL("veyra-manifest.json", import.meta.url),
  JSON.stringify(
    {
      release: baseline.release,
      source:
        "https://github.com/amirmushichge/veyra-interactive-car/tree/v1.0.0",
      files,
    },
    null,
    2,
  ) + "\n",
);
