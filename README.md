# Koleksi Resepi Dessert & Bakery Homemade — Web Edition

Responsive web version of the Arkib Digital recipe ebook, with a Bahasa Melayu / English switch in the top bar.

## What's inside

```
index.html          The whole ebook (both languages)
assets/styles.css   Design and layout
assets/app.js       Language switch, contents menu, progress highlight
assets/cover.jpg    Cover image
assets/photos/      Recipe photos (WebP, one per recipe)
vercel.json         Vercel settings (caching)
```

It is a plain static site: no build step, no dependencies.

## Deploy to Vercel

1. Create a new repository on GitHub and upload all the files in this folder (keep the `assets` folder structure).
2. Go to vercel.com, choose **Add New → Project**, and import the repository.
3. Leave the framework preset as **Other**, with no build command and the output directory as the project root.
4. Click **Deploy**.

Every time you push a change to GitHub, Vercel publishes the update automatically.

## Language

- The site opens in Bahasa Melayu by default and remembers the reader's last choice.
- Add `?lang=en` to the link to open the English version directly, e.g. `https://your-site.vercel.app/?lang=en`.
- Switching language keeps the reader on the same recipe.

## Editing content

The text lives inside `index.html`. Each language is in its own block (`data-lang-pane="ms"` and `data-lang-pane="en"`), and matching recipes share the same `data-key`, so if you edit a recipe, update it in both languages.
