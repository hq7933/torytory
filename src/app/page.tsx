import Image from "next/image";

const menuItems = [
  {
    category: "두바이 시리즈",
    color: "green",
    items: [
      {
        name: "두바이 쫀득쿠키",
        price: 5500,
        description: "카다이프 반죽의 바삭한 식감, 피스타치오 필링",
        emoji: "🟢",
        soldOut: false,
      },
      {
        name: "두바이 콰작볼",
        price: 5000,
        description: "한 입 쏙! 두바이 초콜릿 풍미의 동글동글 과자볼",
        emoji: "🟢",
        soldOut: false,
      },
      {
        name: "흑임자 쫀득쿠키",
        price: 4800,
        description: "고소한 흑임자와 쫄깃한 쿠키의 만남",
        emoji: "🖤",
        soldOut: false,
      },
    ],
  },
  {
    category: "시그니처 시리즈",
    color: "amber",
    items: [
      {
        name: "황치즈 뽀또",
        price: 5500,
        description: "진한 황금 치즈 크림이 가득 찬 촉촉한 보또",
        emoji: "🧀",
        soldOut: false,
      },
      {
        name: "오레오",
        price: 5500,
        description: "바삭한 오레오와 부드러운 크림의 완벽한 조화",
        emoji: "🍪",
        soldOut: false,
      },
      {
        name: "초코나무숲",
        price: 5800,
        description: "진한 초콜릿 크림과 촉촉한 케이크의 조화",
        emoji: "🌲",
        soldOut: true,
      },
      {
        name: "엄마는 외계인",
        price: 5800,
        description: "얼큰한 마늘 풍미! 냉동으로 제공 • 얼떡 초리토딩",
        emoji: "👾",
        soldOut: false,
        frozen: true,
      },
    ],
  },
];

export default function Home() {
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
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#FFF3C4] via-[#FDF6E9] to-[#EDD5BB] py-20 sm:py-32">
          {/* Decorative blobs */}
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
            {menuItems.map((section) => (
              <div key={section.category}>
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className={`w-2 h-8 rounded-full ${
                      section.color === "green"
                        ? "bg-green-500"
                        : "bg-[#F5C842]"
                    }`}
                  />
                  <h3 className="text-xl font-bold text-[#5C3A1E]">
                    {section.category}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {section.items.map((item) => (
                    <div
                      key={item.name}
                      className={`relative group rounded-2xl border p-6 transition-all duration-200 ${
                        item.soldOut
                          ? "bg-gray-50 border-gray-200 opacity-60"
                          : "bg-white border-[#EDD5BB] hover:border-[#F5C842] hover:shadow-lg hover:-translate-y-1"
                      }`}
                    >
                      {item.soldOut && (
                        <span className="absolute top-4 right-4 bg-gray-400 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                          품절
                        </span>
                      )}
                      {item.frozen && (
                        <span className="absolute top-4 right-4 bg-blue-400 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                          냉동제공
                        </span>
                      )}

                      <div className="text-4xl mb-4">{item.emoji}</div>
                      <h4 className="font-bold text-[#3D2314] text-lg mb-1">
                        {item.name}
                      </h4>
                      <p className="text-[#8B5E3C] text-sm mb-4 leading-relaxed">
                        {item.description}
                      </p>
                      <p className="font-black text-[#E0A800] text-xl">
                        {item.price.toLocaleString()}
                        <span className="text-sm font-medium text-[#C8956C] ml-1">원</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
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
                <div className="text-3xl font-black text-[#F5C842]">7+</div>
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
              <p className="text-[#8B5E3C] text-sm">주소를 입력해주세요</p>
            </div>
            <div className="bg-white rounded-2xl border border-[#EDD5BB] p-6 text-center">
              <div className="text-3xl mb-3">🕐</div>
              <h3 className="font-bold text-[#5C3A1E] mb-2">운영 시간</h3>
              <p className="text-[#8B5E3C] text-sm">운영 시간을 입력해주세요</p>
            </div>
            <div className="bg-white rounded-2xl border border-[#EDD5BB] p-6 text-center">
              <div className="text-3xl mb-3">📞</div>
              <h3 className="font-bold text-[#5C3A1E] mb-2">문의</h3>
              <p className="text-[#8B5E3C] text-sm">연락처를 입력해주세요</p>
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
