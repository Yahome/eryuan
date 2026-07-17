# 二元｜创造想象，实现想象 — Awwwards 风格官网提示词

请在**现有 Next.js 项目**上继续优化，不要重建项目。主题已从「零与一 / 人机对立」校正为：

> **二元 = 创造想象 × 实现想象**  
> 把模糊灵感写成可生成的意图，再把生成结果做成可展示的作品。

网站核心不是解释对立概念，而是：**作品展示 + 生成体验 + 想象落地**。

视觉可参考高端 AI Studio 首页气质：米白网格、巨型中文排版、右侧漂浮拼贴主体、玻璃卡片、酸性黄小面积点缀、手写批注、贴纸与坐标线。  
**不要复制参考图的具体画面、角色、排版或素材。**  
**不要使用牙科内容。**  
**不要把品牌讲成 0/1、黑白对立、人机真假哲学展。**

---

## 品牌定位

### 一句话
**二元，把想象变成作品。**

### 品牌双路径（这才是「二元」）
- **创造想象**：把感觉、文字、参考、风格约束，长成可生成的画面意图  
- **实现想象**：把出图结果推进为角色、场景、风格实验、主视觉与海报作品  

### 气质
- AI 图像生成工作室 / editorial portfolio / creative system  
- 高级、克制、未来感，不要赛博朋克堆料  
- 不要普通 SaaS 官网模板感  

### 文案原则
- 主文案必须中文：标题、段落、按钮、导航  
- 可保留少量装饰英文标签：`STUDIO` / `GALLERY` / `PROMPT` / `OUTPUT` / `SEED`  
- 弃用词库：零与一、0/1、黑白对立、人机、真假、秩序混沌、双生分裂、边界算法  
- 优先词库：想象、成图、作品、提示词、风格、场景、角色、主视觉、落地、展示  

---

## 技术栈（必须保持）

- Next.js App Router + TypeScript + Tailwind CSS  
- GSAP + ScrollTrigger：滚动叙事、pin/scrub、视差、卡片错位  
- Lenis：全站顺滑滚动，并与 ScrollTrigger 同步  
- React Three Fiber：克制粒子层 + WebGL fallback  
- Motion：splash、导航、按钮、卡片、标题入场与 hover  

优先修改：
- `components/BinaryExperience.tsx`
- `components/BinaryParticles.tsx`
- `app/globals.css`
- `app/layout.tsx`
- `public/generated/*`
- `PROMPT.md` / `public/generated/IMAGE_PROMPTS.md`

---

## 页面结构与文案（必须按此实现）

### 0. Meta
- 标题：`二元｜创造想象，实现想象`
- 描述：`二元是面向 AI 生图的创意工作室。从提示词到成图，把想象变成可展示的作品。`

### 1. Splash 启动页
- 米白 / 近白底  
- 左下角数字 `00 → 100`  
- 文案：
  - `正在唤醒想象引擎`
  - `创造 / 实现`
  - 装饰可保留：`PROMPT TO IMAGE`  
- 退场：opacity + clip-path，不要硬切  

### 2. Navbar
- Logo 主字：`二元`  
- Logo 小字：`AI 图像生成工作室`  
- 菜单（中文）：
  - `首页` → `#hero`
  - `作品` → `#works`
  - `方法` → `#method`
  - `生成` → `#generate`
- CTA：`开始生成`
- fixed + 半透明 + backdrop blur  
- 移动端 hamburger + 滑出菜单；打开时禁止 body 滚动  

### 3. 首屏 Hero（`#hero`）
布局：
- 背景：米白网格 + 淡噪声 + 坐标点  
- 左侧超大标题（clamp，极重字重，极紧行高）：

```text
把想象
生成出来
```

- 小标签 / 贴纸：
  - `AI 图像生成工作室`
  - `想象落地界面`
  - `作品从这里长出来`
- 副文案：
  > 二元不只记录灵感，而是把灵感推到可看、可感、可展示的作品状态。
- 主 CTA：`查看作品现场 ↗` 或圆形箭头按钮 + `开始一次生成`
- 右下角作品卡片：
  - 标签：`最新作品`
  - 标题：`雾中玻璃城市，已成图。`
- 右侧主体：大型原创拼贴（SVG/CSS/div），像 AI 生图海报墙，不是对立雕塑图腾  
  - 中心是「生成作品预览」感画面  
  - 周围：提示词碎片、比例角标、酸黄贴纸、箭头、手写批注  
  - 酸黄锚点标签示例：`已生成` / `成图 01`
- 底部 3–4 张紧凑玻璃卡片（流程，不是对立概念）：
  1. `写下想象` — 把模糊感觉变成提示词  
  2. `生成画面` — 快速得到第一版视觉  
  3. `对照精修` — 调风格、构图与情绪  
  4. `输出作品` — 变成海报、主视觉、动效素材  

