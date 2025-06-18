"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext"; 
import { Icon } from "./Icon";

export default function Page() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const { setUser } = useUser();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const res = await fetch("http://localhost:2000/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await res.json();

      if (!res.ok) {
        setModalMessage(result.message || "Erreur de connexion.");
        setShowModal(true);
        setIsSubmitting(false);
        return;
      }

      setUser(result.user);
      router.push("/pages/dashboard");  // Added leading slash for proper routing
    } catch (error) {
      setModalMessage(
        error instanceof Error
          ? `Erreur : ${error.message}`
          : "Une erreur inconnue est survenue."
      );
      setShowModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-50 backdrop-blur-sm transition-opacity"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-xl p-8 shadow-2xl w-full max-w-md text-center relative animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Erreur de connexion
            </h3>
            <p className="text-sm text-gray-600 mb-6">{modalMessage}</p>
            <button
              onClick={() => setShowModal(false)}
              className="inline-flex justify-center rounded-full bg-black px-5 py-2 text-sm font-medium text-white shadow hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-black"
            >
              Fermer
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black focus:outline-none"
              aria-label="Fermer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="flex min-h-screen flex-col justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
          <img
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=black&shade=600"
            alt="Votre entreprise"
            className="mx-auto h-12 w-auto"
          />
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            Se connecter à votre compte
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-10 px-6 shadow sm:rounded-lg sm:px-12">
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Adresse e-mail
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="email"
                  required
                  className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-black focus:ring-black sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Mot de passe
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  autoComplete="current-password"
                  required
                  className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-black focus:ring-black sm:text-sm"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="peer absolute h-4 w-4 appearance-none rounded-sm border border-gray-300 bg-white checked:bg-black checked:border-black focus:ring-2 focus:ring-black"
                    />
                    <Icon />
                  </div>
                  <label
                    htmlFor="remember-me"
                    className="text-sm text-gray-700"
                  >
                    Se souvenir de moi
                  </label>
                </div>

                <div className="text-sm">
                  <a
                    href="./forgot"
                    className="font-medium text-black hover:underline"
                  >
                    Mot de passe oublié ?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full justify-center rounded-md bg-black px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50"
                >
                  {isSubmitting ? "Connexion..." : "Se connecter"}
                </button>
              </div>
            </form>
            <div className="mt-6 grid grid-cols-2 gap-4">
              {/* Social login links (optional) */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
