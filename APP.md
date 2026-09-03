# Embedded Systems Learning Tracker

A local web app that turns a curated embedded-software syllabus into a trackable course: accounts
per email address, per-resource progress, a permanent completion history, reminders and notes.

Zero npm dependencies — it uses Node's built-in `node:http`, `node:sqlite` and `node:crypto`.

## Run it

```
cd d:\Course
node server.js
```

Then open **http://127.0.0.1:5178** and click **Create account**.

Change the port or bind address with env vars:

```
set PORT=8080 && node server.js
set HOST=0.0.0.0 && node server.js      # expose on the LAN (see Security below)
```

## What's in it

**Course** — the syllabus's 13 chapters and 711 resources as a browsable tree. Every resource is a
card with its kind (Video / Article / PDF / …), source, YouTube thumbnail and a link out. The tick
button cycles **not started → in progress → done**. Filter a topic by status, or mark a whole
topic done in one click.

**Dashboard** — overall completion ring, current and best streak, resources completed today, a
26-week activity heatmap, per-chapter progress bars, and a *Continue where you left off* card that
picks your oldest in-progress resource (or the next untouched one).

**History** — every status change you have ever made, newest first, grouped by day. Nothing is
overwritten; un-ticking something records a "reset" event rather than erasing the original.

**Notes** — a full workspace, separate from the course. Notes are either *standalone* or *linked*
to a specific resource (the pencil on any card opens that resource's note). Title, body, tags,
pin, autosave. A card with a note shows an amber pencil. Bodies are **markdown** with a
Write/Preview toggle and **syntax-highlighted code fences** — ` ```c ` gives you highlighted C,
` ```asm ` treats `;` as a comment. The renderer is `public/md.js`, written for this app; no
library is loaded.

**Reminders** — the bell in the top bar. Pick a time, the days of the week, a daily goal, and which
channels should nudge you. The server schedules it in *your* local time and can stay quiet on days
you already hit the goal. Each message carries your streak, progress and the next resource to open.

**Search** (`/` or the top bar) spans every resource title, source, topic path and all your notes.
**`Ctrl`+`K`** opens a command palette over the same data with arrow-key navigation — faster than
the sidebar once the tree is collapsed.

**Progress scope** — the syllabus holds 779 items but the course is ~295 of them. The control under
the sidebar progress bar chooses what the ring, streak and dashboard are measured against: the
core path through Stages 0-6, plus any elective tracks you switch on, or everything including the
Reference Shelf. Reminders quote the same numbers.

### Keyboard

| Key | Action |
|---|---|
| `Ctrl`+`K` | command palette — jump to any stage, topic, resource or note |
| `/` | focus search |
| `1` `2` `3` `4` | Course · Dashboard · History · Notes |
| `Esc` | close dialog / menu |

## Accounts

One account per email address, case-insensitive. The user id is derived deterministically from the
email (`u_` + a SHA-256 prefix), so the same address always maps to the same account. Passwords are
hashed with scrypt (N=16384, per-user random salt) and compared in constant time. Sessions are
random 256-bit tokens in an `HttpOnly`, `SameSite=Lax` cookie, valid 30 days; changing a password
revokes every other session.

Progress, history and notes are all scoped by user id — two accounts on the same machine never see
each other's data.

**Export** (avatar menu → Export my data) downloads everything for the signed-in account as JSON.

## Reminder channels

Four channels, each independently switchable. Only the first works out of the box; the rest need
credentials in `data/config.json` (gitignored — copy `config.example.json` and fill in what you
want). The app reads that file live, so no restart is needed after editing it. Channels you have
not configured are shown greyed out with the reason, and cannot be ticked.

| Channel | Needs | Reaches you when |
|---|---|---|
| **In-app alarm** | nothing | the tracker is open in a tab — banner + chime + browser notification |
| **Windows toast** | `desktop.enabled: true` | the server is running, browser closed or not |
| **Email** | SMTP credentials | anywhere |
| **WhatsApp** | Meta Cloud API or Twilio credentials | anywhere |

Every channel has a **Test** button that sends immediately and writes the outcome — including the
provider's error text — to the delivery log at the bottom of the panel.

### Email (SMTP)

```json
"smtp": {
  "enabled": true,
  "host": "smtp.gmail.com", "port": 465, "secure": true,
  "user": "you@gmail.com", "pass": "your-16-char-app-password",
  "from": "Learning Tracker <you@gmail.com>"
}
```

For Gmail, `pass` must be an [App Password](https://myaccount.google.com/apppasswords) — your normal
login password will be rejected. Port 465 uses implicit TLS; port 587 with `"secure": false`
upgrades via STARTTLS. Any SMTP host works.

### WhatsApp

Pick one provider. **Meta Cloud API** (free tier, needs a Meta business app):

```json
"whatsapp": {
  "enabled": true, "provider": "meta",
  "meta": { "phoneNumberId": "...", "accessToken": "EAA...", "template": "", "language": "en" }
}
```

**Twilio** (easiest to try — the sandbox works after you send its join code once):

```json
"whatsapp": {
  "enabled": true, "provider": "twilio",
  "twilio": { "accountSid": "AC...", "authToken": "...", "from": "whatsapp:+14155238886" }
}
```

Your own number goes in the app's reminder panel, not the config file — digits with country code,
e.g. `919876543210`.

> **The 24-hour window.** WhatsApp only allows free-form text to someone who messaged your number in
> the last 24 hours. Outside that window Meta rejects it and you must use an approved message
> template — set `meta.template` to its name and the reminder text is passed as the first body
> parameter. Twilio's sandbox has the same rule; re-sending its join code reopens the window.

### Scheduling

The browser reports its UTC offset when you save, and the server fires against that, so `07:30`
means 07:30 where you are. If the machine was asleep at the scheduled minute, the reminder is sent
at the next tick that day rather than skipped — and it fires **at most once per local day**, per
account.

## Where data lives

```
SYLLABUS.md          the course (generated — edit tools/syllabusMap.js, not this)
README.md            the original resource list, kept as the fallback curriculum
sources/             vendored upstream material the syllabus is built from
tools/               syllabus generator, editorial map, link checker
data/tracker.db      SQLite — users, sessions, progress, history, notes, reminders, delivery log
data/config.json     your SMTP / WhatsApp credentials  (gitignored — never sent to the browser)
data/course.json     generated cache of the parsed curriculum (safe to delete)
config.example.json  template, written on first run
```

All of `data/` is in `.gitignore`. Deleting `tracker.db` wipes all accounts.

## The curriculum

The app serves **`SYLLABUS.md`** when it exists, else falls back to `README.md`.

`SYLLABUS.md` is **generated**, not hand-written. It is a staged embedded-software course
assembled from two sources:

- [`sources/embedded-engineering-roadmap.md`](sources/embedded-engineering-roadmap.md) — a vendored
  copy of [m3y54m/embedded-engineering-roadmap](https://github.com/m3y54m/embedded-engineering-roadmap)
  (CC BY-SA 4.0)
- the original `README.md` resource list

```
node tools/buildSyllabus.js      # regenerate SYLLABUS.md
node tools/checkLinks.js         # verify every link still resolves
```

### Changing the course

Edit **[`tools/syllabusMap.js`](tools/syllabusMap.js)** and re-run the build. That file is the
entire editorial decision set — stages, topics, which source sections feed each topic, project
gates, the dead-link blocklist, and which paid resources survive. Nothing is hand-edited in
`SYLLABUS.md`; a rebuild overwrites it.

A topic pulls from three places:

| key | meaning |
|---|---|
| `road: [...]` | roadmap sections, named by the tail of their heading path |
| `legacy: [...]` | topics from the original `README.md`, by heading path |
| `plus: [...]` | hand-written entries with an explicit URL |

A `project:` entry takes `{ name, goal, brief, criteria }`. `brief` is markdown — rendered in the
app as the amber panel above the checklist, so tables and fenced code work. Use **bold lines** as
section labels, never `###`: a heading there would be parsed as a new syllabus topic.

De-duplication is global and order-sensitive: the first topic to claim a URL keeps it. A URL named
in a `plus` block is reserved for that topic, so a broad section pull elsewhere cannot swallow it.

### Shape of it

13 chapters, **779 items**, 11 project gates broken into **79 acceptance criteria**.

**The gates build one product, not eleven exercises.** Every stage adds a layer to the same
repository — `cellguard`, an emulated battery-management node. Stage 0 is the repo skeleton that
boots in Renode; Stage 1 adds the allocation-free core library; Stage 2 the build system and linker
script; Stage 3 bare-metal drivers written from the reference manual; Stage 4 I²C sensing and a CAN
stack; Stage 5 the RTOS restructure; Stage 6 turns it into something shipped — TDD, CI that boots
the image in an emulator on every push, and a signed A/B bootloader. Tracks B, C and D extend the
same product (safety case, anomaly detection, control loops). The result is one deep repository a
reviewer can clone and run with **no hardware**, rather than eleven abandoned folders.

Each gate carries a full brief rendered in the app: what you are building, why it is worth showing,
**expected output** with concrete console/code examples, what makes it stand out, and the definition
of done as individually tickable criteria.

| | items |
|---|---:|
| Stage 0 Orientation & Emulated Lab | 37 |
| Stage 1 C for Embedded | 57 |
| Stage 2 Toolchain, Build & Debug | 50 |
| Stage 3 Bare-Metal MCU | 90 |
| Stage 4 Buses & Protocols | 128 |
| Stage 5 RTOS & Architecture | 61 |
| Stage 6 Production Engineering | 102 |
| Tracks A–D (electives) | 104 |
| **Reference Shelf** | 147 |
| Optional books | 3 |

**The course is the ~295 core items in Stages 0-6.** Everything else is optional.

The **Reference Shelf** holds topics that are self-contained subjects rather than steps in a
course — vendor catalogues (seven RTOSes you will not learn), link galleries, off-platform drills,
and separate disciplines (C++/Rust/Python/Zig, PID control). Each stage's blurb names what was
moved out of it. To put one back, drop its `shelf: true` in the map and rebuild.

Resources sit in one of three tiers, because a topic that offers five complete courses is a
month of duplicated work, not a choice:

| tier | meaning | in the app |
|---|---|---|
| **core** | the course itself | plain card |
| `[alt]` | *same ground* as a core item above it — a different teacher for the same lesson. **Pick one, skip the rest.** 85 items | dashed border, ⇆ alternative chip |
| `[extra]` | optional depth, 266 items | dimmed |

The **Core path** button in the toolbar hides both `[alt]` and `[extra]`, leaving only the course.
Two further badges are orthogonal: `[beginner]` → **start here** chip, `[reference]` → **deep
reference** chip (canonical source, not a first-pass read), `[optional-paid]` → the three books.

The builder enforces this per topic: at most one entry point, at most one comprehensive resource
(a book, a video playlist or a numbered "101" course), and no near-duplicate titles. Publisher
names are stripped before comparison so "Microchip University – X" and "Microchip University – Y"
are not mistaken for the same thing. Numbered parts of one series are complements and stay
together. Override the automatic pick with `primary: '<title fragment>'` on a topic, or widen a
topic with `core: <n>`.

Progress ids are hashes of each resource's **URL**, so re-running the build after re-ordering,
re-wording or shelving keeps your ticks. Changing a resource's URL creates a new id; the old
completion stays in your history.

### Link health

`tools/checkLinks.js` probes every link, using the YouTube thumbnail endpoint for videos (a watch
page returns 200 even for a removed video). Last run: **659 ok, 30 blocked-by-bot-detection, 11
dead** (the remaining 11 are TLS/bot false negatives that load fine in a browser). The dead ones are listed in `deadLinks` in the map and stripped at build time — re-run the
checker to refresh that list.

## Hosting it on GitHub Pages

`node tools/buildStatic.js` produces **`docs/`** — the same app with `static-api.js` answering the
`/api/*` routes from IndexedDB instead of a Node server. Same `app.js`, same CSS, same renderer;
there is no fork to keep in sync.

```
node tools/buildStatic.js
git add docs SYLLABUS.md
git commit -m "Publish syllabus site"
git push
```

Then **Settings → Pages → Source: `main` branch, `/docs` folder**. The site appears at
`https://<you>.github.io/<repo>/` within a minute.

### What the hosted version does and does not do

| | hosted | local `node server.js` |
|---|---|---|
| Course, gates, briefs, palette, dashboard | ✅ | ✅ |
| Progress, history, notes with markdown | ✅ browser only | ✅ SQLite |
| In-app alarm | ✅ while the tab is open | ✅ |
| Accounts, login | ❌ none needed | ✅ |
| Same progress on phone **and** laptop | ❌ per-browser | ✅ via the server |
| Email / WhatsApp / Windows toast | ❌ needs a server | ✅ |

There is **no account and no login** on the hosted site: a visitor sees the syllabus with empty
progress, which is what you want from a public link. Your own ticks live in your browser's
IndexedDB — so **use Export regularly**, and know that clearing site data wipes it.

The unavailable reminder channels are not hidden; they appear greyed out saying they need the local
app, so the page never lies about what it can do.

### Publishing changes the licence position

`SYLLABUS.md` derives from
[m3y54m/embedded-engineering-roadmap](https://github.com/m3y54m/embedded-engineering-roadmap)
under **CC BY-SA 4.0**. Once the page is public that obligation is live: keep the *Credits &
Licence* section, and the published work stays under the same licence. `docs/SYLLABUS.md` is copied
into the build so the attribution ships with the site.

### Why not other free hosts

- **Render free** — [ephemeral filesystem](https://render.com/docs/disks); `tracker.db` is wiped on
  every redeploy, restart and spin-down. Persistent disks are paid-only.
- **Fly.io** — no free tier any more; trial then ~$2-5/month.
- If you later want accounts and cross-device sync for free, the route that works is **Cloudflare
  Workers + D1**: port `node:sqlite` to D1, `scrypt` to PBKDF2 via WebCrypto, and SMTP to an HTTP
  email API. The Windows toast cannot follow.

## Security

The server binds to `127.0.0.1` by default, so it is reachable only from this machine. It has no
CSRF tokens and serves plain HTTP — fine for localhost, **not** fine on a shared network. If you
set `HOST=0.0.0.0` to use it from your phone, put it behind a reverse proxy with TLS first.

## Layout

```
server.js              HTTP server, JSON API, static files
lib/parseReadme.js     README.md  ->  course tree
lib/db.js              SQLite schema + prepared statements
lib/auth.js            scrypt hashing, sessions, cookies
public/index.html      app shell
public/app.js          client (vanilla, no framework)
public/styles.css      dark + light themes
```

### API

| Method | Path | |
|---|---|---|
| POST | `/api/auth/register` · `/api/auth/login` · `/api/auth/logout` | |
| GET / PATCH | `/api/me` | current user, rename, change password |
| GET | `/api/course` | parsed curriculum tree |
| GET / POST | `/api/progress` | read; set one or many items' status |
| POST | `/api/progress/reset` | needs `{"confirm":"RESET"}` |
| GET | `/api/history?limit&offset` | paged event log |
| GET / POST / DELETE | `/api/notes` | list, create-or-update, delete |
| GET / PUT | `/api/reminders` | schedule, channel capabilities, delivery log |
| POST | `/api/reminders/test` | send one channel now |
| GET | `/api/notifications/pending` | alarms waiting for this browser |
| POST | `/api/notifications/seen` | acknowledge them |
| GET | `/api/export` | full JSON export |

```
lib/config.js          data/config.json loader + channel capability reporting
lib/reminders.js       scheduler, message composition, per-channel dispatch
lib/smtp.js            dependency-free SMTP client (implicit TLS / STARTTLS / AUTH)
lib/whatsapp.js        Meta Cloud API + Twilio senders
lib/desktop.js         Windows toast via WinRT, with a tray-balloon fallback
```
