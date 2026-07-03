# Figma 动效验收说明 · 二元 Eryuan Landing Page

> 用途：把代码中的真实滚动动效映射回 Figma 的 4 个关键状态，用于确认 Hero、创作之门转场、成果 Gallery 是否与设计方向一致。

## 当前结论

动态方向已到位，适合继续作为 Awwwards 风格首页原型推进：

- 第一屏不是死图：已包含光影漂移、空气尘埃、画布呼吸、文字入场、鼠标视差。
- 滚动不是普通切页：已用 GSAP ScrollTrigger pin / scrub + 420vh 滚动叙事实现镜头推近。
- 创作之门已预留正式视频：ScrollTrigger 的滚动进度会控制 `video.currentTime`，替换正式视频后即可获得撕裂/粉尘/展开效果。
- 成果展示页已进入“电影感展厅”方向：卡片依次浮现，横向轻微移动，hover 展示 Prompt 信息。

需要注意：Figma 原型无法完整还原浏览器里的 `scroll-scrub video.currentTime` 效果，所以 Figma 只建议验收关键状态；真实手感以浏览器运行为准。

---

## Figma 推荐保留的 4 个关键状态

### Frame 01 — Hero 静止状态

对应代码滚动进度：`0%`

视觉要求：

- 极简画室背景稳定。
- 中央画布干净，显示「二元」「开始创作」。
- 左下角文案可见。
- 顶部导航可见。
- 整体光线克制，不要过亮。

代码状态：

```txt
hero-ui-opacity: 1
canvas-scale: 1
canvas-opacity: 1
reveal-opacity: 0
gallery-opacity: 0
```

动效：

```txt
light-wash: 9s ease-in-out alternate infinite
canvas-breathe: 5.6s ease-in-out alternate infinite
dust-float: 4s - 8s ease-in-out alternate infinite
mouse-parallax: canvas rotateX ±2.2deg, rotateY ±2.4deg
```

验收：通过。

---

### Frame 02 — Scroll 30%，镜头推近画布

对应代码滚动进度：约 `30% - 32%`

视觉要求：

- 顶部导航与左下角文案已基本淡出。
- 画布从原位置向中心移动。
- 画布放大，背景轻微模糊。
- 「二元」字距拉开并淡出，强调即将进入创作状态。

代码状态参考：

```txt
hero-ui-opacity: 0
canvas-scale: ~1.17
canvas-opacity: 1
canvas-title-opacity: 0
reveal-opacity: ~0.74
video-progress: ~20%
gallery-opacity: 0
```

验收：通过。

---

### Frame 03 — Scroll 60%，创作之门展开

对应代码滚动进度：约 `58% - 62%`

视觉要求：

- Hero 画布几乎退出。
- reveal poster / video 层占据主视觉。
- 正式视频替换后，应在这里看到画布撕裂、粉尘、纸屑、背后世界展开。
- 背景变暗，形成电影转场感。

代码状态参考：

```txt
canvas-scale: 1.36
canvas-opacity: ~0.39 到 0
reveal-opacity: 1
video-opacity: 0.96
video-progress: ~97% 到 100%
gallery-opacity: 0
```

验收：结构通过；最终质感取决于你后续替换的正式视频质量。

---

### Frame 04 — Scroll 80% - 100%，生成成果展厅

对应代码滚动进度：约 `82% - 100%`

视觉要求：

- 画室已转入暗色 Gallery。
- 左侧出现「生成成果 / 灵感展厅 / 分类」。
- 右侧作品卡片像展览墙一样浮现。
- 作品不是普通网格，而是有前后层次、大小错落和横向位移。

代码状态参考：

```txt
gallery-opacity: 1
gallery-y: 0%
works-x: 0px → -12vw
work-card: opacity 0 → 1, y 96px → 0, rotateY -12deg → 0deg
```

验收：通过。

---

## 动效验收矩阵

| 模块 | 状态 | 结论 |
|---|---:|---|
| Hero 画面静止氛围 | 已实现 | 到位 |
| 光影漂移 | 已实现 | 到位 |
| 空气尘埃 | 已实现 | 到位，但粒子保持克制是对的 |
| 画布呼吸感 | 已实现 | 到位 |
| 鼠标视差 | 已实现 | 到位 |
| GSAP Pin / Scrub 叙事 | 已实现 | 到位 |
| 导航、文案淡出 | 已实现 | 到位 |
| 镜头推近画布 | 已实现 | 到位 |
| 创作之门视频占位 | 已实现 | 待正式视频替换 |
| 视频随滚动 scrub | 已实现 | 到位 |
| Gallery 淡入 | 已实现 | 到位 |
| 作品卡片依次浮现 | 已实现 | 到位 |
| Gallery 横向轻移 | 已实现 | 到位 |
| 移动端适配 | 已实现 | 可用，建议真机复核 |
| Reduced Motion 兼容 | 已实现 | 到位 |

---

## 需要在 Figma 中注意的点

1. 不建议在 Figma 里做成普通“向下切换页面”。这套页面的核心是滚动中镜头推近，因此 Figma 只做关键帧表达即可。
2. Figma 的 Smart Animate 可以模拟 Frame 01 → 02 → 03 → 04，但不能准确模拟浏览器中的滚动控制视频播放。
3. 「二元」「开始创作」「导航」「左下角文案」应继续保持为真实文字，不要烘焙在图片里。
4. 第二段视频需要第一帧接近 Hero 画布，最后一帧接近暗色 Gallery，否则转场会断。
5. Gallery 作品图建议在 Figma 中保持大图错落排布，不要改成传统卡片网格。

---

## Figma Prototype 推荐设置

```txt
Frame 01 → Frame 02
Trigger: On drag / Mouse wheel mock
Animation: Smart Animate
Duration: 900ms
Easing: Ease out

Frame 02 → Frame 03
Trigger: After delay or On drag
Animation: Dissolve + Smart Animate
Duration: 1000ms
Easing: Ease in-out

Frame 03 → Frame 04
Trigger: On drag
Animation: Smart Animate
Duration: 1100ms
Easing: Ease out
```

真实网页里不用这些时长，真实网页已经由滚动进度控制。

---

## 正式视频替换提醒

覆盖以下两个文件即可：

```txt
public/videos/canvas-reveal.webm
public/videos/canvas-reveal.mp4
```

替换后不用改代码。

推荐视频规格：

```txt
16:9
2.5s - 4s
24fps / 30fps
无声或 muted
第一帧：接近 Hero 空白画布
最后一帧：接近深色成果展厅
```
