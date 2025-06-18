"use client";

import React, { useState, useEffect, ReactNode } from "react";
import Navbar from "./navbar";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface User {
  firstname: string;
  lastname: string;
  profile_image?: string;
}

interface Article {
  categorie: ReactNode;
  id: string;
  titre: string;
  soustitre: string;
  imageCover?: string;
  datePublication: string;
  user: User;
}

export default function Hero() {
  const router = useRouter();

  const [articles, setArticles] = useState<Article[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? articles.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === articles.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch("http://localhost:2000/articles/all")
      .then((res) => {
        if (!res.ok) throw new Error("Erreur lors de la récupération");
        return res.json();
      })
      .then((data: Article[]) => {
        const sorted = data.sort(
          (a, b) =>
            new Date(b.datePublication).getTime() -
            new Date(a.datePublication).getTime()
        );
        const latestThree = sorted.slice(0, 3);
        setArticles(latestThree);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);



if (loading)
  return (
    <div className="w-full h-screen bg-gray-100 animate-pulse">
      <div className="h-full flex flex-col justify-center items-center px-8">
        <div className="w-full max-w-4xl space-y-6">
          <div className="h-10 bg-gray-300 rounded w-2/3" /> {/* Title */}
          <div className="h-6 bg-gray-300 rounded w-1/2" /> {/* Subtitle */}
          <div className="h-4 bg-gray-300 rounded w-full mt-4" />
          <div className="h-4 bg-gray-300 rounded w-5/6" />
          <div className="h-4 bg-gray-300 rounded w-3/4" />
          <div className="mt-6 h-12 w-40 bg-gray-300 rounded" /> {/* Button */}
        </div>
      </div>
    </div>
  );










  if (error)
    return <p className="text-center text-red-500">Erreur : {error}</p>;
  if (articles.length === 0)
    return <p className="text-center">Aucun article disponible.</p>;

  return (
    <div className="relative w-full ">
      <Navbar />

      <div className="px-4 sm:px-6 lg:px-3 py-2">
        <div className="relative overflow-hidden w-full h-120 md:h-[calc(100vh-106px)] bg-gray-100 rounded-2xl dark:bg-neutral-800">
        {articles.map((article, index) => (
        <div
          key={article.id}
          onClick={() => router.push(`./pages/descriptionpage/${article.id}`)}
          className={`absolute inset-0 transition-opacity duration-700 py-12 lg:py-36 cursor-pointer ${
            index === currentIndex
              ? "opacity-100 z-10 pointer-events-auto" // ici on garde l'opacité à 100%
              : "opacity-0 z-0 pointer-events-none"
          }`}
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${article.imageCover || ""})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
  


              <div className="h-full flex flex-col relative">
                {/* LEFT CONTENT */}
                <div
                  className={`
                    relative
                    w-full
                    flex flex-col
                    items-center
                    justify-center
                    text-center
                    px-5
                    mt-[200px]
                    text-white
                    lg:absolute lg:left-0 lg:top-0 lg:bottom-0 lg:max-w-[45%]
                    lg:items-start lg:justify-end lg:text-left
                  `}
                  onClick={(e) => e.stopPropagation()} // Empêche la navigation si on clique sur un lien enfant
                >
                  <span className="block font-semibold text-lg bg-white/10 backdrop-blur-lg text-white px-3 py-1 mb-2 rounded-full">
                    {article.categorie}
                  </span>

                  <span className="block text-xl mt-2 md:text-3xl">
                    {article.titre}
                  </span>

                  <div className="mt-5">
                    <Link
                      className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-xl bg-white text-black hover:bg-gray-100"
                      href={`pages/descriptionpage/${article.id}`}
                      onClick={(e) => e.stopPropagation()} // Empêche la navigation parent et laisse le Link agir seul
                    >
                      continuer à lire
                    </Link>
                  </div>
                </div>

                {/* AUTHOR (hidden on small and medium, visible only lg+) */}
                <div className="hidden lg:flex absolute right-0 bottom-0 top-0 flex-col justify-end items-end text-right px-5 text-white max-w-[35%]">
                  <div className="flex items-center gap-x-2">
                    {article.user.profile_image && (
                      <img
                        src={article.user.profile_image}
                        alt={`${article.user.firstname} ${article.user.lastname}`}
                        className="w-12 h-12 rounded-full mb-2 object-cover border-2 border-white"
                      />
                    )}
                    <span className="text-sm font-semibold">
                      {article.user.firstname} {article.user.lastname}
                    </span>
                  </div>
                  <div className="flex items-center gap-x-2 mt-1 justify-end">
                    <span className="text-xs">
                      {new Date(article.datePublication).toLocaleDateString()}
                    </span>
                    <span className="text-xs">Lecture rapide</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* NAVIGATION BUTTONS */}
          <button
            onClick={goToPrevious}
            aria-label="Previous Slide"
            className="absolute inset-y-0 left-0 flex justify-center items-center w-12 text-black hover:bg-white/20 rounded-l-2xl z-20"
          >
            <svg
              className="w-6 h-6"
              fill="white"
              viewBox="0 0 16 16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" />
            </svg>
          </button>

          <button
            onClick={goToNext}
            aria-label="Next Slide"
            className="absolute inset-y-0 right-0 flex justify-center items-center w-12 text-black hover:bg-white/20 rounded-r-2xl z-20"
          >
            <svg
              className="w-6 h-6"
              fill="white"
              viewBox="0 0 16 16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
            </svg>
          </button>

          {/* Pagination dots */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3 z-30 lg:left-10 lg:translate-x-0">
            {articles.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                  currentIndex === idx ? "bg-white" : "bg-white/50"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
