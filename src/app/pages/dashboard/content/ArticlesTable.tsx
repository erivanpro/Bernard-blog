"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@/app/context/UserContext";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { EditArticle } from "./EditArticle";




interface Article {
  id: number;
  userId: number;
  titre: string;
  soustitre: string;
  datePublication: string;
  imageCover?: string;
  images?: string[];
  categorie: string;
  contenu: string;
  created_at: string | Date;
  updated_at: string | Date;
}

export default function ArticlesTable() {
  const { user } = useUser();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [isOpen, setIsOpen] = useState(false);
  // Store id and userid of article to edit
  const [editArticle, setEditArticle] = useState<{ id: number; userId: number } | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    const fetchArticles = async () => {
      setLoading(true);
      setError(null);
      try {
        await new Promise((r) => setTimeout(r, 2000));
        const res = await fetch(`http://localhost:2000/articles?userId=${user.id}`);
        if (!res.ok) throw new Error("Erreur lors de la récupération des articles");
        const data = await res.json();
        setArticles(data);
      } catch (err: any) {
        setError(err.message || "Erreur inconnue");
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, [user?.id]);

  function openEditModal(articleId: number, userId: number) {
    setEditArticle({ id: articleId, userId });
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
    setEditArticle(null);
  }

  const handleDelete = async (id: number) => {
    if (!user?.id) return;
    if (!confirm("Voulez-vous vraiment supprimer cet article ?")) return;
    try {
      const res = await fetch(`http://localhost:2000/articles/${id}?userId=${user.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erreur lors de la suppression");
      setArticles((prev) => prev.filter((article) => article.id !== id));
    } catch (err: any) {
      alert(err.message || "Erreur inconnue lors de la suppression");
    }
  };

  return (
    <>
      {/* Table */}
      <div className="overflow-x-auto mt-6">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Titre</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Catégorie</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Modifier</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Supprimer</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {articles.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                  Aucun article trouvé.
                </td>
              </tr>
            ) : (
              articles.map((article) => (
                <tr key={article.id}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{article.titre}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{article.categorie}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {typeof article.created_at === "string"
                      ? article.created_at
                      : article.created_at.toLocaleString()}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <button
                      className="text-blue-600 hover:underline"
                      type="button"
                      onClick={() => openEditModal(article.id, article.userId)}
                    >
                      Modifier
                    </button>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-right">
                    <button
                      onClick={() => handleDelete(article.id)}
                      type="button"
                      aria-label="Supprimer l'article"
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-red-600 hover:bg-red-100 hover:text-red-800 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0a1 1 0 00-1 1v1h6V4a1 1 0 00-1-1m-4 0h4"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  {editArticle && (
                    <EditArticle
                      articleId={editArticle.id}
                      userId={editArticle.userId}
                      onClose={closeModal}
                    />
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
