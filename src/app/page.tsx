import Image from "next/image";
import { supabase } from "@/lib/supabase";
import type { Category, Menu, Setting } from "@/types";

export const revalidate = 0; // 항상 최신 데이터 사용

async function getData() {
  const [{ data: categories }, { data: menus }, { data: settings }] =
    await Promise.all([
      supabase.from("categories").select("*").order("sort_order"),
      supabase
        .from("menus")
        .select("*, categories(*)")
        .eq("active", true)
        .order("sort_order"),
      supabase.from("settings").select("*"),
    ]);

  const settingsMap = Object.fromEntries(
    (settings ?? []).map((s: Setting) => [s.key, s.value ?? ""])
  );

  return {
    categories: (categories ?? []) as Category[],
    menus: (menus ?? []) as Menu[],
    settings: settingsMap,
  };
}

export default async function Home() {
  const { categories, menus, settings } = await getData();

  return (
    <div className="flex flex-col min-h-screen bg-[#FDF6E9]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#FDF6E9]/90 backdrop-blur-sm border-b border-[#C8956C]/20">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="토리토리 로고"
              width={48}
              height={48}
              className="rounded-full object-cover"
            />
            <span className="text-[#5C3A1E] font-bold text-xl tracking-wide">
              토리토리
            </span>
          </div>
          <nav className="hidden sm:flex items-center gap-8 text-sm font-medium text-[#8B5E3C]">
            <a href="#menu" className="hover:text-[#5C3A1E] transition-colors">메뉴</a>
            <a href="#about" className="hover:text-[#5C3A1E] transition-colors">소개</a>
            <a href="#contact" className="hover:text-[#5C3A1E] transition-colors">찾아오시는 길</a>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* 공지사항 */}
        {settings.notice && (
          <div className="bg-[#F5C842] text-[#3D2314] text-center text-sm font-medium py-2.5 px-6">
            📢 {settings.notice}
          </div>
        )}

        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#FFF3C4] via-[#FDF6E9] to-[#EDD5BB] py-20 sm:py-32">
          <div className="absolute top-10 right-10 w-48 h-48 bg-[#F5C842]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#C8956C]/10 rounded-full blur-3xl" />

          <div className="relative max-w-5xl mx-auto px-6 flex flex-col items-center text-center gap-6">
            <div className="float-anim text-6xl sm:text-7xl mb-2">🍪</div>
            <h1 className="text-4xl sm:text-6xl font-black text-[#3D2314] leading-tight tracking-tight">
              매일 직접 굽는<br />
              <span className="text-[#E0A800]">수제 쿠키</span>
            </h1>
            <p className="text-lg sm:text-xl text-[#8B5E3C] max-w-md leading-relaxed">
              두바이 쫀득쿠키부터 황치즈 뽀또까지,<br />
              토리토리의 특별한 맛을 경험하세요.
            </p>
            <a
              href="#menu"
              className="mt-4 inline-flex items-center gap-2 bg-[#E0A800] hover:bg-[#C89200] text-white font-bold px-8 py-3.5 rounded-full text-base transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              메뉴 보기 ↓
            </a>
          </div>
        </section>

        {/* Menu Section */}
        <section id="menu" className="py-20 px-6 max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#C8956C] font-semibold text-sm uppercase tracking-widest mb-2">Our Menu</p>
            <h2 className="text-3xl sm:text-4xl font-black text-[#3D2314]">오늘의 메뉴</h2>
            <p className="mt-3 text-[#8B5E3C] text-sm">원하시면 꺼내드려요!</p>
          </div>

          <div className="space-y-14">
            {categories.map((category) => {
              const categoryMenus = menus.filter(
                (m) => m.category_id === category.id
              );
              if (categoryMenus.length === 0) return null;
              return (
                <div key={category.id}>
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className={`w-2 h-8 rounded-full ${
                        category.color === "green" ? "bg-green-500" : "bg-[#F5C842]"
                      }`}
                    />
                    <h3 className="text-xl font-bold text-[#5C3A1E]">
                      {category.name}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {categoryMenus.map((item) => (
                      <div
                        key={item.id}
                        className={`relative group rounded-2xl border p-6 transition-all duration-200 ${
                          item.sold_out
                            ? "bg-gray-50 border-gray-200 opacity-60"
                            : "bg-white border-[#EDD5BB] hover:border-[#F5C842] hover:shadow-lg hover:-translate-y-1"
                        }`}
                      >
                        {item.sold_out && (
                          <span className="absolute top-4 right-4 bg-gray-400 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            품절
                          </span>
                        )}
                        {item.frozen && !item.sold_out && (
                          <span className="absolute top-4 right-4 bg-blue-400 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            냉동제공
                          </span>
                        )}

                        {item.image_url ? (
                          <div className="w-full h-36 rounded-xl overflow-hidden mb-4">
                            <img
                              src={item.image_url}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="text-4xl mb-4">🍪</div>
                        )}

                        <h4 className="font-bold text-[#3D2314] text-lg mb-1">
                          {item.name}
                        </h4>
                        {item.description && (
                          <p className="text-[#8B5E3C] text-sm mb-4 leading-relaxed">
                            {item.description}
                          </p>
                        )}
                        <p className="font-black text-[#E0A800] text-xl">
                          {item.price.toLocaleString()}
                          <span className="text-sm font-medium text-[#C8956C] ml-1">원</span>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* About Section */}
        <section
          id="about"
          className="bg-gradient-to-br from-[#5C3A1E] to-[#8B5E3C] py-20 px-6"
        >
          <div className="max-w-3xl mx-auto text-center text-white">
            <div className="text-5xl mb-6">🧡</div>
            <h2 className="text-3xl sm:text-4xl font-black mb-6">
              토리토리 소개
            </h2>
            <p className="text-[#EDD5BB] text-lg leading-relaxed">
              매일 아침 직접 반죽하고 정성껏 구운 수제 쿠키를 선보입니다.<br />
              트렌디한 두바이 시리즈부터 시그니처 디저트까지,<br />
              모든 메뉴에 진심을 담습니다.
            </p>
            <div className="mt-10 grid grid-cols-3 gap-8 max-w-sm mx-auto">
              <div>
                <div className="text-3xl font-black text-[#F5C842]">매일</div>
                <div className="text-[#EDD5BB] text-sm mt-1">직접 제조</div>
              </div>
              <div>
                <div className="text-3xl font-black text-[#F5C842]">{menus.length}+</div>
                <div className="text-[#EDD5BB] text-sm mt-1">메뉴 종류</div>
              </div>
              <div>
                <div className="text-3xl font-black text-[#F5C842]">100%</div>
                <div className="text-[#EDD5BB] text-sm mt-1">수제 쿠키</div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 px-6 max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#C8956C] font-semibold text-sm uppercase tracking-widest mb-2">Visit Us</p>
            <h2 className="text-3xl sm:text-4xl font-black text-[#3D2314]">찾아오시는 길</h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-[#EDD5BB] p-6 text-center">
              <div className="text-3xl mb-3">📍</div>
              <h3 className="font-bold text-[#5C3A1E] mb-2">위치</h3>
              <p className="text-[#8B5E3C] text-sm leading-relaxed">
                {settings.address || "주소를 입력해주세요"}
                {settings.address_detail && (
                  <><br /><span className="text-xs text-[#C8956C]">({settings.address_detail})</span></>
                )}
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-[#EDD5BB] p-6 text-center">
              <div className="text-3xl mb-3">🕐</div>
              <h3 className="font-bold text-[#5C3A1E] mb-2">운영 시간</h3>
              <p className="text-[#8B5E3C] text-sm whitespace-pre-line">
                {settings.open_hours || "운영 시간을 입력해주세요"}
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-[#EDD5BB] p-6 text-center">
              <div className="text-3xl mb-3">📞</div>
              <h3 className="font-bold text-[#5C3A1E] mb-2">문의</h3>
              <p className="text-[#8B5E3C] text-sm">
                {settings.phone || "연락처를 입력해주세요"}
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#3D2314] text-[#EDD5BB] py-10 px-6 text-center">
        <div className="flex justify-center mb-4">
          <Image
            src="/logo.png"
            alt="토리토리"
            width={40}
            height={40}
            className="rounded-full object-cover opacity-80"
          />
        </div>
        <p className="font-bold text-lg text-white mb-1">토리토리</p>
        <p className="text-sm text-[#C8956C]">© 2025 토리토리. All rights reserved.</p>
      </footer>
    </div>
  );
}
