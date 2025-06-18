'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

export default function Presentation() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col lg:flex-row gap-6 mx-2 py-10 w-full animate-pulse">
        {/* Left Skeleton */}
        <div className="lg:w-2/5 space-y-6 ml-2">
          <div className="rounded-2xl bg-gray-300 h-[280px]" />
          <div className="rounded-2xl bg-gray-300 h-[280px]" />
        </div>
        {/* Right Skeleton */}
        <div className="lg:w-3/5 mr-2 rounded-2xl bg-gray-300 min-h-[580px]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6  mx-2 py-10 w-full">
      {/* Left Column (40%) */}
      <div className="lg:w-2/5 space-y-6 ml-2">
        {/* Card 1 */}
        <div
          className="relative rounded-2xl border border-gray-200 overflow-hidden shadow-md min-h-[280px] bg-cover bg-center flex flex-col justify-between p-6 transition-transform hover:scale-[1.01]"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1549880181-56a44cf4a9a5?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent rounded-2xl" />
          <div className="relative z-10 text-white text-2xl font-semibold leading-snug">
            Participer à notre blog
          </div>
          <div className="relative z-10 text-white text-sm mt-2 mb-4">
            Rejoignez notre communauté en participant activement à notre blog, partagez vos idées et vos expériences avec d’autres passionnés.
          </div>
          <Link
            className="relative z-10 bg-white text-black text-sm font-medium py-2 px-5 rounded-lg hover:bg-gray-100 transition-all w-fit"
            href="/pages/signup"
          >
            Créer mon compte
          </Link>
        </div>

        {/* Card 2 */}
        <div
          className="relative rounded-2xl border border-gray-200 overflow-hidden shadow-md min-h-[280px] bg-cover bg-center flex items-center justify-center p-6 transition-transform hover:scale-[1.01]"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1480497490787-505ec076689f?q=80&w=2500&auto=format&fit=crop&ixlib=rb-4.1.0')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent rounded-2xl" />
          <p className="relative z-10 text-white text-xl font-semibold text-center">
            Article Available
          </p>
        </div>
      </div>

      {/* Right Column (60%) */}
      <div
        className="relative lg:w-3/5 mr-2 rounded-2xl border border-gray-200 overflow-hidden shadow-md min-h-[580px] bg-cover bg-center flex items-center p-6"
        style={{
          backgroundImage:
            "url('https://plus.unsplash.com/premium_photo-1675629118861-dc8aa2acea74?q=80&w=3134&auto=format&fit=crop&ixlib=rb-4.1.0')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent rounded-2xl" />
        <p className="relative z-10 text-white text-2xl font-medium leading-relaxed text-center px-4">
          Trouvez vos inspirations, partagez vos idées, et laissez libre cours à votre créativité sur notre blog.
        </p>
      </div>
    </div>
  );
}
