export type WallTile = {
  id: string;
  /** 9:16 portrait — mobile */
  mobile: string;
  /** 16:9 landscape — desktop */
  desktop: string;
  alt: string;
  title: string;
  crop: string;
  /** Same prompt / source series — must not sit next to each other in a column */
  series: string;
};

/** Frame: mobile 9:16, desktop 16:9 */
export const WALL_FRAME_CLASS = 'aspect-[9/16] w-full md:aspect-video';

function tile(
  id: string,
  file: string,
  title: string,
  alt: string,
  series: string,
  crop = 'center'
): WallTile {
  return {
    id,
    mobile: `/works/wall/mobile/${file}`,
    desktop: `/works/wall/desktop/${file}`,
    title,
    alt,
    crop,
    series
  };
}

/**
 * Flat pool — not column-bound by category.
 * series = source batch / prompt family (from yahome-wiki posts).
 */
export const allWallTiles: WallTile[] = [
  // 产品转化 — 分裂现实 Campaign
  tile('product-split-01', 'product-split-01.webp', '掌控之境', 'NOVA 智能腕表分裂现实产品广告', 'product-split'),
  tile('product-split-02', 'product-split-02.webp', '风味分界', 'CRISP 零食罐风味世界产品广告', 'product-split'),
  tile('product-split-03', 'product-split-03.webp', '时间双境', 'AUREL 腕表昼夜双境产品广告', 'product-split'),
  tile('product-split-04', 'product-split-04.webp', '晨光重启', 'MORRA 烤面包机晨间产品广告', 'product-split'),
  // 餐饮升级
  tile('food-upgrade-01', 'food-upgrade-01.webp', '南洋早午餐', '南洋早午餐品牌商业主视觉', 'food-upgrade'),
  tile('food-upgrade-02', 'food-upgrade-02.webp', '炭火夜宴', '炭火料理夜宴商业主视觉', 'food-upgrade'),
  tile('food-upgrade-03', 'food-upgrade-03.webp', '一盏茶的下午', '东方茶点下午茶商业主视觉', 'food-upgrade'),
  tile('food-upgrade-04', 'food-upgrade-04.webp', '夏日酸辣', '夏日酸辣菜品商业主视觉', 'food-upgrade'),
  // 香氛美妆
  tile('fragrance-01', 'fragrance-01.webp', '晨光白花', '白花香调晨光香氛 Campaign', 'fragrance'),
  tile('fragrance-02', 'fragrance-02.webp', '夜色玫瑰', '玫瑰香调夜色香氛 Campaign', 'fragrance'),
  tile('fragrance-03', 'fragrance-03.webp', '柑橘雪松', '柑橘与雪松香调产品 Campaign', 'fragrance'),
  tile('fragrance-04', 'fragrance-04.webp', '乌木皮革', '乌木与皮革香调产品 Campaign', 'fragrance'),
  // 时尚视觉
  tile('fashion-dream-01', 'fashion-dream-01.webp', '粉绿梦核', '粉绿双色梦核时尚 Campaign', 'fashion-dream'),
  tile('fashion-dream-02', 'fashion-dream-02.webp', '水感胶片', '水感胶片质感时尚 Campaign', 'fashion-dream'),
  tile('fashion-editorial-01', 'fashion-editorial-01.webp', '色块街头', '几何色块街头时尚 Campaign', 'fashion-editorial'),
  tile('fashion-editorial-02', 'fashion-editorial-02.webp', '字体蒙版', '字体蒙版编辑时尚 Campaign', 'fashion-editorial'),
  // 品牌包装
  tile('brand-ip-01', 'brand-ip-01.webp', '蜜屿风物', '蜜屿蜂蜜品牌包装与物料 Campaign', 'brand-ip'),
  tile('brand-ip-02', 'brand-ip-02.webp', '柑岁陈香', '柑岁堂柑橘品牌包装 Campaign', 'brand-ip'),
  tile('brand-tea-01', 'brand-tea-01.webp', '青提白茶', '青提白茶新中式饮品包装主视觉', 'brand-tea'),
  tile('brand-tea-02', 'brand-tea-02.webp', '桂雪米乳', '桂花米乳新中式饮品包装主视觉', 'brand-tea'),
  // 空间地产
  tile('space-estate-01', 'space-estate-01.webp', '城市天际线', '城市天际线高端地产 Campaign', 'space-estate'),
  tile('space-estate-02', 'space-estate-02.webp', '湖居公园', '湖居公园高端地产 Campaign', 'space-estate'),
  tile('space-estate-03', 'space-estate-03.webp', '东方院落', '暗金东方院落空间 Campaign', 'space-estate'),
  tile('space-expo-01', 'space-expo-01.webp', '东方香氛展台', '东方香氛品牌展台空间提案', 'space-expo')
];

function createRng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s ^ (s >>> 15), s | 1) + Math.imul(s ^ (s >>> 7), s | 61) ^ s) >>> 0;
    return s / 4294967296;
  };
}

