# 二元官网 · 生图提示词延申

> 本文件是 `PROMPT.md` 的视觉/生图任务延申。  
> 品牌核心：**创造想象 × 实现想象**，重点是作品展示，不是 0/1、黑白、人机对立。  
> 所有提示词以中文为主，可直接投喂 AI 生图接口；生成后可替换 `public/generated/` 内对应 SVG 占位资产。
>
> 2026-07-09：已重新生成并覆盖 6 张页面消费的 JPG 生产素材；原始 PNG 与生成 manifest 保存在 `outputs/imagegen/generative-polish/er-yuan-site-assets-v2/`。

---

## 使用约定

- 风格关键词统一附加：`editorial web design`、`Awwwards style`、`high fashion technology`、`clean but surreal`、`premium AI image studio`、`soft cinematic light`、`米白网格背景`、`酸性黄小面积点缀`
- 避免：赛博朋克霓虹堆料、牙科内容、直接复刻参考图角色/构图、大段英文主文案出现在画面中
- 画面内如需文字，优先中文短标签：`已成图`、`作品 01`、`提示词`、`成图预览`
- 输出比例建议：
  - 首屏主视觉：`4:5` 或 `3:4`（右侧大主体）
  - 作品场共享背景：`16:9` 或 `21:9`
  - 方法页预览窗：`3:4` 竖版
  - 缩略图：`4:3`

---

## A. 官网核心资产（替换本地 SVG）

### A1. 首屏主视觉 → `duality-collage-hero.svg`
**任务名：** 想象作品墙 · Hero 拼贴主体

```text
米白色精细网格背景，Awwwards 级 AI 生图工作室官网首屏右侧主视觉。
中央是一张高质量「已生成作品」海报感画面：一座漂浮在薄雾中的透明玻璃城市，建筑边缘有柔和体积光，画面干净、超现实但克制。
周围漂浮作品工作室元素：圆角玻璃小卡片、提示词碎片标签、16:9 比例角标、seed 数字角标、酸性荧光黄小贴纸写着「已成图」、黑色细箭头、手写中文批注「把想象生成出来」、淡扫描线与轻微胶片颗粒。
整体像 editorial portfolio 拼贴，而不是科技对立图腾。
黑白为主，少量紫色笔触与酸性黄点缀。柔和阴影，高级留白，超清，no dental, no cyberpunk overload, no English body copy.
```

### A2. 第二屏共享背景 → `duality-gallery-field.svg`
**任务名：** 作品档案场 · Masked Cards 底图

```text
超宽 editorial 拼贴场，供多个圆角卡片共享同一背景。
画面由多张 AI 成图切片拼贴而成：角色半身像切片、雾中建筑场景、材质特写、海报主视觉局部，彼此错位重叠，像工作室作品墙。
加入淡网格、采样框、坐标点、轻微噪声与扫描线；角落有中文短标签「角色」「场景」「风格」「主视觉」。
米白与黑白高对比，少量酸性黄标记点，整体统一、高级、适合做 masked window 背景。
Awwwards gallery layout, clean high contrast, Chinese visual identity, no English body text.
```

### A3. 第三屏系统/预览 → `duality-system-collage.svg`
**任务名：** 成图预览窗 · 方法页大视觉

```text
竖版 AI 成图预览窗口视觉。
中央是一张完成度很高的生成作品：玻璃城市夜景被柔光包裹，像可导出的品牌主视觉。
界面感叠加：顶部细状态条、prompt chip「一座漂浮在雾中的玻璃城市」、seed 2048、ratio 16:9、风格强度 72%、右上角「可导出」小标签。
背景是米白到浅灰的网格与淡噪声，边缘有玻璃拟态面板和一条酸性黄进度线。
气质：creative system UI + portfolio preview，不是黑白分裂头像。cinematic soft light, premium AI website, no English paragraphs.
```

### A4. 信号卡 01 → `duality-signal-01.svg`
**任务名：** 角色成图切片

```text
方形作品切片，AI 生成时尚角色半身像，面部安静有神，服装有未来织物感但不过分科幻。
背景简约米灰，有轻微网格与胶片颗粒。
左下角中文小标签「角色成图 / 01」。
高级摄影棚光，clean surreal, editorial portrait, no text-heavy UI.
```

### A5. 信号卡 02 → `duality-signal-02.svg`
**任务名：** 场景构建切片

```text
方形作品切片，广阔但克制的超现实场景：薄雾、玻璃廊桥、远处柔光体块建筑。
强调空间、光线与情绪，而不是信息图表。
左下角中文小标签「场景构建 / 02」。
cinematic atmosphere, soft fog, premium still, no cyberpunk neon mess.
```

### A6. 首屏缩略图 → `duality-thumb.svg`
**任务名：** 最新作品缩略

```text
小尺寸 4:3 作品缩略图，展示「雾中玻璃城市」成图结果。
构图完整、可一眼识别，像作品集封面。
右下角极小酸黄点，无大段文字。clean, iconic, portfolio thumbnail.
```

---

## B. 作品档案四类扩展（第二屏内容延申）

