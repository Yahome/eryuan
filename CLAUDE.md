# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

「二元」中文 AI 图像生成工作室单页官网。品牌主张：**创造想象 × 实现想象**——把模糊灵感变成可展示作品。

- 重心：作品展示 + 生成体验 + 想象落地
- **禁止**叙事：0/1、黑白对立、人机真假、秩序混沌、双生分裂等哲学对立
- 主文案必须中文；可保留少量装饰英文标签（`STUDIO` / `GALLERY` / `PROMPT` / `OUTPUT` / `SEED`）

更完整的文案、验收与视觉约束见 `PROMPT.md`。

## 常用命令

```bash
npm install
npm run dev          # http://localhost:3000
npm run build
npm start
npm run typecheck    # tsc --noEmit
```

当前仓库**没有**测试脚本 / ESLint 配置文件；验证以 `typecheck` + `build` 为准。

环境变量：复制 `.env.example` → `.env.local`，设置：

```bash
NEXT_PUBLIC_CONTACT_URL=https://example.com/contact
# 也支持 http:// 与 mailto:
```

未配置或协议非法时，所有主 CTA 显示不可点击的「联系方式待配置」，不会暴露占位地址。读取逻辑在 `components/binary/contact.ts`。

## 架构

单页 App Router 站点，几乎全部交互在客户端。

```
app/page.tsx                    → 渲染 BinaryExperience
components/BinaryExperience.tsx → 页面编排中枢（Splash 状态、全局 GSAP ScrollTrigger、Footer）
components/SmoothScroll.tsx     → Lenis + GSAP ticker / ScrollTrigger 桥接
components/BinaryParticles.tsx  → R3F 粒子层；WebGL 不可用时 CSS 降级
components/binary/              → 分区 UI + 静态数据
  Navbar / SplashScreen / HeroStage / WorksGallery / GenerationMethod
  contact.ts / assets.ts / wallAssets.ts / projectAssets.ts / types.ts / Icons.tsx
```

### 页面分区（锚点）

| 区块 | id | 组件 |
|------|-----|------|
| Splash | — | `SplashScreen`（完成后卸载） |
| 导航 | — | `Navbar`（`#hero` `#works` `#method` `#generate`） |
| 首屏 | `#hero` | `HeroStage`（作品墙自动滚动 + GSAP Flip 预览） |
| 作品 | `#works` | `WorksGallery`（精选项目粘性索引） |
| 方法/生成 | `#method` `#generate` | `GenerationMethod`（双路径 + 生成控制台） |
| 页脚 | `#contact` | 写在 `BinaryExperience` 内 |

### 动效分层（易踩坑）

- **Lenis**：`SmoothScroll` 关闭 `autoRaf`，用 `gsap.ticker` 驱动 `lenis.raf`，并在 scroll 时 `ScrollTrigger.update()`
- **全局 scrub 叙事**：`BinaryExperience` 的 `useGSAP` 处理 `[data-story]`、`.hero-parallax-layer`、`.method-step`、`.generation-preview` 等
- **分区局部动效**：Hero 视差、墙循环、Flip 在 `HeroStage`；Motion 负责 Splash / 导航 / 入场 / hover
- **减少动效**：`MotionConfig reducedMotion="user"`；`prefers-reduced-motion` 时跳过 Lenis 与部分 GSAP
- **不要**在正文/副文案 scrub 上使用 `filter: blur`（会严重影响可读性）
- Hero 视差必须落在独立层（`.hero-parallax-layer`），避免与 pointer-follow / Motion transform 打架导致滚动抖动

### 作品与资产数据

- `wallAssets.ts`：`allWallTiles`，每项含 `mobile`（9:16）与 `desktop`（16:9）路径；同 `series` 不宜在同一列相邻
- `projectAssets.ts`：Works 区四个精选项目
- `assets.ts`：导航链接、Method 步骤、生成控制台用的 `workAssets`（提示词芯片切换）
- 页面消费主路径：
  - `public/works/wall/desktop/*.webp`、`public/works/wall/mobile/*.webp`
  - `public/generated/*`（JPG/SVG + `IMAGE_PROMPTS.md`）
- `public/works/wall/` 根目录下仍有旧 JPG 素材与 `SOURCES.md`；`outputs/` 为 QA/阶段产物，非运行时依赖

### 视觉与字体

- 色板：纸色 `#f6f4ef`、墨色 `#050505`、酸性黄 `#e9ff33`（见 `app/globals.css` CSS 变量）
- 中文显示字体经 `app/layout.tsx` 从 `cn-font.claude-code-best.win` 加载（优设标题黑、极影毁片文宋）
- 无外部 UI/icon 库；图标在 `components/binary/Icons.tsx`

### 路径别名

`@/*` → 仓库根目录（`tsconfig.json`）。

## 修改时优先关注

优化页面时优先：`components/BinaryExperience.tsx`、`components/binary/*`、`components/BinaryParticles.tsx`、`app/globals.css`、`app/layout.tsx`、`public/generated/*`、`PROMPT.md`。

改文案/品牌方向前先对照 `PROMPT.md` 的弃用词库与必用结构，避免把站点写回对立哲学叙事。
