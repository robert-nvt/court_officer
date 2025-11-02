import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { QuizProvider } from '@/contexts/QuizContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Thi Trắc Nghiệm Lý luận Chính trị',
  description: 'Ứng dụng thi trắc nghiệm lý luận chính trị với các câu hỏi từ Hiến pháp 2013, Luật Cán bộ công chức và Luật Tổ chức Tòa án nhân dân',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <QuizProvider>
          {children}
        </QuizProvider>
      </body>
    </html>
  );
}