# 二元｜创造想象，实现想象

中文 AI 图像生成工作室单页官网。当前版本围绕 **“把想象生成出来”** 展开：用真实 AI 成图资产展示作品墙、精选项目索引，以及从提示词到可发布作品的生成方法。

项目重心是作品展示与生成体验，不再使用 0/1、黑白对立、人机真假这类概念叙事。

## 品牌方向

- 一句话：`二元，把想象变成作品。`
- 核心主张：创造想象，实现想象。
- 创作路径：输入想象 → 生成画面 → 对照精修 → 输出作品。
- 当前 CTA：页面内 `#generate` 区域用于引导“启动一次二元生成”；真实联系方式通过环境变量 `NEXT_PUBLIC_CONTACT_URL` 配置，支持 `https://`、`http://` 与 `mailto:`。未配置时会显示不可点击的“联系方式待配置”，不会暴露占位地址。

## 当前页面结构

- Splash：加载页，展示“正在唤醒想象引擎”和进度动效。
- Navbar：固定顶部导航，锚点为 `#hero`、`#works`、`#method`、`#generate`。
- Hero：首屏“把想象生成出来”，右侧为随机自动滚动作品墙；悬停暂停，点击图片可用 GSAP Flip 放大预览。
- Works：精选作品索引，包含品牌视觉、产品包装、电商转化、AIGC 视觉四个项目；桌面端为滚动驱动的粘性索引与大图预览。
- Method：双路径创作方法和生成控制台，支持切换提示词芯片查看不同作品输出。
- Footer：收束品牌口号“创造想象，实现想象。”

主入口是 `app/page.tsx`，实际渲染 `components/BinaryExperience.tsx`。

## 技术栈

- Next.js 16 App Router + React 19
- TypeScript strict mode
- Tailwind CSS v4 + `@tailwindcss/postcss`
- GSAP、`@gsap/react`、ScrollTrigger、Flip：滚动叙事、视差、作品墙循环、图片放大转场
- Lenis：顺滑滚动，并通过 GSAP ticker 同步 ScrollTrigger
- Motion：Splash、导航、按钮、卡片和内容切换动效
- React Three Fiber + Three：Hero 粒子层；WebGL 不可用时自动降级为 CSS 粒子背景

## 运行

安装依赖：

```bash
npm install
```

复制 `.env.example` 为 `.env.local`，再写入真实联系方式：

```bash
NEXT_PUBLIC_CONTACT_URL=https://example.com/contact
```

启动开发服务器：

```bash
npm run dev
```

默认打开：

```bash
http://localhost:3000
```

生产构建与启动：

```bash
npm run build
npm start
```

## 验证

常用检查命令：

```bash
npm run typecheck
npm run build
```

当前项目状态已验证：

- `npm run typecheck`：通过
- `npm run build`：通过
- 构建环境：Next.js 16.2.10 + Turbopack
- 预渲染路由：`/`、`/_not-found`

## 目录与资产

- `app/page.tsx`：页面入口，渲染 `BinaryExperience`。
- `app/layout.tsx`：页面 metadata、viewport、中文字体资源和全局样式入口。
- `app/globals.css`：Tailwind 入口和主要视觉样式。
- `components/BinaryExperience.tsx`：页面编排、Splash 状态和全局 GSAP 滚动动效。
- `components/binary/`：导航、Hero、作品索引、生成方法、图标和作品数据。
- `components/BinaryParticles.tsx`：R3F/Three 粒子层与 CSS 降级层。
- `components/SmoothScroll.tsx`：Lenis 与 GSAP ScrollTrigger 桥接。
- `public/generated/`：页面消费的 JPG/SVG 生图资产，以及 `IMAGE_PROMPTS.md`。
- `public/works/wall/desktop/`：桌面端 16:9 作品墙与精选项目主资产。
- `public/works/wall/mobile/`：移动端 9:16 作品墙与精选项目主资产。
- `outputs/wall-v2-staging/`：作品墙二阶段生成、QA 与导出产物，仅作为阶段记录和素材参考。

## 相关文档

- `PROMPT.md`：官网优化提示词、页面文案和验收要求。
- `public/generated/IMAGE_PROMPTS.md`：页面生图资产提示词与生成记录。
- `public/works/wall/SOURCES.md`：作品墙素材来源与整理记录。
- `VERIFICATION.md`：早期运行验证记录和品牌方向变更记录。
