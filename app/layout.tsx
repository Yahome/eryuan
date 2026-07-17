import type { Metadata, Viewport } from 'next';
import 'lenis/dist/lenis.css';
import './globals.css';

export const metadata: Metadata = {
  title: '二元｜创造想象，实现想象',
  description: '二元是面向 AI 生图的创意工作室。从提示词到成图，把想象变成可展示的作品。',
  icons: {
    icon: '/brand/er-yuan-favicon.svg',
    apple: '/brand/er-yuan-favicon.svg'
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://cn-font.claude-code-best.win" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://ik.imagekit.io" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://cn-font.claude-code-best.win/packages/ysbth/dist/%E4%BC%98%E8%AE%BE%E6%A0%87%E9%A2%98%E9%BB%91/result.css"
        />
        <link
          rel="stylesheet"
          href="https://cn-font.claude-code-best.win/packages/jyhpws/dist/%E6%9E%81%E5%BD%B1%E6%AF%81%E7%89%87%E6%96%87%E5%AE%8B/result.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
