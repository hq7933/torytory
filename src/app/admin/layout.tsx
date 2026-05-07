import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "토리토리 관리자",
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const auth = cookieStore.get("admin_auth")?.value;
  const isLogin = auth === process.env.ADMIN_PASSWORD;

  if (!isLogin) return <>{children}</>;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* 사이드바 */}
      <aside className="w-56 bg-[#3D2314] text-white flex flex-col">
        <div className="p-5 border-b border-[#5C3A1E]">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="토리토리" width={36} height={36} className="rounded-full" />
            <div>
              <p className="font-bold text-sm">토리토리</p>
              <p className="text-[10px] text-[#C8956C]">관리자</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link href="/admin" className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm hover:bg-[#5C3A1E] transition-colors">
            🏠 대시보드
          </Link>
          <Link href="/admin/menus" className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm hover:bg-[#5C3A1E] transition-colors">
            🍪 메뉴 관리
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm hover:bg-[#5C3A1E] transition-colors">
            ⚙️ 설정
          </Link>
          <a href="/" target="_blank" className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm hover:bg-[#5C3A1E] transition-colors">
            🌐 사이트 보기
          </a>
        </nav>
        <div className="p-4 border-t border-[#5C3A1E]">
          <form action="/api/admin/logout" method="POST">
            <button type="submit" className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-[#C8956C] hover:bg-[#5C3A1E] transition-colors">
              🚪 로그아웃
            </button>
          </form>
        </div>
      </aside>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
