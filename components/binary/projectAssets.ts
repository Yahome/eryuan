export type SelectedProject = {
  id: string;
  title: string;
  year: string;
  tags: [string, string, string];
  description: string;
  desktopImage: string;
  mobileImage: string;
  alt: string;
};

export const selectedProjects: SelectedProject[] = [
  {
    id: 'brand-visual',
    title: '品牌视觉',
    year: '2026',
    tags: ['BRAND', 'IDENTITY', 'CAMPAIGN'],
    description: '从品牌性格与识别线索出发，把一句创意方向生成成可延展的主视觉与传播资产。',
    desktopImage: '/works/wall/desktop/brand-ip-01.webp',
    mobileImage: '/works/wall/mobile/brand-ip-01.webp',
    alt: '蜜屿蜂蜜品牌视觉与包装 Campaign'
  },
  {
    id: 'product-package',
    title: '产品包装',
    year: '2026',
    tags: ['PACKAGE', 'SYSTEM', 'SHELF'],
    description: '围绕品牌识别、包装系统与货架场景，把生成画面推进为可落地的商业视觉。',
    desktopImage: '/works/wall/desktop/brand-ip-02.webp',
    mobileImage: '/works/wall/mobile/brand-ip-02.webp',
    alt: '柑岁堂柑橘品牌包装系列 Campaign'
  },
  {
    id: 'ecommerce-conversion',
    title: '电商转化',
    year: '2026',
    tags: ['ECOMMERCE', 'DETAIL', 'CONVERSION'],
    description: '用明确的产品焦点、情绪对比与卖点层级，建立从第一眼到行动的转化路径。',
    desktopImage: '/works/wall/desktop/product-split-01.webp',
    mobileImage: '/works/wall/mobile/product-split-01.webp',
    alt: 'NOVA 智能腕表分裂现实产品广告'
  },
  {
    id: 'aigc-visual',
    title: 'AIGC 视觉',
    year: '2026',
    tags: ['AIGC', 'KEY VISUAL', 'MOTION'],
    description: '以生成式图像扩展构图、材质与叙事，再把关键帧整理成可进入动效的视觉系统。',
    desktopImage: '/generated/duality-gallery-field.jpg',
    mobileImage: '/generated/duality-collage-hero.jpg',
    alt: '二元 AIGC 玻璃城市与视觉实验作品墙'
  }
];
