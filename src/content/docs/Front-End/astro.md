---
title: Astro.js
---

![Astro Image](/src/content/docs/Front-End/astro.drawio.svg)

## RESPONSIBLE FOR CODES & TABLES ONLY

| Command             | Action                                           |
| ------------------- | ------------------------------------------------ |
| `npm run build`     | Build your production site to `./dist/`          |
| `npm run astro ...` | Run CLI commands like `astro add`, `astro check` |

| Folder             | Need       | Purpose                                                                                                                        |
| ------------------ | ---------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `src/pages`        | Required   | Pages routes are created for your site                                                                                         |
| `src/layouts`      | Convention |                                                                                                                                |
| `public/`          |            | files and assets that are not processed during Astro’s build process                                                           |
| `astro.config.mjs` | Required   | Includes configuration options for your Astro project. Here you can specify integrations to use, build options, server options |

```astro title="island"
<!-- server island (default) -->
<MyReactComponent />
<!-- client island - mark using client:* directives -->
<MyReactComponent client:load />
```

| Client Directives                    | Purpose                                                                                         |
| ------------------------------------ | ----------------------------------------------------------------------------------------------- |
| `client:load`                        | Load and hydrate the component JavaScript immediately on page load                              |
| `client:idle`                        | Once the browser is idle                                                                        |
| `client:visible`                     | Once the component has entered the user’s viewport                                              |
| `client:only={string}` (Recommended) | Skips HTML server rendering, and renders only on the client. It acts similarly to `client:load` |

```astro title="display loading content"
<ClientComponent client:only="vue">
  <div slot="fallback">Loading</div>
</ClientComponent>
```

### TODO - Traversy Media

- Returns no JS. by default
- component -.astro, react component, and other ext. component
- layout.astro and slot
- image component
  - `/public`
  - `src/assets`
- front-matter for .md (component script for .astro)
- .astro
  - server script - component script
  - client script - `<script>...</script>`
  - component props - `Astro.props`
- `astro sync`
- 404.astro
- content collection
  - `src/content`
  - `src/content/config.ts` - defines collection
  - schema for the content
- dynamic slug - `[...slug]`
  - for static (default config) - `getStaticPaths() { ... }`
  - for SSR:
    - update `astro.config.mjs` to include `output: 'server'`
    - `const { id } = Astro.params`
- server submit
  - for SSR - url is of signature `http://...?query=some-value`. Use `Astro.url.searchParams.get('query')`
  - for static - does not work. Have to use client js and some api
- API -
  - file name - `src/pages/api/search.json.ts` for url `http://../api/search.json`
