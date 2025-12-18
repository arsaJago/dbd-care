'use client';

import { FormEvent, Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { ChecklistItem } from "@/types";
import { defaultChecklistItems } from "@/lib/data";
import {
  ArrowLeft,
  CheckCircle2,
  Edit,
  ListChecks,
  PlusCircle,
  Save,
  Trash2,
  XCircle,
} from "lucide-react";

interface ChecklistFormState {
  title: string;
  description: string;
  category: string;
  frequency: string;
  order: string;
}

function ManageChecklistPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isAdmin } = useAuth();

  const [checklists, setChecklists] = useState<ChecklistItem[]>([]);
  const [formState, setFormState] = useState<ChecklistFormState>({
    title: "",
    description: "",
    category: "",
    frequency: "",
    order: "1",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = useMemo(() => Boolean(editingId), [editingId]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    } else if (!isAdmin) {
      router.push("/beranda");
    } else {
      fetchChecklist();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isAdmin]);

  useEffect(() => {
    if (!checklists.length) return;
    const editId = searchParams.get("edit");
    if (editId) {
      const item = checklists.find((entry) => entry.id === editId);
      if (item) {
        beginEdit(item);
        router.replace("/admin/manage-checklist");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checklists, searchParams]);

  const fetchChecklist = async () => {
    try {
      setLoading(true);
      const checklistQuery = query(collection(db, "checklist"), orderBy("order", "asc"));
      const snapshot = await getDocs(checklistQuery);

      const items: ChecklistItem[] = snapshot.empty
        ? []
        : snapshot.docs
            .map((docSnapshot, index) => {
              const data = docSnapshot.data() as Record<string, unknown>;
              return {
                id: docSnapshot.id,
                title: (data.title as string) || `Checklist ${index + 1}`,
                description: (data.description as string) || "",
                category: (data.category as string) || "Lainnya",
                frequency: (data.frequency as string) || "Tidak ditentukan",
                order: typeof data.order === "number" ? (data.order as number) : index + 1,
              } satisfies ChecklistItem;
            })
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

      setChecklists(items);
      if (!editingId) {
        setFormState((prev) => ({
          ...prev,
          order: String((items.length || 0) + 1),
        }));
      }
    } catch (error) {
      console.error("Error fetching checklist:", error);
      alert("Gagal memuat checklist. Coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormState({
      title: "",
      description: "",
      category: "",
      frequency: "",
      order: String((checklists.length || 0) + 1),
    });
  };

  const beginEdit = (item: ChecklistItem) => {
    setEditingId(item.id);
    setFormState({
      title: item.title,
      description: item.description,
      category: item.category,
      frequency: item.frequency,
      order: String(item.order ?? 1),
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = formState.title.trim();
    const trimmedDescription = formState.description.trim();
    const trimmedCategory = formState.category.trim();
    const trimmedFrequency = formState.frequency.trim();
    const numericOrder = Number(formState.order);
    const orderValue = Number.isFinite(numericOrder) && numericOrder > 0 ? numericOrder : checklists.length + 1;

    if (!trimmedTitle || !trimmedDescription || !trimmedCategory || !trimmedFrequency) {
      alert("Mohon lengkapi data checklist.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title: trimmedTitle,
        description: trimmedDescription,
        category: trimmedCategory,
        frequency: trimmedFrequency,
        order: orderValue,
      };

      if (editingId) {
        await updateDoc(doc(db, "checklist", editingId), payload);
        alert("Checklist berhasil diperbarui.");
      } else {
        await addDoc(collection(db, "checklist"), payload);
        alert("Checklist baru berhasil ditambahkan.");
      }

      resetForm();
      await fetchChecklist();
    } catch (error) {
      console.error("Error saving checklist:", error);
      alert("Gagal menyimpan checklist.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    const confirmed = window.confirm(`Hapus checklist "${title}"?`);
    if (!confirmed) return;

    setIsSubmitting(true);
    try {
      await deleteDoc(doc(db, "checklist", id));
      if (editingId === id) {
        resetForm();
      }
      await fetchChecklist();
      alert("Checklist berhasil dihapus.");
    } catch (error) {
      console.error("Error deleting checklist:", error);
      alert("Gagal menghapus checklist.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoadDefaults = async () => {
    if (!defaultChecklistItems.length) return;

    const confirmed = window.confirm(
      "Tambahkan checklist standar (10 item) ke dalam daftar? Item yang sama bisa tertambah dua kali jika sudah ada."
    );
    if (!confirmed) return;

    setIsSubmitting(true);
    try {
      await Promise.all(
        defaultChecklistItems.map((item) =>
          addDoc(collection(db, "checklist"), {
            title: item.title,
            description: item.description,
            category: item.category,
            frequency: item.frequency,
            order: item.order ?? defaultChecklistItems.length,
          })
        )
      );
      await fetchChecklist();
      alert("Checklist standar berhasil ditambahkan.");
    } catch (error) {
      console.error("Error importing defaults:", error);
      alert("Gagal menambahkan checklist standar.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <ChecklistSpinner message="Memuat data checklist..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <button
            type="button"
            onClick={() => router.push("/admin/manage-content")}
            className="mb-6 inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold"
          >
            <ArrowLeft size={18} />
            Kembali ke Kelola Konten
          </button>

          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Kelola Checklist Pencegahan</h1>
            <p className="text-gray-600 max-w-2xl">
              Tambah, ubah, atau hapus item checklist yang akan ditampilkan kepada pengguna di halaman checklist pencegahan DBD.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,_420px)_minmax(0,_1fr)]">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-xl shadow-md p-6 space-y-5 border border-indigo-100"
            >
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold text-gray-800">
                  {isEditing ? "Edit Checklist" : "Tambah Checklist"}
                </h2>
                {isEditing && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
                  >
                    <XCircle size={16} />
                    Batal edit
                  </button>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
                <input
                  required
                  type="text"
                  value={formState.title}
                  onChange={(event) => setFormState((prev) => ({ ...prev, title: event.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  placeholder="Contoh: Menguras Bak Mandi"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea
                  required
                  rows={3}
                  value={formState.description}
                  onChange={(event) => setFormState((prev) => ({ ...prev, description: event.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 resize-none"
                  placeholder="Jelaskan tindakan yang harus dilakukan"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                  <input
                    required
                    type="text"
                    value={formState.category}
                    onChange={(event) => setFormState((prev) => ({ ...prev, category: event.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    placeholder="Contoh: 3M, Plus, Kebersihan"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Frekuensi</label>
                  <input
                    required
                    type="text"
                    value={formState.frequency}
                    onChange={(event) => setFormState((prev) => ({ ...prev, frequency: event.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    placeholder="Contoh: Mingguan, Harian"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Urutan Tampil</label>
                <input
                  type="number"
                  min={1}
                  value={formState.order}
                  onChange={(event) => setFormState((prev) => ({ ...prev, order: event.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                />
                <p className="text-xs text-gray-500 mt-1">Urutan menentukan posisi item di halaman checklist.</p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleLoadDefaults}
                  className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700"
                  disabled={isSubmitting}
                >
                  <PlusCircle size={16} />
                  Tambahkan checklist standar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-white font-semibold hover:bg-indigo-700 transition disabled:opacity-60"
                >
                  <Save size={18} />
                  {isEditing ? "Simpan Perubahan" : "Simpan Checklist"}
                </button>
              </div>
            </form>

            <div className="space-y-4">
              {checklists.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-10 text-center border border-dashed border-indigo-200">
                  <ListChecks className="mx-auto mb-4 text-indigo-400" size={48} />
                  <p className="text-gray-600 mb-2">Belum ada checklist yang tersimpan.</p>
                  <p className="text-sm text-gray-500">Gunakan formulir di sebelah kiri untuk menambahkan item baru atau muat checklist standar.</p>
                </div>
              ) : (
                checklists.map((item) => {
                  const active = item.id === editingId;
                  return (
                    <div
                      key={item.id}
                      className={`bg-white rounded-xl shadow-md transition-shadow p-5 border ${
                        active ? "border-indigo-500 shadow-lg" : "border-transparent hover:shadow-lg"
                      }`}
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                            {active && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2 py-1 text-xs font-semibold text-indigo-700">
                                <CheckCircle2 size={12} />
                                Sedang diedit
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                            <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full font-semibold">
                              {item.category}
                            </span>
                            <span>Frekuensi: {item.frequency}</span>
                            <span>Urutan: {item.order ?? '-'}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => beginEdit(item)}
                            className="inline-flex items-center gap-2 rounded-lg border border-yellow-500 px-4 py-2 text-yellow-600 font-medium hover:bg-yellow-50"
                            disabled={isSubmitting}
                          >
                            <Edit size={16} />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id, item.title)}
                            className="inline-flex items-center gap-2 rounded-lg border border-red-500 px-4 py-2 text-red-600 font-medium hover:bg-red-50"
                            disabled={isSubmitting}
                          >
                            <Trash2 size={16} />
                            Hapus
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChecklistSpinner({ message }: { message: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-16">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
}

export default function ManageChecklistPage() {
  return (
    <Suspense fallback={<ChecklistSpinner message="Menyiapkan halaman checklist..." />}>
      <ManageChecklistPageContent />
    </Suspense>
  );
}
