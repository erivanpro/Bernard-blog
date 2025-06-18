'use client';

import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useUser } from '@/app/context/UserContext';
import { useRouter } from 'next/navigation';
import React from 'react';

  function Modal({ message, onClose }: { message: string; onClose: () => void }) {
    React.useEffect(() => {
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleEsc);
      return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return (
      <div
        className="fixed inset-0 bg-white/40 backdrop-blur-sm flex items-center justify-center z-50"
        onClick={onClose}
        aria-modal="true"
        role="dialog"
      >
        <div
          className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl relative border border-gray-200"
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
            aria-label="Fermer"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Information</h3>
          <p className="mb-6 text-gray-700 break-words">{message}</p>
          <button
            onClick={onClose}
            className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 w-full transition"
          >
            Fermer
          </button>
        </div>
      </div>
    );
  }

  export default function SignupPage() {
    const router = useRouter();
    const [modalMessage, setModalMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { setUser } = useUser();



    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Cache the form element
    const form = e.currentTarget;
    const formData = new FormData(form);
    const interests = formData.getAll('interests') as string[];
    const firstname = formData.get('prenom') as string | null;
    const lastname = formData.get('nom') as string | null;
    const email = formData.get('email') as string | null;
    const password = formData.get('password') as string | null;
    const birthday = formData.get('birthday') as string | null;
    if (!firstname || !lastname || !email || !password) {
      alert('Veuillez remplir tous les champs obligatoires.');
      setIsSubmitting(false);
      return;
    }
    const data = {
      firstname,
      lastname,
      email,
      birthday: birthday ?? undefined,
      profile_image: "https://images.unsplash.com/photo-1742241107816-349e7f7c0f50?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxfHx8ZW58MHx8fHx8",
      interests,
      password,
    };
    try {
      const res = await fetch('http://localhost:2000/users/insert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errorText = await res.text();
        let message = 'Erreur lors de la création de l\'utilisateur.';
        try {
          const errorJson = JSON.parse(errorText);
          if (errorJson.message) {
            switch (errorJson.message) {
              case 'User with this email already exists':
                message = "Un utilisateur avec cet e-mail existe déjà.";
                break;
              default:
                message = errorJson.message;
            }
          }
        } catch {}
        setModalMessage(message);
        setIsSubmitting(false);
        return;
      }
      setModalMessage('Utilisateur créé avec succès !');
      setUser(data);
      form.reset();  // 👈 use cached form here
      router.push('pages/dashboard');
    } catch (error) {
      setModalMessage(
        error instanceof Error
          ? `Erreur : ${error.message}`
          : 'Une erreur inconnue est survenue.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };





  return (
    <div className="flex min-h-screen flex-col justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <img
          alt="Votre entreprise"
          src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=black&shade=600"
          className="mx-auto h-12 w-auto"
        />
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Créer un compte</h2>
        <p className="mt-2 text-sm text-gray-600">
          Rejoignez-nous dès aujourd'hui et découvrez une nouvelle expérience.
        </p>
      </div>

      {modalMessage && <Modal message={modalMessage} onClose={() => setModalMessage(null)} />}

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white py-10 px-6 shadow-md sm:rounded-lg sm:px-12">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Prénom */}
            <div>
              <label htmlFor="prenom" className="block text-sm font-medium text-gray-700">
                Prénom
              </label>
              <input
                type="text"
                id="prenom"
                name="prenom"
                required
                className="mt-2 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                disabled={isSubmitting}
              />
            </div>

            {/* Nom */}
            <div>
              <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
                Nom
              </label>
              <input
                type="text"
                id="nom"
                name="nom"
                required
                className="mt-2 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                disabled={isSubmitting}
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Adresse e-mail
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="mt-2 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                disabled={isSubmitting}
              />
            </div>

            {/* Mot de passe */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                className="mt-2 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                disabled={isSubmitting}
              />
            </div>

            {/* Date de naissance */}
            <div>
              <label htmlFor="birthday" className="block text-sm font-medium text-gray-700">
                Date de naissance
              </label>
              <input
                type="date"
                id="birthday"
                name="birthday"
                required
                className="mt-2 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                disabled={isSubmitting}
              />
            </div>

            {/* Intérêts */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sujets qui vous intéressent
              </label>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {['Voyages', 'Santé', 'Technologie'].map((interest) => (
                  <label
                    key={interest}
                    className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm text-gray-700 shadow-sm hover:bg-gray-50 cursor-pointer transition"
                  >
                    <input
                      type="checkbox"
                      name="interests"
                      value={interest.toLowerCase()}
                      className="peer hidden"
                      disabled={isSubmitting}
                    />
                    <div className="h-5 w-5 rounded border border-gray-300 bg-white peer-checked:bg-black peer-checked:border-black transition"></div>
                    {interest}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-black px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-black"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Envoi..." : "S'inscrire"}
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Vous avez déjà un compte ?{' '}
            <a href="/pages/login" className="font-medium text-black hover:underline">
              Connectez-vous
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