动效：
- Motion：标题、贴纸、卡片 stagger 入场  
- GSAP：主体轻微 y / rotate / scale 视差  
- R3F：克制背景粒子（想象星尘），有 WebGL fallback  

### 4. 第二屏 作品现场（`#works`）
Masked Cards：多张卡片共享同一张大背景视觉，像工作室作品墙的窗口。

- 屏目标签：`作品现场`
- 主标题：`想象被生成后，就变成可被观看的作品。`
- 副文案：
  > 每一次提示词，都会打开一扇新的画面窗口。下面是成图切片——不是概念对照，而是作品本身。

卡片窗口建议：
1. 主窗口标题：`作品档案`  
2. 大窗口说明 + CTA：`浏览作品`  
3. 大号标题卡：`成图` / `现场`  
4. 底部四格作品分类：

| 编号 | 标题 | 短句 |
|---|---|---|
| 01 | 角色成图 | 从一句话人格，长出可立住的角色形象 |
| 02 | 场景构建 | 把空间、光线与情绪一次生成到位 |
| 03 | 风格实验 | 在写实、插画、时尚之间自由切换 |
| 04 | 主视觉输出 | 让生成结果直接服务海报与品牌画面 |

滚动：
- 卡片从不同方向进入  
- 共享背景轻微放大  
- 编号浮动  
- 移动端堆叠，仍保留拼贴感  

### 5. 第三屏 生成方法（`#method` + `#generate`）
- 左侧大标题：`双路径创作`
- 副标题：`一边创造想象，一边把想象做成作品。`
- 流程四步（状态感标签可保留英文小字）：

| 标签 | 中文 | 说明 |
|---|---|---|
| PROMPT | 输入想象 | 提示词、参考图、风格约束 |
| GENERATE | 生成画面 | 快速出图，捕捉第一印象 |
| REFINE | 对照精修 | 构图、材质、情绪、细节 |
| PUBLISH | 输出作品 | 首页、海报、动效、品牌视觉 |

- 右侧大号「成图预览」窗口（本地 SVG/CSS，不依赖外链图）  
- 小组件：
  - prompt chip：`一座漂浮在雾中的玻璃城市`
  - seed：`2048`
  - ratio：`16:9`
  - style strength：`72%`
  - status：`可导出`
- CTA：
  - 主：`启动一次二元生成`
  - 次：`浏览全部作品`
- 酸黄行动卡：
  - 标题：`从想象到作品`
  - 三行：`写提示词 / 生成画面 / 输出成片`
- 滚动：流程依次点亮、预览 mask reveal、进度线增长  

---

## 素材策略

不要用原牙科图，不要复制参考图。优先：
- SVG / CSS gradient / clip-path / mask / mix-blend / noise  
- 可在 `public/generated/` 维护：
  - `duality-collage-hero.svg`
  - `duality-gallery-field.svg`
  - `duality-system-collage.svg`
  - `duality-signal-01.svg`
  - `duality-signal-02.svg`
  - `duality-thumb.svg`
  - `IMAGE_PROMPTS.md`

视觉语言：
- 米白网格  
- 黑白高对比主体  
- 酸性黄点缀  
- 作品海报墙 / 生成预览窗  
- 提示词碎片、比例角标、种子号、风格强度  
- **不要**零一立方体、黑白分裂头、人机对立图腾作为主叙事  

完整生图提示词见：`public/generated/IMAGE_PROMPTS.md`  
该文件是本提示词的延申，覆盖：
1. 官网本地 SVG 可替换的 AI 成图任务  
2. 作品档案四类（角色 / 场景 / 风格 / 主视觉）扩展出图  
3. 后续接入真实生图接口时的中文 prompt 模板  

---

## 动效与质量要求

### GSAP
- ScrollTrigger 正确注册  
- 与 Lenis 同步  
- scrub 克制  
- unmount 清理，避免重复注册  

### Motion
- Splash 入退场  
- Navbar menu  
- Hero 标题 / 贴纸 / 卡片  
- CTA hover / tap  

### R3F
- 仅 client component  
- 无 hydration mismatch  
- 无 WebGL 时 CSS fallback，console 不报错  

### 响应式
- 375 / 768 / 1440 可用  
- 移动端无横向溢出  
- section 可用 min-h-screen  
- 标题 clamp  

### 代码
- 无 any（极少数 DOM ref 除外）  
- 无外部 UI/icon 库  
- 无远程图片依赖  
- 图片有 alt，交互有可读文本 / aria-label  

### 验收
1. `npm install`  
2. `npm run typecheck`  
3. `npm run build`  
4. `npm run start`  
5. 浏览器检查三屏、移动菜单、滚动、console error / hydration / WebGL  

最终目标：  
把站点做成「有明确艺术方向、作品展示重心、AI 生图概念、滚动叙事与高级交互」的中文 Awwwards 风格官网——  
**创造想象，实现想象。**
