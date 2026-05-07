"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Category, Menu } from "@/types";

type Props = {
  initialMenus: Menu[];
  categories: Category[];
};

const EMPTY_FORM = {
  name: "",
  description: "",
  price: "",
  category_id: "",
  sold_out: false,
  frozen: false,
  active: true,
};

export default function MenusClient({ initialMenus, categories }: Props) {
  const [menus, setMenus] = useState<Menu[]>(initialMenus);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("all");

  function openNew() {
    setEditId(null);
    setForm({ ...EMPTY_FORM, category_id: categories[0]?.id ?? "" });
    setImageFile(null);
    setImagePreview("");
    setShowForm(true);
  }

  function openEdit(menu: Menu) {
    setEditId(menu.id);
    setForm({
      name: menu.name,
      description: menu.description ?? "",
      price: String(menu.price),
      category_id: menu.category_id ?? "",
      sold_out: menu.sold_out,
      frozen: menu.frozen,
      active: menu.active,
    });
    setImageFile(null);
    setImagePreview(menu.image_url ?? "");
    setShowForm(true);
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function uploadImage(file: File): Promise<string> {
    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from("menu-images")
      .upload(fileName, file, { upsert: true });
    if (error) throw error;
    const { data } = supabase.storage.from("menu-images").getPublicUrl(fileName);
    return data.publicUrl;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = imagePreview.startsWith("blob:") ? "" : imagePreview;
      if (imageFile) imageUrl = await uploadImage(imageFile);

      const payload = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        category_id: form.category_id || null,
        sold_out: form.sold_out,
        frozen: form.frozen,
        active: form.active,
        ...(imageUrl ? { image_url: imageUrl } : {}),
        updated_at: new Date().toISOString(),
      };

      if (editId) {
        await supabase.from("menus").update(payload).eq("id", editId);
      } else {
        await supabase.from("menus").insert({ ...payload, sort_order: menus.length + 1 });
      }

      const { data } = await supabase.from("menus").select("*, categories(*)").order("sort_order");
      setMenus(data ?? []);
      setShowForm(false);
    } catch (err) {
      alert("저장 중 오류가 발생했습니다.");
      console.error(err);
    }
    setLoading(false);
  }

  async function toggleSoldOut(menu: Menu) {
    await supabase.from("menus").update({ sold_out: !menu.sold_out, updated_at: new Date().toISOString() }).eq("id", menu.id);
    setMenus((prev) => prev.map((m) => m.id === menu.id ? { ...m, sold_out: !m.sold_out } : m));
  }

  async function deleteMenu(id: string) {
    if (!confirm("정말 삭제하시겠어요?")) return;
    await supabase.from("menus").delete().eq("id", id);
    setMenus((prev) => prev.filter((m) => m.id !== id));
  }

  const filtered = filterCategory === "all" ? menus : menus.filter((m) => m.category_id === filterCategory);

  return (
    <div className="p-4 sm:p-8">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl sm:text-2xl font-black text-gray-800">메뉴 관리</h1>
        <button onClick={openNew} className="bg-[#E0A800] hover:bg-[#C89200] text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors">
          + 메뉴 추가
        </button>
      </div>

      {/* 카테고리 필터 */}
      <div className="flex gap-2 mb-5 flex-wrap">
        <button onClick={() => setFilterCategory("all")} className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${filterCategory === "all" ? "bg-[#E0A800] text-white" : "bg-white border border-gray-200 text-gray-600"}`}>
          전체
        </button>
        {categories.map((c) => (
          <button key={c.id} onClick={() => setFilterCategory(c.id)} className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${filterCategory === c.id ? "bg-[#E0A800] text-white" : "bg-white border border-gray-200 text-gray-600"}`}>
            {c.name}
          </button>
        ))}
      </div>

      {/* 메뉴 카드 목록 */}
      <div className="space-y-3">
        {filtered.map((menu) => (
          <div key={menu.id} className={`bg-white rounded-2xl border border-gray-200 p-4 ${!menu.active ? "opacity-50" : ""}`}>
            <div className="flex items-center gap-3">
              {/* 이미지 */}
              {menu.image_url ? (
                <img src={menu.image_url} alt={menu.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-[#FFF3C4] flex items-center justify-center text-2xl flex-shrink-0">🍪</div>
              )}

              {/* 정보 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-gray-800 text-sm">{menu.name}</span>
                  {menu.frozen && <span className="text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full">냉동</span>}
                  {!menu.active && <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">비활성</span>}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">
                  {(menu.categories as unknown as Category)?.name ?? "-"}
                </div>
                <div className="font-bold text-[#E0A800] text-sm mt-1">{menu.price.toLocaleString()}원</div>
              </div>

              {/* 우측 버튼들 */}
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <button
                  onClick={() => toggleSoldOut(menu)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${menu.sold_out ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}
                >
                  {menu.sold_out ? "품절" : "판매중"}
                </button>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(menu)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-[#FFF3C4] transition-colors text-sm">✏️</button>
                  <button onClick={() => deleteMenu(menu.id)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-red-100 transition-colors text-sm">🗑️</button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-14 text-gray-400">메뉴가 없습니다.</div>
        )}
      </div>

      {/* 메뉴 추가/수정 모달 */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-black text-gray-800">{editId ? "메뉴 수정" : "메뉴 추가"}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 text-2xl leading-none">×</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 이미지 */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">메뉴 이미지</label>
                <div className="flex items-center gap-4">
                  {imagePreview && (
                    <img src={imagePreview} alt="미리보기" className="w-20 h-20 rounded-xl object-cover border border-gray-200" />
                  )}
                  <label className="cursor-pointer bg-gray-50 border border-dashed border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-500 hover:border-[#E0A800] transition-colors">
                    📷 이미지 선택
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                </div>
              </div>

              {/* 메뉴명 */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">메뉴명 *</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F5C842]" placeholder="메뉴명을 입력하세요" />
              </div>

              {/* 설명 */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">설명</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F5C842] resize-none" rows={2} placeholder="메뉴 설명" />
              </div>

              {/* 가격 */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">가격 *</label>
                <input required type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F5C842]" placeholder="0" />
              </div>

              {/* 카테고리 */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">카테고리</label>
                <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F5C842]">
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* 토글들 */}
              <div className="flex gap-5 flex-wrap">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.sold_out} onChange={(e) => setForm({ ...form, sold_out: e.target.checked })} className="w-4 h-4 accent-red-500" />
                  <span className="text-sm text-gray-600">품절</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.frozen} onChange={(e) => setForm({ ...form, frozen: e.target.checked })} className="w-4 h-4 accent-blue-500" />
                  <span className="text-sm text-gray-600">냉동 제공</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="w-4 h-4 accent-green-500" />
                  <span className="text-sm text-gray-600">판매 활성</span>
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-gray-200 text-gray-600 font-medium py-3 rounded-xl text-sm hover:bg-gray-50 transition-colors">
                  취소
                </button>
                <button type="submit" disabled={loading} className="flex-1 bg-[#E0A800] hover:bg-[#C89200] text-white font-bold py-3 rounded-xl text-sm transition-colors disabled:opacity-50">
                  {loading ? "저장 중..." : "저장"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
