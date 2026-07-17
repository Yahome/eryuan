import type { MethodStep, WorkAsset } from './types';

export const navLinks = [
  { label: '首页', href: '#hero' },
  { label: '作品', href: '#works' },
  { label: '方法', href: '#method' },
  { label: '生成', href: '#generate' }
];

export const workAssets: WorkAsset[] = [
  {
    id: 'glass-city',
    title: '雾中玻璃城市',
    category: '主视觉输出',
    description: '一张可直接进入首页、海报和动效分镜的透明城市主视觉。',
    prompt: '一座漂浮在雾中的玻璃城市',
    seed: 2048,
    ratio: '16:9',
    styleStrength: 72,
    accentColor: '#e9ff33',
    motionDepth: 0.72,
    image: '/generated/duality-thumb.jpg',
    alt: '雾中玻璃城市作品缩略图',
    crop: 'center'
  },
  {
    id: 'quiet-character',
    title: '沉静角色档案',
    category: '角色成图',
    description: '从一句人格描述长出的角色形象，保留可延展的服装和情绪线索。',
    prompt: '沉静创作者，黑色结构化外套，米白工作室',
    seed: 1187,
    ratio: '1:1',
    styleStrength: 64,
    accentColor: '#d8dbd2',
    motionDepth: 0.58,
    image: '/generated/duality-signal-01.jpg',
    alt: '角色成图作品切片',
    crop: 'center top'
  },
  {
    id: 'fog-bridge',
    title: '雾中廊桥场景',
    category: '场景构建',
    description: '空间、光线与情绪被一次生成到位，适合作为品牌片场静帧。',
    prompt: '薄雾玻璃廊桥，冷色黎明，远处柔光体块建筑',
    seed: 3091,
    ratio: '1:1',
    styleStrength: 78,
    accentColor: '#b7cbc6',
    motionDepth: 0.86,
    image: '/generated/duality-signal-02.jpg',
    alt: '场景构建作品切片',
    crop: 'center'
  },
  {
    id: 'archive-wall',
    title: '作品墙切片',
    category: '风格实验',
    description: '角色、建筑、材质与海报局部被重新编排为可游走的工作室墙面。',
    prompt: 'AI 图像工作室作品墙，裁切、试色、材质样本',
    seed: 7729,
    ratio: '21:9',
    styleStrength: 69,
    accentColor: '#f0f3e1',
    motionDepth: 0.94,
    image: '/generated/duality-gallery-field.jpg',
    alt: '作品现场共享背景切片',
    crop: 'center'
  },
  {
    id: 'export-console',
    title: '导出前预览窗',
    category: '主视觉输出',
    description: '把最终成图放进可发布窗口，强调可交付、可复用、可展示。',
    prompt: '可导出的 AI 主视觉预览窗口，玻璃城市夜景',
    seed: 6402,
    ratio: '3:4',
    styleStrength: 86,
    accentColor: '#c8f06a',
    motionDepth: 0.66,
    image: '/generated/duality-system-collage.jpg',
    alt: '成图预览窗口作品',
    crop: 'center'
  }
];

export const methodSteps: MethodStep[] = [
  { tag: 'PROMPT', title: '输入想象', description: '提示词、参考图、风格约束被整理成可生成的意图。' },
  { tag: 'GENERATE', title: '生成画面', description: '快速得到第一版视觉，先捕捉最有生命力的方向。' },
  { tag: 'REFINE', title: '对照精修', description: '对构图、材质、情绪和细节做可见的迭代。' },
  { tag: 'PUBLISH', title: '输出作品', description: '把结果推进成首页、海报、动效和品牌主视觉。' }
];
