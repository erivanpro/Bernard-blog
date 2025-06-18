"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useUser } from "@/app/context/UserContext";
import logoblack from "@/app/output-onlinepngtools.png";
import { Menu, X } from "lucide-react"; // Icons for toggle

export default function NavbarTop() {
  const { user } = useUser();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full px-6 py-4 flex justify-between items-center shadow-md transition-all duration-300 z-50
        ${
          scrolled
            ? "bg-white/30 backdrop-blur-md border-b border-white/30 text-black"
            : "bg-transparent text-black"
        }`}
    >
      {/* Logo */}
      <div className="text-xl font-bold cursor-pointer">
        <Image src={logoblack} alt="Logo" className="h-8 w-8" />
      </div>

      {/* Hamburger Menu for Mobile */}
      <button
        className="lg:hidden text-black"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Navigation Links */}
      <ul
        className={`flex flex-col lg:flex-row lg:space-x-6 absolute lg:static top-16 left-0 w-full lg:w-auto bg-white lg:bg-transparent text-black transition-all duration-300
        ${menuOpen ? "block" : "hidden"} lg:flex`}
      >
        <li>
          <a href="/" className="block px-4 py-2 hover:underline hover:text-gray-700">
            Accueil
          </a>
        </li>
        <li>
          <a href="/pages/about" className="block px-4 py-2 hover:underline hover:text-gray-700">
            à propos
          </a>
        </li>
        <li>
          <a href="/pages/mesfavoris" className="block px-4 py-2 hover:underline hover:text-gray-700">
            Mes articles favories
          </a>
        </li>
        <li>
          <a href="/pages/contact" className="block px-4 py-2 hover:underline hover:text-gray-700">
            nous contacter
          </a>
        </li>

        <li className="block px-4 py-2 lg:hidden">
          {user ? (
            <span>
              Bonjour, <strong>{user.firstname}</strong>
            </span>
          ) : (
            <a href="/login" className="hover:underline hover:text-gray-700">
              Se connecter
            </a>
          )}
        </li>
      </ul>

      {/* User Info (Visible on larger screens) */}
      <div className="hidden lg:block">
        {user ? (
          <span>
            Bonjour, <strong>{user.firstname}</strong>
          </span>
        ) : (
          <a href="/login" className="text-black hover:underline hover:text-gray-700">
            Se connecter
          </a>
        )}
      </div>
    </nav>
  );
}
