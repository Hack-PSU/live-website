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
| `/` | Dashboard — ON NOW, up next, mission clock, announcements, sponsors | public |
| `/schedule` | Full schedule with day tabs and category filters | public |
| `/map` | ECoRE floor map and key spots | public |
| `/help` | FAQ | public |
| `/pass` | Hacker pass: QR, status, team, wallet passes | **required** |
| `/api/announcements` | JSON proxy of the Discord announcements channel (temporary) | public |

The header's **Get help** link goes to the HackPSU Discord.

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
returns the hackathon window, its events, and its sponsors in one request, and
refetches every minute so schedule edits land without a reload. Until it
resolves, dates fall back to `src/lib/config/settings.json`. The team card reads
`GET /teams` and `GET /judging/projects/team/:teamId`; the pass reads
`GET /users/info/me`.

**Announcements.** apiv3 has no announcements feed (its notifications are
push-only), so for now they come from the HackPSU Discord. The route handler
`src/app/api/announcements/route.ts` calls Discord's REST API with a bot token
(`src/lib/discord.ts`), caches the result for 30 seconds, and returns
`AnnouncementEntity[]`. The feed polls it every minute. Along the way it strips
`@everyone`/role pings and custom emoji, turns user mentions into names, renders
`<t:…>` timestamps in Eastern time, and uses a leading `# Heading` or fully bold
first line as the title. `DiscordText` renders the remaining Discord markdown
(bold, italics, links, lists, quotes) as React elements, never raw HTML. It's the
only part of the site that doesn't read from apiv3, and it's meant to move there
— see [Known gaps](#known-gaps).

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

For announcements, also set `DISCORD_BOT_TOKEN` and
`DISCORD_ANNOUNCEMENTS_CHANNEL_ID`. They're server-only: no `NEXT_PUBLIC_`
prefix, so the token never reaches the browser. Set them on the host too. Without
them `/api/announcements` returns 503 and the feed says announcements aren't
loading, but the rest of the site works.

### Setting up the Discord bot

The bot never connects to Discord or runs anything: it's only a token the
server uses to read one channel, and it shows as offline in the member list.
Someone with **Manage Server** on the HackPSU Discord does this once:

1. In the [Discord Developer Portal](https://discord.com/developers/applications),
   create an application (e.g. "HackPSU Live"). Under **Bot**, reset the token
   and copy it into `DISCORD_BOT_TOKEN`.
2. On the same page, turn on **Message Content Intent**. Without it Discord
   returns messages with empty text.
3. Under **OAuth2 → URL Generator**, pick the `bot` scope and only the **View
   Channels** and **Read Message History** permissions. Open the generated URL
   and add the bot to the server.
4. Make sure the bot's role can see the announcements channel. It needs no
   access to anything else.
5. Turn on Developer Mode (User Settings → Advanced), right-click the
   announcements channel, choose **Copy Channel ID**, and put it in
   `DISCORD_ANNOUNCEMENTS_CHANNEL_ID`.

Check it with `curl localhost:3000/api/announcements` while `yarn dev` runs. A
401 in the server log means the token is wrong; 403 means the bot can't see the
channel; posts with empty text mean the intent is off.

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
- Announcements — post in the Discord announcements channel. Start the post
  with `# Title` or a fully **bold** first line to give it a title on the site.

## Known gaps

These are wired on the frontend and waiting on backend or asset work. Each is
marked with a `TODO` at the relevant file.

- **Announcements bypass apiv3.** They're proxied from Discord by this app's
  own `/api/announcements` route as a stopgap. The plan is to move
  `src/lib/discord.ts` into apiv3 as `GET /announcements`. Then
  `src/lib/api/announcement/provider.ts` switches to `apiFetch`, and
  `src/app/api/announcements/` and the `DISCORD_*` env vars here go away.
- **No `ceremony` event type.** apiv3's `EventType` is
  `activity | food | workshop | checkIn`, but the design treats ceremonies as
  their own category. `src/lib/events.ts` recognizes them by name as a stopgap.
- **No "my team" lookup.** `GET /teams/:id` needs a team id and users carry no
  `teamId`, so `src/lib/hooks/use-my-team.ts` scans the team list.
- **Floor plans are placeholders.** Drop real ECoRE SVGs into
  `public/floors/` and render them in `FloorMap.tsx`.
- **Check-in time and meal counts** aren't on the pass — the data is in scans,
  but there's no per-user rollup endpoint.
