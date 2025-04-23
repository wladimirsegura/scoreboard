'use client';

import Link from 'next/link';
import { AuthNav } from '@/components/auth/auth-nav';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#1F2937] text-[#F3F4F6]">
      {/* Navigation Bar */}
      <nav className="bg-[#111827] border-b border-[#1E3A8A] p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-[#F3F4F6] hover:text-white transition">
            Scoreboard App
          </Link>
          <div className="flex gap-6">
            <Link href="/scoreboard" className="text-[#F3F4F6] hover:text-white transition">
              Scoreboard
            </Link>
            <Link href="/teams" className="text-[#F3F4F6] hover:text-white transition">
              Teams
            </Link>
            <AuthNav />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8 text-center">函南ネオホッケーナイターリーグ</h1>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Scoreboard Card */}
          <Link href="/scoreboard" 
            className="block p-6 bg-[#111827] rounded-lg border border-[#1E3A8A] hover:border-[#3B82F6] transition-colors"
          >
            <h2 className="text-2xl font-semibold mb-4">スコアボード</h2>
            <p className="text-gray-400">リアルタイムで試合のデータ記録します,ゴール、アシスト</p>
          </Link>

          {/* Teams Card */}
          <Link href="/teams" 
            className="block p-6 bg-[#111827] rounded-lg border border-[#1E3A8A] hover:border-[#3B82F6] transition-colors"
          >
            <h2 className="text-2xl font-semibold mb-4">チーム名簿</h2>
            <p className="text-gray-400">チーム名簿, プレイヤーの成績</p>
          </Link>
        </div>
      </div>
    </div>
  );
}