export type WorkCategory = '角色成图' | '场景构建' | '风格实验' | '主视觉输出';

export type WorkAsset = {
  id: string;
  title: string;
  category: WorkCategory;
  description: string;
  prompt: string;
  seed: number;
  ratio: string;
  styleStrength: number;
  accentColor: string;
  motionDepth: number;
  image: string;
  alt: string;
  crop: string;
};

export type MethodStep = {
  tag: 'PROMPT' | 'GENERATE' | 'REFINE' | 'PUBLISH';
  title: string;
  description: string;
};