function shuffleInPlace<T>(arr: T[], rng: () => number) {
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = arr[i];
    arr[i] = arr[j]!;
    arr[j] = tmp!;
  }
  return arr;
}

/**
 * Shuffle so tiles from the same `series` are never adjacent in the linear order.
 * Falls back to any remaining series only when stuck.
 */
export function shuffleAvoidingSeriesRuns(items: WallTile[], seed = Date.now()): WallTile[] {
  const rng = createRng(seed);
  const groups = new Map<string, WallTile[]>();

  for (const item of items) {
    const list = groups.get(item.series) ?? [];
    list.push(item);
    groups.set(item.series, list);
  }

  for (const list of groups.values()) {
    shuffleInPlace(list, rng);
  }

  const result: WallTile[] = [];
  const remaining = items.length;

  while (result.length < remaining) {
    const lastSeries = result.length > 0 ? result[result.length - 1]!.series : null;
    const available = [...groups.entries()].filter(([, list]) => list.length > 0);
    if (available.length === 0) break;

    let candidates = available.filter(([series]) => series !== lastSeries);
    if (candidates.length === 0) candidates = available;

    // Prefer fuller queues; use precomputed tie-breakers so the comparator stays pure
    // and the seeded SSR order is identical during client hydration.
    const rankedCandidates = candidates
      .map((entry) => ({ entry, tieBreaker: rng() }))
      .sort((a, b) => b.entry[1].length - a.entry[1].length || a.tieBreaker - b.tieBreaker);
    candidates = rankedCandidates.map(({ entry }) => entry);
    const pickIndex = Math.min(candidates.length - 1, Math.floor(rng() * Math.min(3, candidates.length)));
    const [, queue] = candidates[pickIndex]!;
    const next = queue.shift();
    if (next) result.push(next);
  }

  return result;
}

/** Desktop wall density; mobile renders a 3-column slice in HeroStage. */
export const WALL_DESKTOP_COLUMN_COUNT = 4;

export type WallColumns = WallTile[][];

/**
 * Deal shuffled tiles into N columns while keeping
 * "no two same series consecutive" inside each column.
 */
export function buildRandomWallColumns(
  items: WallTile[] = allWallTiles,
  seed = Date.now(),
  columnCount = WALL_DESKTOP_COLUMN_COUNT
): WallColumns {
  const shuffled = shuffleAvoidingSeriesRuns(items, seed);
  const cols: WallColumns = Array.from({ length: columnCount }, () => []);

  for (const item of shuffled) {
    let bestCol = 0;
    let bestScore = -Infinity;

    for (let c = 0; c < columnCount; c += 1) {
      const col = cols[c]!;
      const last = col[col.length - 1];
      const sameSeries = Boolean(last && last.series === item.series);
      // prefer not same series; among equals prefer shorter column
      const score = (sameSeries ? -1000 : 0) - col.length * 2;
      if (score > bestScore) {
        bestScore = score;
        bestCol = c;
      }
    }

    cols[bestCol]!.push(item);
  }

  // Final pass: if any column still has consecutive series, try local swaps with other columns
  for (let c = 0; c < columnCount; c += 1) {
    const col = cols[c]!;
    for (let i = 1; i < col.length; i += 1) {
      if (col[i]!.series !== col[i - 1]!.series) continue;
      for (let d = 0; d < columnCount; d += 1) {
        if (d === c) continue;
        const other = cols[d]!;
        for (let j = 0; j < other.length; j += 1) {
          const candidate = other[j]!;
          if (candidate.series === col[i - 1]!.series) continue;
          if (i + 1 < col.length && candidate.series === col[i + 1]!.series) continue;
          const prev = j > 0 ? other[j - 1] : null;
          const next = j + 1 < other.length ? other[j + 1] : null;
          if (prev && prev.series === col[i]!.series) continue;
          if (next && next.series === col[i]!.series) continue;
          // swap
          other[j] = col[i]!;
          col[i] = candidate;
          break;
        }
        if (col[i]!.series !== col[i - 1]!.series) break;
      }
    }
  }

  return cols;
}

/** Deterministic default for SSR / first paint (no consecutive series). */
export function getWallColumns(columnCount = WALL_DESKTOP_COLUMN_COUNT): WallColumns {
  const byId = new Map(allWallTiles.map((item) => [item.id, item]));
  const initialOrder = [
    'product-split-01', 'food-upgrade-01', 'fragrance-01', 'fashion-dream-01', 'brand-ip-01', 'space-estate-01',
    'product-split-02', 'food-upgrade-02', 'fragrance-02', 'fashion-dream-02', 'brand-ip-02', 'space-estate-02',
    'product-split-03', 'food-upgrade-03', 'fragrance-03', 'fashion-editorial-01', 'brand-tea-01', 'space-estate-03',
    'product-split-04', 'food-upgrade-04', 'fragrance-04', 'fashion-editorial-02', 'brand-tea-02', 'space-expo-01'
  ];
  const ordered = initialOrder.map((id) => byId.get(id)!);

  return Array.from({ length: columnCount }, (_, col) =>
    ordered.filter((_, index) => index % columnCount === col)
  );
}
