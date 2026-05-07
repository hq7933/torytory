import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default async function AdminDashboard() {
  const [{ count: menuCount }, { count: categoryCount }, { data: soldOutMenus }] =
    await Promise.all([
      supabase.from("menus").select("*", { count: "exact", head: true }).eq("active", true),
      supabase.from("categories").select("*", { count: "exact", head: true }),
      supabase.from("menus").select("name").eq("sold_out", true).eq("active", true),
    ]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-black text-gray-800 mb-8">대시보드</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500 mb-1">전체 메뉴</p>
          <p className="text-4xl font-black text-[#E0A800]">{menuCount ?? 0}</p>
          <p className="text-xs text-gray-400 mt-1">개</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500 mb-1">카테고리</p>
          <p className="text-4xl font-black text-[#8B5E3C]">{categoryCount ?? 0}</p>
          <p className="text-xs text-gray-400 mt-1">개</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500 mb-1">품절 메뉴</p>
          <p className="text-4xl font-black text-red-400">{soldOutMenus?.length ?? 0}</p>
          <p className="text-xs text-gray-400 mt-1">개</p>
        </div>
      </div>

      {soldOutMenus && soldOutMenus.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-8">
          <p className="text-sm font-bold text-red-600 mb-2">⚠️ 품절 메뉴</p>
          <div className="flex flex-wrap gap-2">
            {soldOutMenus.map((m) => (
              <span key={m.name} className="bg-red-100 text-red-700 text-xs px-3 py-1 rounded-full">{m.name}</span>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Link href="/admin/menus" className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-[#F5C842] hover:shadow-md transition-all group">
          <div className="text-3xl mb-3">🍪</div>
          <h2 className="font-bold text-gray-800 mb-1">메뉴 관리</h2>
          <p className="text-sm text-gray-500">메뉴 추가, 수정, 삭제, 품절 설정</p>
        </Link>
        <Link href="/admin/settings" className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-[#F5C842] hover:shadow-md transition-all group">
          <div className="text-3xl mb-3">⚙️</div>
          <h2 className="font-bold text-gray-800 mb-1">설정</h2>
          <p className="text-sm text-gray-500">운영시간, 공지사항, 연락처 관리</p>
        </Link>
      </div>
    </div>
  );
}
