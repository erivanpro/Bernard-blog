"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

export interface Article {
  id: number;
  titre: string;
  soustitre: string;
  datePublication: string;
  imageCover: string | null;
  images: string[] | null;
  categorie: string;
  keywords: string[] | null;
  contenu: string;
  gridContent: string | null;
  adressePublication: string | null;
}

export function Search() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const res = await fetch("https://bernard-backend-a1go.onrender.com/articles/all");
        if (!res.ok) throw new Error("Erreur lors du fetch des articles");
        const data = await res.json();
        setArticles(data);
      } catch (error) {
        console.error("Erreur :", error);
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
  }, []);

  useEffect(() => {
    if (searchValue.trim() === "") {
      setFilteredArticles([]);
    } else {
      const filtered = articles.filter(article =>
        article.titre.toLowerCase().includes(searchValue.toLowerCase()) ||
        article.soustitre?.toLowerCase().includes(searchValue.toLowerCase()) ||
        article.categorie?.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredArticles(filtered);
    }
  }, [searchValue, articles]);

  return (
    <div className="relative p-2 w-full max-w-xl mx-auto">
      {/* Icône loupe */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="rgba(255,255,255,1)"
        className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
      >
        <path d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z" />
      </svg>

      {/* Champ de recherche sans bordure */}
      <input
        type="text"
        placeholder="Rechercher un article..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        className="w-full bg-transparent text-white placeholder-gray-400 rounded-md pl-10 pr-4 py-0 focus:outline-none focus:ring-0"
      />
      {/* Résultats filtrés */}
      {searchValue.trim() !== "" && filteredArticles.length > 0 && (
        <ul className="absolute mt-2 w-full bg-black bg-opacity-80 backdrop-blur-lg rounded-md max-h-80 overflow-y-auto z-50 shadow-xl">
          {filteredArticles.map(({ id, titre, soustitre, imageCover, datePublication }) => (
            <li key={id} className="hover:bg-gray-800 transition">
              <Link href={`pages/descriptionpage/${id}`} className="flex items-start gap-3 p-3 text-white">
                {imageCover ? (
                  <img src={imageCover} alt={titre} className="w-16 h-16 object-cover rounded-md" />
                ) : (
                  <div className="w-16 h-16 bg-gray-600 rounded-md" />
                )}
                <div className="flex flex-col">
                  <span className="font-semibold text-cyan-300">{titre}</span>
                  <span className="text-sm text-gray-300">{soustitre}</span>
                  <span className="text-xs text-gray-500 mt-1">{new Date(datePublication).toLocaleDateString()}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {/* Aucun résultat */}
      {searchValue.trim() !== "" && filteredArticles.length === 0 && !loading && (
        <div className="absolute mt-2 w-full text-sm text-gray-400 bg-black bg-opacity-80 rounded-md p-3">
          Aucun article trouvé.
        </div>
      )}
    </div>
  );
}
