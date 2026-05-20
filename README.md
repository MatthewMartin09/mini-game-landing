# Mini Game Landing Page

This repository contains a static HTML/CSS/JavaScript mini game landing page with a date selection form and Google Forms submission integration.

## GitHub Pages Hosting

To host this project on GitHub Pages:

1. Create a new GitHub repository.
   - Name it anything, for example `mini-game-landing`.
   - Do not initialize it with a README, license, or .gitignore if you want to push this folder directly.

2. In this folder, run:

```bash
cd "c:\Users\Matthew\Desktop\Game"
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

3. In GitHub, go to the repository settings:
   - Go to `Settings` > `Pages`.
   - Under `Source`, choose `main` branch and `/ (root)` folder.
   - Save.

4. Your site will be published at:
   - `https://<your-username>.github.io/<repo-name>/`

## Files

- `index.html` — main page structure
- `style.css` — page styling
- `script.js` — page interactions and Google Forms submission
- `ramen.png`, `matcha.png`, `pasta.png`, `Background.mp3`, `Click.mp3` — assets used by the page

## Notes

- GitHub Pages will serve this project as a static website.
- If you want the game to submit form data to Google Forms again, make sure the form URL in `script.js` is still correct.
