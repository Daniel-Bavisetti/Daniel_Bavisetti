# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static, single-page personal portfolio site for Daniel Bavisetti, positioned as an AI/ML Engineer (computer vision, generative AI/NLP, backend & MLOps). No build tooling, package manager, or server-side code — plain HTML/CSS/JS served as static files, deployed via GitHub Pages at `https://daniel-bavisetti.github.io/Daniel_Bavisetti/`.

The project started from the BootstrapMade "iPortfolio" template but has since been substantially rewritten: custom markup, class names, a custom dark-themed design, and (as of the 2026-08 pass) nearly all original vendor libraries and template leftovers have been removed. Read `index.html` directly rather than assuming template structure.

## Running / previewing

There is no build step. Open `index.html` directly in a browser, or serve the directory with any static file server, e.g.:

```
python -m http.server 8000
```

There are no tests, linters, or CI configured in this repo.

## Structure

- `index.html` — the entire live site: nav, hero, about, "what I build", featured projects, open-source & other work, experience & education, technical stack, coding-profile links, contact, footer. All content edits happen here. Section order matches the nav anchors (`#home`, `#about`, `#projects`, `#experience`, `#skills`, `#contact`); `#build`, `#opensource`, and `#links` exist as sections but are intentionally not in the main nav.
- `assets/css/main.css` — the only stylesheet. Custom, hand-written; not derived from the original template CSS.
- `assets/js/main.js` — vanilla JS (IIFE, no framework/bundler): mobile nav toggle with `aria-expanded`, smooth-scroll anchor links (respects `prefers-reduced-motion`), `IntersectionObserver`-based scroll-reveal (with a 2s timeout safety net — see below), active-nav-link highlighting, scroll-to-top button visibility, dynamic footer year, Typed.js init for the hero's rotating focus-area text, a client-side site search (static `SEARCH_INDEX` array, no backend), and an `error`-listener fallback that hides `.stats-row` if the GitHub stats images fail to load.
- `assets/vendor/typed.js/` — the **only** vendor library still in use (drives the hero's rotating role text). All other original template vendor libraries (Bootstrap, AOS, GLightbox, Swiper, PureCounter, Waypoints, isotope-layout, imagesloaded, php-email-form) were removed in the 2026-08 cleanup — they were loaded but never actually used by the markup.
- `assets/img/` — `favicon.png`, `apple-touch-icon.png`, `my-profile-img.png` (about-section portrait), `og-image.png` (social share preview, generated to match the site's palette — regenerate with a similar script if hero copy/branding changes materially).
- `assets/resume/` — empty except a placeholder note; no resume PDF is committed to the repo. The resume CTA currently points to an external Google Drive URL. See `assets/resume/PLACE_RESUME_HERE.txt` for how to swap in a locally-hosted PDF.
- `robots.txt`, `sitemap.xml` — SEO plumbing pointing at the GitHub Pages canonical URL.
- `Readme.txt` — original BootstrapMade template attribution/license file; kept for license compliance, not part of the live site.

Removed in the 2026-08 rebuild (do not re-add without a reason): `portfolio-details.html`, `starter-page.html` (unlinked template leftovers), `forms/` (non-functional PHP contact form — GitHub Pages can't execute PHP, and it was never linked from `index.html` anyway), `assets/scss/` (unused template source), `assets/img/portfolio/` (unused template placeholder images), and stray `p.py`/`m.py` files.

## Conventions when editing

- Keep edits inside `index.html` / `assets/css/main.css` / `assets/js/main.js` unless a task explicitly involves vendor assets or SEO files.
- CSS is organized by section, mirroring the order sections appear in `index.html`. Add new rules near the section they style. CSS custom properties live in `:root` at the top of `main.css` — reuse `--primary`/`--secondary`/`--accent`/`--radius-*` etc. rather than hardcoding new colors/radii.
- The site's personal content (bio, contact info, education, skill tags, project metrics, coding-profile stats) is real user data — when asked to update it, edit the text in place rather than restructuring the section unless asked. Do not invent projects, employers, metrics, or GitHub repo links; verify against the actual GitHub profile (`https://github.com/Daniel-Bavisetti/`) before adding a project link.
- The Featured Projects section links out to real GitHub repos where one exists (`fastapi-triton-resnet50`, `Flipkart_Customer_Satisfaction`); two project cards (IoT Data Imputation, XAMBOREE) intentionally have no GitHub link because no public repo was found for them — add one if/when it exists rather than guessing a URL.
- Respect `prefers-reduced-motion` for any new animation (existing pattern: check `window.matchMedia('(prefers-reduced-motion: reduce)')` in JS, and the blanket CSS override at the top of `main.css`).
- **Scroll-reveal gotcha**: sections start at `opacity:0` and are revealed via `IntersectionObserver` on scroll. A full-page automated render (e.g. Playwright `full_page` screenshot) proved this can leave content permanently invisible if nothing ever scrolls it into the *original* viewport — there's a `window.setTimeout(revealAll, 2000)` safety net in `main.js` specifically to prevent that. Don't remove the timeout without another way to guarantee content becomes visible independent of real scroll events.
- The Open-Source section (`#opensource`) embeds two `github-readme-stats.vercel.app` images for live stats. That specific free public instance is known to intermittently return `503 DEPLOYMENT_PAUSED` (shared by thousands of GitHub profiles, periodically hits Vercel's usage limits) — the `error`-listener fallback in `main.js` hides `.stats-row` when both images fail, so it degrades to just the repo cards rather than showing broken-image icons. Keep that fallback if touching this section.
- Site search (`#searchPanel`) is a static client-side index (`SEARCH_INDEX` in `main.js`), not a real search engine — update it by hand when adding/removing content elsewhere on the page, or search results will silently go stale.
- The "Ask about Daniel" chat widget (`#chatPanel`) is a rule-based keyword matcher (`CHAT_KB` in `main.js`), not an LLM — deliberately, since a real LLM would need an API key hidden server-side, which a static GitHub Pages site can't do without a separate backend. It can only ever say what's already true and published on the page. Bot-authored answer strings are rendered via `innerHTML` (safe, since they're static and never derived from user input) to allow inline links; the visitor's own message is always rendered via `textContent`. Keep `CHAT_KB` in sync with `SEARCH_INDEX` and the page content by hand.
- No login/admin system exists or is planned: GitHub's own repo-write auth already is the access control for who can change the site (only accounts with push access to this repo). A separate in-page login would need a real backend to be more than security theater, since GitHub Pages can't hide secrets — don't add one without that tradeoff being an explicit, informed decision.
