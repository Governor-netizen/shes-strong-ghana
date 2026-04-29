## Replace Lightning Emoji with Animated Ghana Wave SVG

**Goal:** Replace the ⚡ emoji in the hero stat badge ("About 60% of Ghanaian breast cancer cases are triple-negative...") with the user's custom animated Ghana-shaped wave SVG, sized to match the emoji.

---

### Changes

**1. Create new component: `src/components/GhanaWaveIcon.tsx`**

A small reusable React component containing the provided SVG. It will:
- Accept a `className` prop so size can be controlled via Tailwind (`h-4 w-auto` to match inline emoji size)
- Use a unique gradient/clipPath id (`gradWave`, `ghanaClipWave`) — kept as-is since only one instance is on the page
- Preserve all animations (vertical rise + continuous wave motion)
- Include `aria-hidden="true"` since it's decorative (the badge text already conveys meaning)

**2. Update `src/components/HeroSection.tsx` (line ~62)**

Replace:
```tsx
<span className="mr-2">⚡</span>
```

With:
```tsx
<GhanaWaveIcon className="inline-block h-4 w-auto mr-2 align-text-bottom" aria-hidden="true" />
```

Add the import at the top:
```tsx
import { GhanaWaveIcon } from "@/components/GhanaWaveIcon";
```

---

### Technical Notes

- The badge uses `text-sm` (14px), so `h-4` (16px) keeps the icon visually aligned with the text baseline like the emoji was.
- `align-text-bottom` ensures vertical alignment matches inline text rather than floating above the baseline.
- The SVG's `viewBox="0 0 64 80"` preserves aspect ratio; `w-auto` lets width scale proportionally from the height.
- Animations are pure SVG SMIL — no JS or CSS keyframes needed, works in all modern browsers used by the app's audience.
- Only one instance is rendered, so the hard-coded SVG `id` attributes won't collide.

### Files Modified
- **Created:** `src/components/GhanaWaveIcon.tsx`
- **Edited:** `src/components/HeroSection.tsx`
