"use client";
import { useState } from "react";

export default function page() {
   const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
     
      const res = await fetch('https://bernard-backend-a1go.onrender.com/users/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });


      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Une erreur est survenue.");
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      setError("Une erreur réseau est survenue.");
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="flex min-h-screen flex-col justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <img
          className="mx-auto h-12 w-auto"
          src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=black&shade=600"
          alt="Votre entreprise"
        />
        <h2 className="mt-6 text-3xl font-bold text-gray-900">
          Réinitialisez votre mot de passe
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Entrez votre adresse e-mail et nous vous enverrons un lien pour réinitialiser votre mot de passe.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-6 shadow sm:rounded-lg sm:px-12">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Adresse e-mail
              </label>
              <input
              id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
  
                className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder:text-gray-400 focus:border-black focus:ring-black sm:text-sm"
              />
            </div>

            <div>
              <button
                type="submit"
           
                className="flex w-full justify-center rounded-md bg-black px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              >
                 {loading ? "Envoi en cours..." : "Envoyer le lien de réinitialisation"}
              </button>
            </div>
          </form>
           {message && <p className="mt-4 text-green-600">{message}</p>}
            {error && <p className="mt-4 text-red-600">{error}</p>}
            {/* rest of your page */}

          <div className="mt-6 text-center text-sm text-gray-600">
            Vous vous souvenez de votre mot de passe ?{' '}
            <a href="/pages/login" className="font-medium text-black hover:underline">
              Se connecter
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
