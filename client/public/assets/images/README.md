# Image assets

Development placeholders and, later, real photography live here, grouped by purpose:

| Folder | Content | Recommended ratio |
| --- | --- | --- |
| `foods/` | Dish photos | 4:3, at least 800 x 600 |
| `restaurants/` | Cover, interior and exterior photos | 16:10, at least 1200 x 750 |
| `categories/` | Food category thumbnails | 1:1, at least 256 x 256 |
| `promotions/` | Promotional banners | 21:9 or 16:9 |

Guidelines:

- Prefer WebP or AVIF, keep files under 250 KB where possible.
- Name files in kebab-case, for example `chipsi-kuku.webp`.
- Components render images through `SmartImage`, which reserves the aspect ratio,
  lazy loads below the fold and shows a branded placeholder when an image is
  missing. Replacing a placeholder only requires providing a real `src`.
- Restaurant-uploaded photos (Phase 4 onward) are stored by the server, not here.
