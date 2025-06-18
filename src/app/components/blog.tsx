"use client";
import React, { useEffect, useState } from "react";
import { Article } from "./Article";
import Link from "next/link"; // si Next.js
import BlogLoadingSkeleton from "./skeleton/skeletonblog";


export default function Blog() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("Tout");
  const [sortOrder, setSortOrder] = useState("Plus récent");
  const [currentPage, setCurrentPage] = useState(1);
  const POSTS_PER_PAGE = 9;
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch("https://bernard-backend-a1go.onrender.com/articles/all")
      .then((res) => {
        if (!res.ok) throw new Error("Erreur lors de la récupération");
        return res.json();
      })
      .then((data: Article[]) => {
        setArticles(data);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // Extraction des catégories uniques, en remplaçant "All" par "Tout"
  const categories = [
    "Tout",
    ...Array.from(new Set(articles.flatMap((a) => a.categorie))),
  ];

  // Filtrage selon la catégorie sélectionnée
  let filteredPosts =
    selectedCategory === "Tout"
      ? articles
      : articles.filter((post) => post.categorie.includes(selectedCategory));

  // Tri par date de publication
  filteredPosts = filteredPosts.sort((a, b) => {
    return sortOrder === "Plus récent"
      ? new Date(b.datePublication).getTime() -
          new Date(a.datePublication).getTime()
      : new Date(a.datePublication).getTime() -
          new Date(b.datePublication).getTime();
  });
  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const startIdx = (currentPage - 1) * POSTS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(
    startIdx,
    startIdx + POSTS_PER_PAGE
  );
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, sortOrder]);
    if (loading) {
    return <BlogLoadingSkeleton />;
  }
  if (error)
    return <p className="text-center text-red-500">Erreur : {error}</p>;
  return (
    <div className="bg-white py-24 sm:py-32 mx-2">
      <div className="mx-auto px-6 lg:px-8">
        {/* En-tête + tri */}
        <div className="mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="text-left">
            <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
              Du blog
            </h2>
            <p className="mt-2 text-lg leading-8 text-gray-600">
              Apprenez à développer votre entreprise avec nos conseils
              d'experts.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-700">
            <label htmlFor="sort" className="font-semibold">
              Trier par :
            </label>
            <select
              id="sort"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="rounded-md border border-gray-300 bg-white px-4 py-1.5 text-sm text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 pr-8"
            >
              <option value="Plus récent">Plus récent</option>
              <option value="Plus ancien">Plus ancien</option>
            </select>
          </div>
        </div>

        {/* Filtres catégorie */}
        <div className="mt-6 flex overflow-x-auto space-x-4 no-scrollbar snap-x snap-mandatory">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-md px-4 py-2 text-sm font-semibold whitespace-nowrap snap-start ${
                selectedCategory === category
                  ? "bg-gray-100 text-black"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Grille des articles */}
        <div className="mx-auto mt-16 grid max-w-2xl auto-rows-fr grid-cols-1 gap-8 sm:mt-12 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {paginatedPosts.length === 0 ? (
            <p className="text-center text-gray-500 col-span-full">
              Aucun article trouvé dans la catégorie « {selectedCategory} ».
            </p>
          ) : (
            paginatedPosts.map((post) => (
                <Link key={post.id} href={`./pages/descriptionpage/${post.id}`}>
              <article
                key={post.id}
                className="relative isolate flex flex-col justify-end overflow-hidden rounded-2xl bg-gray-900 px-8 pt-80 pb-8 sm:pt-48 lg:pt-80 items-center text-center lg:items-start lg:text-left"
              >
                {post.imageCover && (
                  <img
                    alt={post.titre}
                    src={post.imageCover}
                    className="absolute inset-0 -z-10 w-full h-full object-cover opacity-60"
                  />
                )}
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
                <div className="absolute inset-0 -z-10 rounded-2xl ring-1 ring-gray-900/10 ring-inset" />

                <div
                  className="
                    absolute top-8 left-8 rounded-full px-3 py-1 text-xs font-semibold text-white 
                    border border-white bg-white/20
                    backdrop-blur-sm
                  "
                >
                  {Array.isArray(post.categorie)
                    ? post.categorie.join(", ")
                    : String(post.categorie)}
                </div>

                <div className="flex flex-wrap items-center gap-y-1 overflow-hidden text-sm leading-6 text-gray-300 mt-6">
                  <time dateTime={post.datePublication} className="mr-8">
                    {new Date(post.datePublication).toLocaleDateString()}
                  </time>
                  <div className="-ml-4 flex items-center gap-x-4">
                    {post.user.profile_image && (
                      <img
                        alt={`${post.user.firstname} ${post.user.lastname}`}
                        src={post.user.profile_image}
                        className="h-6 w-6 flex-none rounded-full bg-white/10 object-cover"
                      />
                    )}
                    {post.user.firstname} {post.user.lastname}
                  </div>
                </div>

                <h3 className="mt-3 text-lg leading-6 font-semibold text-white">
                  {post.titre}
                </h3>

                <p className="mt-2 text-sm leading-5 text-gray-300">
                  {post.soustitre}
                </p>
              </article>
                </Link>

            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <nav
            className="mt-12 flex justify-center gap-2 text-sm font-medium text-gray-700"
            aria-label="Pagination"
          >
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="rounded-md px-3 py-1 hover:bg-gray-100 disabled:opacity-50"
            >
              Précédent
            </button>

            {[...Array(totalPages).keys()].map((page) => {
              const pageNumber = page + 1;
              return (
                <button
                  key={pageNumber}
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`rounded-md px-3 py-1 hover:bg-gray-100 ${
                    currentPage === pageNumber
                      ? "bg-gray-900 text-white"
                      : "bg-white"
                  }`}
                  aria-current={currentPage === pageNumber ? "page" : undefined}
                >
                  {pageNumber}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="rounded-md px-3 py-1 hover:bg-gray-100 disabled:opacity-50"
            >
              Suivant
            </button>
          </nav>
        )}
      </div>
    </div>









  );
}
