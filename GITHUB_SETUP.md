# Create Public GitHub Repository for Vižon

Your project is ready to push. Follow one of the options below to create the public repo on GitHub.

---

## Option A: Create repo on GitHub (browser), then push

1. **Create the repository on GitHub**
   - Go to [https://github.com/new](https://github.com/new)
   - **Repository name:** `vizion` (or `vizon` or any name you prefer)
   - **Description:** `Vižon - Premium web development agency website built with Next.js 15`
   - Choose **Public** (or Private if preferred)
   - **Do not** check "Add a README" or "Add .gitignore" (you already have them)
   - Click **Create repository**

2. **Add remote and push** (replace `YOUR_USERNAME` with your GitHub username):

   ```powershell
   cd c:\Users\Arteo\front_vision
   git remote add origin https://github.com/YOUR_USERNAME/vizion.git
   git add .
   git commit -m "Initial commit: Vižon project"
   git branch -M main
   git push -u origin main
   ```

   If you use SSH:

   ```powershell
   cd c:\Users\Arteo\front_vision
   git remote add origin git@github.com:YOUR_USERNAME/vizion.git
   git add .
   git commit -m "Initial commit: Vižon project"
   git branch -M main
   git push -u origin main
   ```

---

## Option B: Use GitHub CLI (if you install it)

1. Install GitHub CLI: [https://cli.github.com/](https://cli.github.com/)
2. Log in: `gh auth login`
3. Create the repo and push:

   ```powershell
   cd c:\Users\Arteo\front_vision
   git add .
   git commit -m "Initial commit: Vižon project"
   git branch -M main
   gh repo create vizion --public --source=. --remote=origin --push
   ```

---

## Optional: Set your Git identity

If you want commits to show your name and email (e.g. on GitHub):

```powershell
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

For this repo only, omit `--global`. For all repos, add `--global`.

---

**Done locally:** Git is initialized, branch is `main`, and `.gitignore` is created. After you run the push steps above, your project will be on GitHub.
