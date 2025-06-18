'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUser } from '@/app/context/UserContext';
import NavbarTop from '../descriptionpage/navbar/navbartop';

interface Article {
  id: number;
  titre: string;
  soustitre?: string;
  datePublication: string;
  imageCover?: string;
  keywords?: string[];
  gridContent?: string;
  adressePublication?: string;
}

export default function FavoritesPage() {
  const { user } = useUser();
  const userId = user?.id;
  const [favorites, setFavorites] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:2000/likes/user/${userId}/favorites`)
      .then(res => {
        if (!res.ok) throw new Error('Erreur lors du chargement des favoris');
        return res.json();
      })
      .then(data => setFavorites(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [userId]);

  if (!userId) return <p>Veuillez vous connecter pour voir vos favoris.</p>;
  if (loading) return <p>Chargement des favoris...</p>;

  return (
    <><NavbarTop /><div className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            Mes articles favoris
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            Retrouvez ici tous vos articles favoris.
          </p>
        </div>

        {favorites.length === 0 ? (
          <p className="mt-10 text-center text-gray-500">
            Vous n'avez pas encore d'articles favoris.
          </p>
        ) : (
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:max-w-none lg:grid-cols-3">
            {favorites.map((article) => (
              <article key={article.id} className="flex flex-col items-start justify-between">
                <div className="relative w-full">
                  {article.imageCover ? (
                    <img
                      src={article.imageCover}
                      alt={article.titre}
                      className="aspect-video w-full rounded-2xl bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]" />
                  ) : (
                    <div className="aspect-video w-full rounded-2xl bg-gray-200 flex items-center justify-center text-gray-400">
                      Pas d'image
                    </div>
                  )}
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-gray-900/10 ring-inset" />
                </div>

                <div className="max-w-xl mt-8">
                  <div className="flex items-center gap-x-4 text-xs mb-2">
                    <time dateTime={article.datePublication} className="text-gray-500">
                      {new Date(article.datePublication).toLocaleDateString()}
                    </time>
                    {article.keywords && article.keywords.length > 0 && (
                      <span className="rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600">
                        {article.keywords.join(', ')}
                      </span>
                    )}
                  </div>

                  <h3 className="group relative text-lg font-semibold leading-6 text-gray-900 hover:text-gray-600">
                    <Link href={`/articles/${article.id}`}>

                      <span className="absolute inset-0" />
                      {article.titre}

                    </Link>
                  </h3>

                  {article.soustitre && (
                    <p className="mt-2 line-clamp-3 text-sm text-gray-600">
                      {article.soustitre}
                    </p>
                  )}

                  {article.gridContent && (
                    <p className="mt-2 line-clamp-3 text-sm text-gray-600">
                      {article.gridContent}
                    </p>
                  )}

                  {article.adressePublication && (
                    <p className="mt-4 text-sm italic text-gray-500">
                      Adresse : {article.adressePublication}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div></>
  );
}
