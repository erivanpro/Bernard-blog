"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import { Search } from "../components/Search";








export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser(); // J'imagine que tu as une fonction logout dans ton contexte
  return (
    <nav
      className="absolute z-50 flex items-center justify-between px-6 lg:px-12 lg:py-4 py-8 bg-transparent text-white"
      style={{ top: 20, left: 0, right: 20 }}
    >
      <div className="flex items-center w-full sm:w-auto">
        <div className="text-2xl font-bold">
          <img
            src="https://web.archive.org/web/20250521091317im_/https://neodash.org/logowhite.png"
            alt="Logo"
            className="h-10"
          />
        </div>

        {/* Burger Icon - visible on small screens */}
        <button
          className="ml-auto sm:hidden flex items-center focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" />
            )}
          </svg>
        </button>
      </div>
      <ul
        className={`
          absolute top-full left-0 right-0 bg-transparent text-white flex flex-col items-center space-y-4 mt-2
          sm:static sm:flex-row sm:space-x-6 sm:space-y-0 sm:mt-0 sm:bg-transparent
          transition-all duration-300 ease-in-out
          ${
            isOpen
              ? "max-h-60 opacity-100"
              : "max-h-0 opacity-0 overflow-hidden sm:max-h-full sm:opacity-100"
          }
        `}
      >
        <li>
          <a href="/" className="hover:underline">
            Bienvenue
          </a>
        </li>
        <li>
          <a href="/pages/about" className="hover:underline">
            A propos
          </a>
        </li>
        <li>
          <a href="/pages/contact" className="hover:underline">
            Nous contacter
          </a>
        </li>
      </ul>
      <div className="hidden lg:flex items-center space-x-6">
        <div
          className="relative flex items-center gap-4 bg-[rgba(0,255,255,0.15)] rounded-md px-3 py-2"
          style={{ backdropFilter: "blur(10px)" }}
        >
          {/* Icône loupe */}
         

          <Search />

          {user && (
            <>
              <Link
                href="/pages/mesfavoris"
                className="flex items-center gap-1 text-white hover:text-aqua-300 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="rgba(255,255,255,1)"
                >
                  <path d="M12.001 4.52853C14.35 2.42 17.98 2.49 20.2426 4.75736C22.5053 7.02472 22.583 10.637 20.4786 12.993L11.9999 21.485L3.52138 12.993C1.41705 10.637 1.49571 7.01901 3.75736 4.75736C6.02157 2.49315 9.64519 2.41687 12.001 4.52853ZM18.827 6.1701C17.3279 4.66794 14.9076 4.60701 13.337 6.01687L12.0019 7.21524L10.6661 6.01781C9.09098 4.60597 6.67506 4.66808 5.17157 6.17157C3.68183 7.66131 3.60704 10.0473 4.97993 11.6232L11.9999 18.6543L19.0201 11.6232C20.3935 10.0467 20.319 7.66525 18.827 6.1701Z" />
                </svg>
                 favoris
              </Link>
            </>
          )}
        </div>
        {user ? (
          <Link href={"/pages/dashboard"}>
            <div className="flex items-center space-x-4">
              {/* Photo de profil */}
              {user.profile_image ? (
                <img
                  src={user.profile_image}
                  alt="Photo utilisateur"
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-black font-bold">
                  {user.firstname?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
            </div>
          </Link>
        ) : (
          <>
            <Link
              href="/pages/login"
              className="text-white px-6 py-2 rounded-md font-semibold hover:bg-white hover:text-black transition"
            >
              Se connecter
            </Link>

            <Link
              href="/pages/signup"
              className="bg-white text-black px-6 py-2 rounded-md font-semibold hover:bg-gray-200 transition"
            >
              S'inscrire
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
