"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Settings = Record<string, string>;

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase.from("settings").select("*").then(({ data }) => {
      const map: Settings = {};
      (data ?? []).forEach((s) => { map[s.key] = s.value ?? ""; });
      setSettings(map);
      setLoading(false);
    });
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    for (const [key, value] of Object.entries(settings)) {
      await supabase.from("settings").upsert({ key, value, updated_at: new Date().toISOString() });
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function set(key: string, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  if (loading) return <div className="p-8 text-gray-400">불러오는 중...</div>;

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-black text-gray-800 mb-8">설정</h1>
      <form onSubmit={handleSave} className="space-y-6">

        {/* 공지사항 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="font-bold text-gray-700 mb-4">📢 공지사항</h2>
          <textarea
            value={settings.notice ?? ""}
            onChange={(e) => set("notice", e.target.value)}
            rows={3}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F5C842] resize-none"
            placeholder="공지사항을 입력하면 상단 배너에 표시됩니다"
          />
        </div>

        {/* 운영 시간 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="font-bold text-gray-700 mb-4">🕐 운영 시간</h2>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">운영 시간</label>
              <input
                value={settings.open_hours ?? ""}
                onChange={(e) => set("open_hours", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#F5C842]"
                placeholder="예) 오전 10시 ~ 오후 8시"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">운영 요일</label>
              <input
                value={settings.open_days ?? ""}
                onChange={(e) => set("open_days", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#F5C842]"
                placeholder="예) 화~일 (월요일 휴무)"
              />
            </div>
          </div>
        </div>

        {/* 연락처 & 주소 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="font-bold text-gray-700 mb-4">📞 연락처 & 위치</h2>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">전화번호</label>
              <input
                value={settings.phone ?? ""}
                onChange={(e) => set("phone", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#F5C842]"
                placeholder="예) 0507-1368-3981"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">주소 (도로명)</label>
              <input
                value={settings.address ?? ""}
                onChange={(e) => set("address", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#F5C842]"
                placeholder="도로명 주소"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">주소 (지번)</label>
              <input
                value={settings.address_detail ?? ""}
                onChange={(e) => set("address_detail", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#F5C842]"
                placeholder="지번 주소"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-[#E0A800] hover:bg-[#C89200] text-white font-bold py-3.5 rounded-xl transition-colors disabled:opacity-50 text-sm"
        >
          {saving ? "저장 중..." : saved ? "✅ 저장 완료!" : "설정 저장"}
        </button>
      </form>
    </div>
  );
}
