"use client";
import React, { useState, useEffect } from "react";

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

// DTO for creating/updating an article
interface CreateArticleDto {
  titre: string;
  soustitre?: string;
  datePublication: string;
  imageCover?: string;
  images?: string[];
  categorie: string;
  contenu: string;
  userId: number;
  keywords?: string[];
}

type Props = {
  articleId: number;
  userId: number;
  onClose: () => void;
};

export function EditArticle({ articleId, userId, onClose }: Props) {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Chargement de l'article
  useEffect(() => {
    async function fetchArticle() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:2000/articles/${articleId}`);
        if (!res.ok) throw new Error("Erreur lors du chargement de l'article");
        const data: Article = await res.json();
        setArticle(data);
      } catch (err: any) {
        setError(err.message || "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    }
    fetchArticle();
  }, [articleId]);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="text-red-600">Erreur : {error}</p>;
  if (!article) return <p>Aucun article trouvé.</p>;

  // Gestion des champs contrôlés
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setArticle((prev) => prev ? { ...prev, [name]: value } : prev);
  }

  // Gestion d’un tableau d’images au format string[]
  function handleImagesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    // On suppose que l'utilisateur entre des URLs séparées par des virgules
    const imgs = value.split(",").map((url) => url.trim()).filter(Boolean);
    setArticle((prev) => prev ? { ...prev, images: imgs } : prev);
  }



      async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  if (!article) return;

  setSaving(true);
  setError(null);

  // Validation simple
  if (!article.titre.trim() || !article.contenu.trim()) {
    setError("Le titre et le contenu sont obligatoires.");
    setSaving(false);
    return;
  }

  try {
    const payload: Partial<CreateArticleDto> = {
      titre: article.titre,
      soustitre: article.soustitre,
      datePublication: article.datePublication,
      imageCover: article.imageCover,
      images: article.images,
      categorie: article.categorie,
      contenu: article.contenu,
      userId: article.userId,
      keywords: (article as any).keywords, // si tu gères keywords
    };

    const res = await fetch(`http://localhost:2000/articles/update${article.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Erreur serveur: ${res.statusText}`);
    }

    alert("Article modifié avec succès !");
    onClose();
  } catch (err: any) {
    setError(err.message || "Erreur inconnue lors de la sauvegarde");
  } finally {
    setSaving(false);
  }
}


  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto p-6 bg-white rounded shadow space-y-6"
    >
      <h2 className="text-xl font-bold mb-4">Modifier l'article</h2>

      <label className="block">
        <span className="font-semibold">Titre *</span>
        <input
          type="text"
          name="titre"
          value={article.titre}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded p-2"
          required
        />
      </label>

      <label className="block">
        <span className="font-semibold">Sous-titre</span>
        <input
          type="text"
          name="soustitre"
          value={article.soustitre}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded p-2"
        />
      </label>

      <label className="block">
        <span className="font-semibold">Date de publication</span>
        <input
          type="date"
          name="datePublication"
          value={article.datePublication.slice(0, 10)} // YYYY-MM-DD
          onChange={handleChange}
          className="mt-1 block border border-gray-300 rounded p-2"
        />
      </label>

      <label className="block">
        <span className="font-semibold">Image de couverture (URL)</span>
        <input
          type="url"
          name="imageCover"
          value={article.imageCover || ""}
          onChange={handleChange}
          placeholder="https://exemple.com/image.jpg"
          className="mt-1 block w-full border border-gray-300 rounded p-2"
        />
      </label>

      <label className="block">
        <span className="font-semibold">Images supplémentaires (URLs séparées par des virgules)</span>
        <input
          type="text"
          name="images"
          value={article.images?.join(", ") || ""}
          onChange={handleImagesChange}
          placeholder="https://exemple.com/img1.jpg, https://exemple.com/img2.jpg"
          className="mt-1 block w-full border border-gray-300 rounded p-2"
        />
      </label>

      <label className="block">
        <span className="font-semibold">Catégorie</span>
        <select
          name="categorie"
          value={article.categorie}
          onChange={handleChange}
          className="mt-1 block border border-gray-300 rounded p-2"
        >
          <option value="santé">Santé</option>
          <option value="tech">Tech</option>
          <option value="sport">Sport</option>
          <option value="mode">Mode</option>
        </select>
      </label>

      <label className="block">
        <span className="font-semibold">Contenu *</span>
        <textarea
          name="contenu"
          value={article.contenu}
          onChange={handleChange}
          rows={8}
          className="mt-1 block w-full border border-gray-300 rounded p-2"
          required
        />
      </label>

      {error && <p className="text-red-600">{error}</p>}

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onClose}
          disabled={saving}
          className="px-4 py-2 border border-gray-400 rounded hover:bg-gray-100"
        >
          Annuler
        </button>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Sauvegarde..." : "Sauvegarder"}
        </button>
      </div>
    </form>
  );
}
