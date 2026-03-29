---
name: Data fetches as late as possible
description: Data fetches should happen in the component closest to where the data is rendered, not hoisted to parent components
type: feedback
---

Fetch data as late as possible — in the component that actually renders it, not in a parent that passes it down as props.

**Why:** Keeps components self-contained, reduces prop threading, and makes it obvious where data comes from. Established when moving `getPicksCount`/`getPicksRecord` into `PicksCounter` and `getGpRiders`/`getViewerPicks` into `Before`, rather than fetching in `GpCard/index.tsx` and passing down.

**How to apply:** When writing or reviewing server components, if a component receives data as props that could be fetched directly inside it, move the fetch into that component. Parent components should pass IDs/keys, not pre-fetched data.
