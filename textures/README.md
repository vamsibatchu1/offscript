# Paper textures

Every paper has one `.tsx` file containing its definition, selector component, and all its CSS. Illustrated papers also have an adjacent `.svg` asset. There are no separate texture CSS files.

| Paper | Component and CSS | Artwork |
| --- | --- | --- |
| Paper & ink | `PaperAndInk.tsx` | Grain defined in the component's CSS |
| Olive & chalk | `OliveAndChalk.tsx` | Grain defined in the component's CSS |
| Blue notebook | `BlueNotebook.tsx` | Grain defined in the component's CSS |
| Midnight | `Midnight.tsx` | Grain defined in the component's CSS |
| Ruled notebook | `RuledNotebook.tsx` | `RuledNotebook.svg` |
| Graph paper | `GraphPaper.tsx` | `GraphPaper.svg` |
| Engineering paper | `EngineeringPaper.tsx` | `EngineeringPaper.svg` |

To add a texture:

1. Copy the closest `.tsx` file here and give it a unique name, ID, and CSS classes.
2. Set its paper and ink colors and edit the `css` template string in that same file. Scope rules to its surface and swatch classes. Put any SVG artwork beside the component, import it with `?url`, and use that imported URL in the CSS, as the existing illustrated textures do.
3. Import the definition in `index.ts` and append it to `PAPER_TEXTURES`. That order controls the Paper selector; existing entries should stay in place.

The page uses the registry automatically. No changes to `app/page.tsx` or `app/globals.css` are needed for a new texture. `TextureSwatch.tsx` renders each texture's scoped style tag and preserves shared selection behavior and accessibility. The paper's content containers stay mounted when the selection changes.

The existing `/public/paper/*.svg` files remain available for compatibility with old direct URLs. The app now uses the artwork in this folder.
