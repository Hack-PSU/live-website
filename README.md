# HackPSU Live

The day-of companion site for HackPSU. It answers the questions hackers actually
ask during the event: what's happening right now, what's next, where is it, how
much time is left, and where's my pass.

Built from the [`HackPSU Live v3` design](https://claude.ai/design/p/d00d863a-f02c-4431-8106-39e2aeecd004),
and deliberately structured to mirror [`Hack-PSU/frontend-template`](https://github.com/Hack-PSU/frontend-template)
so the two repos stay easy to move between.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS 3** for styling, with the HackPSU Live palette as theme tokens
- **TanStack Query** for server state
- **Firebase Auth** against the central HackPSU auth server
- **Luxon** for time math (everything is pinned to `America/New_York`)
- **Yarn 1** for package management

## Routes

| Route | What it is | Auth |
| --- | --- | --- |
| `/` | Dashboard — ON NOW, up next, mission clock, announcements | public |
| `/schedule` | Full schedule with day tabs and category filters | public |
| `/map` | ECoRE floor map and key spots | public |
| `/help` | FAQ | public |
| `/pass` | Hacker pass: QR, status, team, wallet passes | **required** |

The header also links out to [QStack](https://qstack.hackpsu.org), HackPSU's
mentor and help queue.

## Architecture

**API layer.** `src/lib/api/` is copied from `frontend-template` and follows the
same per-domain shape — `entity.ts` (types), `provider.ts` (thin `apiFetch`
wrappers), `hook.ts` (TanStack Query hooks), `index.ts` (re-exports). Everything
goes through `src/lib/api/apiClient.ts`, which attaches the Firebase ID token
and handles JSON/blob responses. Keep this directory diffable against the
template; app-specific logic belongs in `src/lib/events.ts` or a hook.

**Auth.** A session cookie lives on `auth.hackpsu.org`. `FirebaseProvider` trades
it for a custom token via `GET /api/sessionUser`, then signs into Firebase.
`AuthGuard` (used only by the `(protected)` route group) redirects to the auth
server when there's no session.

**Time.** `useLiveClock()` is a single shared 1s ticker built on
`useSyncExternalStore`. It returns `null` on the server and through hydration so
a server-rendered timestamp can never disagree with the client — every consumer
renders a placeholder while it's null. `useEventPhase()` turns the active
hackathon's window into the `before` / `during` / `after` countdown state.

**Data.** `useLiveSchedule()` wraps `GET /hackathons/active/static`, which
returns the hackathon window and its events in one request. Until it resolves,
dates fall back to `src/lib/config/settings.json`.

## Getting started

Requires Node 18+ and Yarn 1.

```bash
yarn install
cp .env.local.example .env.local   # then fill it in
yarn dev
```

`.env.local` needs the seven `NEXT_PUBLIC_FIREBASE_*` values, plus
`NEXT_PUBLIC_BASE_URL_V3` (apiv3) and optionally `NEXT_PUBLIC_AUTH_SERVICE_URL`
(defaults to `https://auth.hackpsu.org`).

## Scripts

| Script | Does |
| --- | --- |
| `yarn dev` | Dev server on :3000 |
| `yarn build` | Production build |
| `yarn start` | Serve the production build |
| `yarn lint` | ESLint (flat config — `next lint` was removed in Next 16) |
| `yarn format` | Prettier over the repo |
| `yarn knip` | Unused files, exports, and dependencies |

## Event-day content

Things organizers will want to edit, in one place each:

- `src/lib/config/settings.json` — dates, venue, Wi-Fi, outbound links
- `src/components/live/FaqList.tsx` — the `/help` questions
- `src/components/live/FloorMap.tsx` — floors and key-spot pins
- `src/lib/api/announcement/provider.ts` — the announcements feed

## Known gaps

These are wired on the frontend and waiting on backend or asset work. Each is
marked with a `TODO` at the relevant file.

- **Announcements have no API.** apiv3's `notification` module is push-only
  (`POST /notifications/send`, `/broadcast`) and nothing persists a readable
  feed, so `src/lib/api/announcement/provider.ts` returns mock data. When a
  `GET /announcements` lands, that one file is the only thing that changes.
- **No `ceremony` event type.** apiv3's `EventType` is
  `activity | food | workshop | checkIn`, but the design treats ceremonies as
  their own category. `src/lib/events.ts` recognizes them by name as a stopgap.
- **No "my team" lookup.** `GET /teams/:id` needs a team id and users carry no
  `teamId`, so `src/lib/hooks/use-my-team.ts` scans the team list.
- **Floor plans are placeholders.** Drop real ECoRE SVGs into
  `public/floors/` and render them in `FloorMap.tsx`.
- **Check-in time and meal counts** aren't on the pass — the data is in scans,
  but there's no per-user rollup endpoint.
- **Mentor queue counts** are static; QStack exposes no public read endpoint.