### B1. 角色成图
```text
从一句话人格长出可立住的角色：一位沉静的年轻创作者，穿着结构化黑色大衣，站在米白工作室背景前，眼神望向画外光源。
皮肤质感真实，服装有微弱未来剪裁，整体像 AI 角色设定成品而非概念草图。
配小标签「角色成图」。editorial character sheet energy, high fashion technology, clean background.
```

### B2. 场景构建
```text
把空间、光线与情绪一次生成到位：黎明时分的室内展厅，地面有浅浅水反射，窗外是雾中城市轮廓，空气里有丁达尔光。
像可直接用于品牌片场的场景静帧。soft volumetric light, architectural calm, surreal but believable.
```

### B3. 风格实验
```text
同一主体的三风格并置试色板：写实摄影 / 时尚插画 / 极简渲染。
主体是一枚透明玻璃雕塑花，背景米白网格，酸黄记号笔标注「风格强度」。
像工作室墙面上的风格对照样品，而不是好坏对立。clean experimental board, premium studio aesthetic.
```

### B4. 主视觉输出
```text
可直接做海报的主视觉：巨大中文标题留白区在左，右侧是玻璃城市与人物剪影的合成画面。
有出版级排版呼吸感，酸黄小贴纸「可发布」。
Awwwards poster, Chinese editorial layout, high contrast, museum-quality finish.
```

---

## C. 方法页流程配图（第三屏延申）

### C1. PROMPT · 输入想象
```text
极简桌面俯拍：笔记本手写几行中文提示词，旁边是参考照片拍立得与色卡，一杯水，米白桌面。
气质是「想象开始被写下」。documentary soft light, quiet creative ritual.
```

### C2. GENERATE · 生成画面
```text
屏幕中正在显现的图像：从噪声颗粒逐渐清晰成玻璃城市轮廓，界面只有克制进度与 seed。
强调「第一印象正在成形」。UI is minimal, image is hero, no clutter.
```

### C3. REFINE · 对照精修
```text
左右两版成图轻微差异：构图更紧、材质更通透、情绪更冷。
中间有细线与中文「精修」。studio comparison board, elegant, not scientific dashboard.
```

### C4. PUBLISH · 输出作品
```text
最终作品被装进圆角预览窗，下方是导出条与「作品已就绪」酸黄标签。
像发布前最后一眼。premium export screen, calm confidence.
```

---

## D. 可复用中文 Prompt 模板（接入真实生图接口）

### 模板 1 · 作品向通用
```text
【主题】{一句话想象}
【类型】角色成图 / 场景构建 / 风格实验 / 主视觉输出
【风格】editorial, clean surreal, high fashion technology, Awwwards web visual
【背景】米白网格或浅灰留白，克制噪声
【点缀】少量酸性黄标签，可有中文短词：已成图 / 作品 0X
【禁止】赛博朋克过载、牙科元素、大段英文、零一对立图腾
【质量】超清，柔和电影光，高级阴影，可作官网作品卡
```

### 模板 2 · 品牌主视觉
```text
为「二元」AI 图像生成工作室生成一张官网主视觉：
表达「创造想象，实现想象」，画面是可展示的作品本身，而不是抽象符号堆叠。
左侧预留中文大标题空间，右侧是完成度高的生成图像主体。
米白网格，黑白高对比，酸性黄小面积点缀，玻璃与薄雾材质，editorial portfolio 气质。
```

### 模板 3 · 作品集封面
```text
生成一张作品集封面图，标题感来自画面而非文字堆砌。
主体：{作品描述}
副气质：把想象变成作品，工作室档案，干净、超现实、可发布。
```

---

## E. 与页面锚点的映射

| 页面位置 | 本地文件 | 推荐生图任务 | 状态 |
|---|---|---|---|
| Hero 右侧主体 | `duality-collage-hero.jpg` | A1 | ✅ 已生成并接入 |
| 作品现场 Masked Cards | `duality-gallery-field.jpg` | A2 | ✅ 已生成并接入 |
| 方法页大预览 | `duality-system-collage.jpg` | A3 | ✅ 已生成并接入 |
| 方法页小卡 | `duality-signal-01/02.jpg` | A4 / A5 | ✅ 已生成并接入 |
| Hero 最新作品缩略 | `duality-thumb.jpg` | A6 | ✅ 已生成并接入 |
| 作品四分类扩展 | 可新增 `works-*.png` | B1–B4 | 待扩展 |
| 流程叙事扩展 | 可新增 `method-*.png` | C1–C4 | 待扩展 |

> 说明：页面关键文案（「已成图」「提示词」「可导出」等）由前端 UI 叠加，生图时尽量不依赖画面内精确文字。旧版 `.svg` 占位仍保留在目录中作备份，线上组件已切换为重新生成后的 `.jpg`。

---

## F. 负面提示（建议统一附加）

```text
low quality, blurry, deformed hands, extra fingers, watermark, logo spam,
cyberpunk neon overload, dental clinic, teeth, medical tools,
binary zero one cubes, black-white split face gimmick, chaotic collage mess,
heavy English paragraphs, UI screenshot noise, stock photo look
```
