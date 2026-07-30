# Shining Cao — 作品集网站

一个纯静态网站（HTML + CSS + JS，无需构建工具），可以直接托管在 GitHub Pages 上，免费、不需要域名。

## 文件说明
- `index.html` — 首页结构与文案
- `style.css` — 样式（设计主题：像设计图纸/标注线一样的"蓝图"风格，呼应 UX 设计师的身份）
- `script.js` — 少量交互（页脚年份、"Based in" 文字）
- `case/emmy.html`、`case/esia.html`、`case/mychart.html` — 三个完整的案例研究页面（问题定义、调研、线框、视觉设计、复盘），内容根据你原网站上的案例内容重新整理

**注意：** 案例页里的图片目前直接引用的是你原来 Framer 项目里图片的链接（`framerusercontent.com`），这样不用你重新上传图片，但前提是你的原 Framer 网站保持在线。如果之后 Framer 网站下线，这些图会失效——到时候把图片下载下来放进一个 `images/` 文件夹，再把 `<img src="...">` 换成本地路径就行，我也可以帮你做这一步。

## 部署到 GitHub Pages（约 5 分钟）

1. **新建仓库**
   打开 https://github.com/new ，仓库名建议用 `portfolio`（会影响最终网址）。设为 Public，不需要勾选 README。

2. **上传文件**
   在新仓库页面点击 "Add file" → "Upload files"，把 `index.html`、`style.css`、`script.js` 和整个 `case` 文件夹一起拖进去（保持文件夹结构不变），点击 "Commit changes"。

   （如果你更熟悉命令行，也可以：
   ```bash
   git init
   git add .
   git commit -m "first commit"
   git branch -M main
   git remote add origin https://github.com/你的用户名/portfolio.git
   git push -u origin main
   ```
   ）

3. **开启 GitHub Pages**
   仓库页面 → Settings → 左侧 Pages → Source 选择 `Deploy from a branch` → Branch 选择 `main` / `root` → Save。

4. **等 1-2 分钟**
   刷新 Pages 设置页，会出现一个类似这样的网址：
   ```
   https://你的用户名.github.io/portfolio/
   ```
   这个链接就可以直接放进简历。

## 想自己改内容？
- 文案在 `index.html` 里，直接搜文字改就行。
- 三个项目卡片目前指向你原网站的案例页链接（`shiningcao.framer.website/costum/...`）；如果之后案例内容有更新，把对应的 `href` 换成新链接即可。
- 想换主题色，去 `style.css` 顶部 `:root` 里改 `--accent`（目前是珊瑚粉 `#FF5470`）。

## 之后可以做的
- 把案例页里的图片换成本地文件（见上面"注意"）
- 加一张你的头像/照片
- 补一个简历 PDF 下载链接
