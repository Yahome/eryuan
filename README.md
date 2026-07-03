# 二元 Eryuan · Awwwards 风格 Landing Page

这是一个 **Vite + React + TypeScript** 首页原型，实现了你当前想要的三段式体验：

1. 第一屏极简画室 Hero：空气尘埃、光影漂移、鼠标视差、画布轻微呼吸感。
2. 鼠标滚轮 / 移动端下滑触发的电影式转场：镜头推近画布，把当前画布变成屏幕。
3. 深色电影感生成成果 Gallery：适合后续扩展更多 AI 生图作品展示。

当前版本使用 React 组件承载页面结构，GSAP ScrollTrigger 由 npm 依赖导入，滚动叙事由 pin / scrub 驱动。

---

## 项目结构

```txt
eryuan/
├── index.html
├── styles.css
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   └── styles.css
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── package.json
├── package-lock.json
├── .nvmrc
├── .gitignore
├── README.md
└── public/
    ├── favicon.svg
    ├── images/
    │   ├── hero-studio.webp
    │   ├── reveal-poster.webp
    │   ├── gallery-stage.webp
    │   ├── work-portrait.webp
    │   ├── work-moon.webp
    │   ├── work-city.webp
    │   ├── work-abstract.webp
    │   └── work-stilllife.webp
    ├── videos/
    │   ├── canvas-reveal.webm
    │   ├── canvas-reveal.mp4
    │   └── README.md
    └── vendor/
        ├── gsap.min.js
        └── ScrollTrigger.min.js
```

---

## 如何启动项目

建议使用 Node.js 20+。本项目已放置 `.nvmrc`：

```bash
nvm use
```

安装依赖：

```bash
npm install
```

启动 Vite 开发服务器：

```bash
npm run dev
```

然后打开：

```txt
http://127.0.0.1:5173
```

检查 TypeScript 和生产构建：

```bash
npm run check
```

---

## 如何放进 GitHub 的 `eryuan` 仓库

如果你的 GitHub 仓库是空的：

```bash
git clone <你的 eryuan 仓库地址>
cd eryuan
```

把本项目包里的所有文件复制到仓库根目录，然后执行：

```bash
git add .
git commit -m "feat: add cinematic landing page"
git push
```

如果仓库里已经有代码，建议先新建一个分支：

```bash
git checkout -b feat/cinematic-landing
```

复制文件后再提交：

```bash
git add .
git commit -m "feat: add cinematic landing page"
git push -u origin feat/cinematic-landing
```

然后在 GitHub 上创建 Pull Request 合并到主分支。

> 我这边不能直接写入你的 GitHub 远程仓库；当前交付的是可下载、可复制进仓库的完整项目文件。

---

## 视频如何替换

当前 `public/videos/` 里有占位视频，方便页面先跑起来。

正式上线时，只需要用你的最终视频覆盖这两个文件名：

```txt
public/videos/canvas-reveal.webm
public/videos/canvas-reveal.mp4
```

HTML 已经写好路径：

```html
<video class="reveal-video" muted playsinline preload="auto" poster="public/images/reveal-poster.webp">
  <source src="public/videos/canvas-reveal.webm" type="video/webm" />
  <source src="public/videos/canvas-reveal.mp4" type="video/mp4" />
</video>
```

滚动时，`script.js` 会通过 GSAP ScrollTrigger 读取滚动进度并控制 `video.currentTime`，让视频像被滚轮 scrub 一样播放。

建议视频规格：

```txt
比例：16:9
时长：2.5s - 4s
帧率：24fps 或 30fps
第一帧：接近首页空白画布
最后一帧：接近深色成果展厅
格式：WebM + MP4 fallback
声音：无声或 muted
```

---

## 视频生成 Prompt

可以用这个方向生成正式转场视频：

```text
A cinematic minimalist artist studio, warm natural light, a large blank canvas on a wooden easel in the center. The camera slowly moves closer to the canvas. Subtle dust particles float in the air. The surface of the canvas begins to tear open from the center like thick handmade paper, revealing a surreal AI-generated landscape behind it: misty mountains, ocean cliffs, soft golden sky, dreamlike atmosphere. Paper fragments and fine powder burst outward in slow motion, illuminated by a diagonal beam of sunlight. Elegant, quiet, premium, Awwwards-style, cinematic lighting, shallow depth of field, no people, no extra text, 16:9, ultra realistic, refined art direction, slow motion, 3 seconds.
```

负面词：

```text
low quality, messy composition, overdecorated studio, cartoon, anime, cheap UI, excessive particles, people, watermark, logo, unreadable text, distorted canvas, noisy background, oversaturated colors
```

---

## 如何替换成果展示图片

替换这些文件即可：

```txt
public/images/work-portrait.webp
public/images/work-moon.webp
public/images/work-city.webp
public/images/work-abstract.webp
public/images/work-stilllife.webp
```

如果要新增作品，编辑 `index.html` 里的 `.works-track`：

```html
<article class="work-card">
  <img src="./public/images/your-new-work.webp" alt="新的作品名" />
  <div class="work-shadow"></div>
  <div class="work-meta">
    <span>06</span>
    <strong>新的作品名</strong>
    <em>Category</em>
    <p>your prompt summary</p>
  </div>
</article>
```

---

## 动效时间线说明

页面主要滚动动画在 `script.js` 里，核心由 GSAP ScrollTrigger 创建 pin / scrub 时间线。

核心节奏：

```txt
0% - 16%     导航、文案、滚动提示淡出
8% - 36%     镜头推近画布，背景轻微虚化
26% - 62%    创作之门视频转场出现，滚动控制视频进度
48% - 58%    Hero 画布淡出
62% - 74%    成果展厅淡入
70% - 100%   作品卡片依次浮现，展墙轻微横向移动
```

如果想让整体转场更慢，修改 `styles.css` 中的：

```css
.story {
  height: 420vh;
}
```

数值越大，用户需要滚动更长距离，动画越慢。

---

## Figma 交付建议

建议在 Figma 中保留 4 个关键状态：

```txt
Frame 01 — Hero 静止状态
Frame 02 — Scroll 30%，镜头推近画布
Frame 03 — Scroll 60%，画布撕裂，创作世界出现
Frame 04 — Scroll 100%，进入生成成果展厅
```

页面文字、导航、按钮最好不要烘焙进图片，而是交给代码渲染，这样可以继续做 hover、滚动、响应式和 SEO。

---

## Figma 动效验收

我新增了 `FIGMA_MOTION_QA.md`，用于把代码动效映射到 Figma 的 4 个关键状态：

```txt
Frame 01 — Hero 静止状态
Frame 02 — Scroll 30%，镜头推近画布
Frame 03 — Scroll 60%，创作之门展开
Frame 04 — Scroll 80%-100%，进入生成成果展厅
```

Figma 只建议验收关键帧和视觉方向；真实滚动、视频 scrub、鼠标视差以浏览器运行为准。

---

## 后续可扩展方向

- 接入真实生图接口
- 增加 Prompt 输入框
- 增加作品详情弹窗
- Prompt 一键复制
- Gallery 分类过滤真实逻辑
- 用户作品瀑布流
- 将当前静态原型迁移到 Next.js / React 组件体系
