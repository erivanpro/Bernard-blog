"use client";

import Footer from '@/app/components/footer';
import React, { useState } from 'react';
import NavbarTop from '../descriptionpage/navbar/navbartop';

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white font-sans">
     <NavbarTop/>
      {/* Spacer for fixed navbar */}
      <div className="h-16"></div>

      {/* Main content container */}
      <main className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-10 mb-20">
        <header className="text-center mb-10 mt-12">
          <h1 className="text-5xl font-extrabold text-blue-900 mb-4">À propos de nous</h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Nous avons créé cet espace pour que chacun puisse s'exprimer librement, lire et échanger
            sérieusement.
          </p>
        </header>

        <section className="flex flex-col md:flex-row items-center gap-12">
          {/* Image */}
          <div className="md:w-1/2 rounded-lg overflow-hidden shadow-md">
            <img
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
              alt="Communauté échange"
              className="w-full h-auto object-cover"
              loading="lazy"
            />
          </div>

          {/* Text content */}
          <div className="md:w-1/2 space-y-8 text-gray-800">
            <p className="text-lg leading-relaxed">
              Ce blog est une communauté où chacun peut partager des idées, des expériences, et des
              connaissances dans un esprit de respect et de sérieux.
            </p>
            <p className="text-lg leading-relaxed">
              Que vous soyez lecteur ou auteur, cet espace vous est dédié pour échanger des
              informations, débattre et créer des liens authentiques.
            </p>
            <p className="text-lg font-semibold text-blue-700">
              Ensemble, construisons un lieu où la parole libre et le savoir se rencontrent.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
