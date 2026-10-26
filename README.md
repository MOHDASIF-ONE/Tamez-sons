# Tamez & Sons — interactive repair shop

A repair-focused website concept for Tamez & Sons Auto Repair Services in Houston, Texas, with a graphite and copper visual system, frosted-glass navigation and contact panels, a detailed 3D vehicle, and scroll-driven mechanical studies.

## Run locally

Requires Node.js 24.11 or newer and pnpm 12.15.0.

```powershell
pnpm install --frozen-lockfile
pnpm dev --hostname 127.0.0.1
```

Open **http://127.0.0.1:3000/**. Development uses `.next/`. Inside a Windows OneDrive workspace, production builds and `pnpm start` use `.next-production/` so the running preview and production artifacts remain separate. Automatic output cleanup is also disabled there because cloud directory placeholders interfere with Next.js cleanup. Other environments, including Vercel, use the standard `.next/` production output.

For Vercel, use the **Next.js** framework preset, the repository root, `pnpm run build`, and the default `.next` output directory. The separate `apps/api` workspace is not the website's deployment root.

## Motion

- Hover over the vehicle to separate its wheels and brake components. Pointer movement changes the viewing angle; leaving the scene refits the parts.
- The original front bonnet opens on its rear hinge during the same hover and scroll motion, revealing an illustrative front compartment. The front crest, inner panel and telescopic support struts move with the lid. Reduced motion keeps it closed.
- Scrolling also drives the vehicle assembly without a hover or click.
- The dark workshop section stays in view while scrolling through three chapters: a ventilated brake assembly, piston and crankshaft, and coil spring/damper. Each assembly separates and fits together as its chapter progresses.
- Service cards, workshop photography and location cards reveal gently as they enter the viewport. Service and contact information appear before the longer mechanical study.
- There are no playback buttons or assembly sliders. Touch gestures scroll normally over the canvas.
- Reduced-motion preferences keep the vehicle still and show static mechanical studies as the chapters change.
- Scenes draw on demand while interactions settle, then stop rendering. The mechanical canvas loads when its visible area enters the viewport; offscreen rendering stops and pixel ratio is capped. WebGL errors leave contact information and service links available.

The vehicle, decoder, workshop photograph and typeface are hosted locally. The vehicle is the detailed Ferrari 458 Italia model by vicent091036, distributed through the official Three.js examples and adapted with studio materials, dark interior trim and repair assembly motion. Attribution appears on the page and in `public/models/ATTRIBUTION.txt`. The workshop photograph is by Artem Podrez / Pexels; see `public/images/ATTRIBUTION.txt`. It is illustrative photography rather than a photograph of the business. Original procedural brake, piston and suspension illustrations complement the vehicle. These are illustrative assemblies rather than repair instructions or manufacturer CAD.

## Structure

- `src/components/repair/repair-experience.tsx`: page composition, pointer/scroll inputs, chapter content, visibility and reduced-motion preferences.
- `src/components/repair/repair-canvas.tsx`: detailed GLTF vehicle, animated wheel assemblies, camera and studio lighting.
- `src/components/repair/opening-bonnet.ts`: original bonnet geometry separation, hinge, compartment and support struts. `src/data/bonnet-panel.json` identifies the disconnected bonnet faces in the pinned vehicle asset.
- `src/components/repair/mechanical-assemblies.tsx`: brake, piston/crankshaft and suspension geometry and fitting motion.
- `src/components/repair/scroll-reveals.tsx`: lower-page perspective reveals.
- `src/app/repair.css`: responsive 3D hero, mechanical story and transitions.
- `src/app/professional.css`: shared glass surfaces, navigation, service cards, photography and business-page styling.
- `public/models/`: vehicle, HDR, decoder and attribution/license files.
- `public/fonts/`: Space Grotesk and its OFL license.

The previous VEYRA reproduction is unused. Its reference source, media and notices remain preserved, along with `.reference/veyra-adaptation-backup/` and `.reference/original-site/`. ESLint excludes the untouched third-party decoder and archived VEYRA components. The optional legacy verification script checks the archived source/media hashes.

## Verification

```powershell
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e --workers=1
pnpm build
```

Browser checks cover actual GLTF rendering, hover separation and reassembly, scroll-only vehicle motion, all three mechanical chapters, reduced motion, responsive layouts at 1440/768/390/360 pixels, navigation, business links and the local inquiry form. Physical iOS/Safari and touch hardware are not covered by desktop Chromium simulations. The installed React Three Fiber version can emit Three.js's legacy-clock deprecation warning; application motion does not instantiate that API.

## Business content

Phone, address, reported hours and service categories remain editable in `src/data/business.ts` and `src/data/services.ts`. This is an independent website concept. The inquiry form validates locally without transmitting or saving information. The separate NestJS/Prisma API remains intact; no database migration or public deployment is needed for this preview.
