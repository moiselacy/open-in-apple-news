# Open in Apple News+

A Tampermonkey userscript that detects when you're on a paywalled article from an Apple News+ publication and shows a floating button to open it directly in the Apple News app on macOS.

## How it works

1. The script matches the current site against 170+ Apple News+ publication domains (sourced from [Apple's publications page](https://www.apple.com/apple-news/publications/))
2. If you're on an article page (not a homepage or section front), a small floating button appears in the bottom-right corner
3. Clicking the button invokes a macOS Shortcut that runs `open -a "News" <URL>`, which opens the specific article in Apple News

The News app handles resolving the web URL to the correct Apple News article internally — the same mechanism the share sheet uses.

## Requirements

- macOS with Apple News app
- Active [Apple News+](https://www.apple.com/apple-news/) subscription
- [Tampermonkey](https://www.tampermonkey.net/) browser extension
- A macOS Shortcut named **"Open in Apple News"** (setup below)

## Setup

### 1. Create the macOS Shortcut

1. Open **Shortcuts.app**
2. Create a new shortcut named exactly **Open in Apple News**
3. Add a **Run Shell Script** action
4. Set the script to: `open -a "News" "$1"`
5. Set Shell to **bash**, Input to **Shortcut Input**, Pass Input to **as arguments**

### 2. Install the userscript

1. Install [Tampermonkey](https://www.tampermonkey.net/) in your browser
2. Click on `apple-news-opener.user.js` in this repo — Tampermonkey should prompt you to install it
3. Alternatively, create a new userscript in Tampermonkey and paste the contents

## Supported publications

The script covers 170+ publications across all Apple News+ categories, including:

**Major publications:** The Atlantic, The Wall Street Journal, The Washington Post, The New Yorker, WIRED, TIME, Vanity Fair, Vox, Bloomberg Businessweek, New York Magazine, and more.

**Newspapers:** Los Angeles Times, San Francisco Chronicle, Houston Chronicle, The Atlanta Journal-Constitution, Miami Herald, Tampa Bay Times, Dallas Morning News, Philadelphia Inquirer, and dozens of regional papers.

**International:** The Telegraph, The Times, Le Monde, Haaretz, The Globe and Mail, Toronto Star, The Australian, and Canadian papers.

**Magazines:** Fortune, Forbes, Rolling Stone, Variety, Bon Appétit, Condé Nast Traveler, GQ, Esquire, Popular Mechanics, Architectural Digest, Car and Driver, and many more.

The full domain list is in the `PUBLICATIONS` object in the script. To add a publication, add its domain and Apple News channel ID (from the `apple.news/` URL on the [publications page](https://www.apple.com/apple-news/publications/)).

## Features

- Detects article pages vs. homepages/section fronts (via `<article>` tags, Open Graph metadata, and URL structure)
- Floating pill button with Apple News icon, adapts to light/dark mode via `prefers-color-scheme`
- Dismissible per session (uses `sessionStorage`)
- Subdomain-aware matching (e.g. `m.wsj.com` → `wsj.com`)
- Respects `prefers-reduced-motion`
- Uses hidden iframe to trigger `shortcuts://` URL scheme, avoiding repeated browser confirmation dialogs

## How the button looks

A dark (or light, depending on your system theme) pill-shaped button in the bottom-right corner with the Apple News icon and the publication name. Hover to reveal a dismiss ✕ button.

## Notes

- This script is for **macOS only** — it relies on the Shortcuts app and `open -a "News"` to open articles
- The `@match *://*/*` pattern is intentionally broad; domain filtering happens in JavaScript to avoid needing 170+ `@match` rules
- The script waits 1 second after page load before checking, to ensure the page has settled
- If a publication isn't opening the correct article, it may not be in Apple News+ or may have a different domain than expected

## License

MIT
