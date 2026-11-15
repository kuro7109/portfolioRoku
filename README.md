# Rohit Kumawat · Portfolio

Personal portfolio of Rohit Kumawat, product designer and product manager in Delhi.

A single static page: no framework and no build step needed to run it. Open `index.html` or serve the folder with any static host (GitHub Pages, Vercel, Netlify).

## Pages
Hash-routed: `#home`, `#work`, `#experiments`, `#blogs`, `#about`, `#book`. Deep links like `#work/tickai` scroll to a project.

## Editing
The page is assembled from the parts in `src/`:

| File | What's in it |
| --- | --- |
| `src/head.html` | `<head>`, fonts, design tokens, all CSS |
| `src/body.html` | Page markup |
| `src/core.js` | Content (projects, experience, tools, highlights), icons, haptics, loader |
| `src/app.js` | Theme, header, router, section rail, hero, weather, rays, work page |
| `src/globe.js` | Revolving skills network at the end of Home |
| `src/app2.js` | Experiments, about, chat, blogs, book a call, footer |

Edit a part, then run `./build.sh` to regenerate `index.html`.

## Placeholders still marked `xyz`
Design Club IITD dates, how Rohit got into design (About), footer quote, video-call link.

## Fonts
TikTok Sans, IBM Plex Mono and Reenie Beanie, all under the SIL Open Font License, in `fonts/`.
