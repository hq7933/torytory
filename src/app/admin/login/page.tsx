"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#FDF6E9] flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-3xl border border-[#EDD5BB] shadow-lg p-8">
        <div className="flex flex-col items-center mb-8">
          <Image src="/logo.png" alt="토리토리" width={64} height={64} className="rounded-full mb-3" />
          <h1 className="text-xl font-black text-[#3D2314]">토리토리 관리자</h1>
          <p className="text-sm text-[#8B5E3C] mt-1">관리자 비밀번호를 입력해주세요</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-[#EDD5BB] rounded-xl px-4 py-3 text-sm text-[#3D2314] focus:outline-none focus:border-[#F5C842]"
          />
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E0A800] hover:bg-[#C89200] text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
          >
            {loading ? "확인 중..." : "로그인"}
          </button>
        </form>
      </div>
    </div>
  );
}
