import { useUser, User } from "@/app/context/UserContext";
import React, { useState } from "react";

type UserProfileProps = {
  user?: User;
  onSave: (user: User & { userId?: string }) => void;
};

export default function UserProfile({ user, onSave }: UserProfileProps) {
  const { user: currentUser, setUser } = useUser();

  const normalizeProfileImage = (
    u: User | undefined
  ): Partial<User> | undefined =>
    u ? { ...u, profile_image: u.profile_image ?? undefined } : undefined;

  const initialUser: Partial<User> =
    normalizeProfileImage(user) ||
    normalizeProfileImage(currentUser ?? undefined) ||
    {};

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstname: initialUser.firstname || "",
    lastname: initialUser.lastname || "",
    email: initialUser.email || "",
    birthday: initialUser.birthday || "",
    interests: (initialUser.interests || []).join(", "),
    profile_image: initialUser.profile_image || "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser?.id) {
      alert("Identifiant utilisateur manquant");
      return;
    }

    const interestsArray = formData.interests
      .split(",")
      .map((i) => i.trim())
      .filter((i) => i.length > 0);

    const updatedUser: Partial<User> = {
      firstname: formData.firstname,
      lastname: formData.lastname,
      email: formData.email,
      birthday: formData.birthday,
      profile_image: formData.profile_image,
      interests: interestsArray,
    };

    if (formData.password.trim() !== "") {
      updatedUser.password = formData.password.trim();
    }

    try {
      const res = await fetch(
        `http://localhost:2000/users/update/${currentUser.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedUser),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        let errorMessage = `Erreur HTTP ${res.status}`;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || JSON.stringify(errorData);
        } catch {
          errorMessage = errorText;
        }
        throw new Error(errorMessage);
      }

      const savedUser: User = await res.json();
      console.log("✅ Utilisateur mis à jour :", savedUser);

      // Mise à jour du contexte user pour rafraîchir toutes les UI dépendantes
      setUser(savedUser);

      if (onSave) onSave(savedUser);

      setIsEditing(false);
      setFormData((prev) => ({ ...prev, password: "" })); // clear password input
    } catch (err) {
      console.error("❌ Erreur de mise à jour :", err);
      alert(
        "Une erreur est survenue lors de la mise à jour du profil :\n" +
          (err instanceof Error ? err.message : String(err))
      );
    }
  };

  return (
    <div className="mt-auto mx-0">
      <h2 className="text-xl mb-12">
        Modifier mon profil
      </h2>
      {isEditing ? (
        <form
          onSubmit={handleSubmit}
          className="bg-gray-50 p-4 rounded shadow-md max-w-md mx-auto"
          noValidate
        >
          <h3 className="mb-4 text-lg font-semibold">
            Nouveau profil
          </h3>

          <label className="block mb-2">
            Prénom
            <input
              type="text"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              className="mt-1 block w-full rounded border border-gray-300 p-2"
              required
            />
          </label>

          <label className="block mb-2">
            Nom
            <input
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              className="mt-1 block w-full rounded border border-gray-300 p-2"
              required
            />
          </label>

          <label className="block mb-2">
            Email
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded border border-gray-300 p-2"
              required
            />
          </label>

          <label className="block mb-2">
            Date de naissance
            <input
              type="date"
              name="birthday"
              value={formData.birthday}
              onChange={handleChange}
              className="mt-1 block w-full rounded border border-gray-300 p-2"
            />
          </label>

          <label className="block mb-2">
            Intérêts (séparés par des virgules)
            <input
              type="text"
              name="interests"
              value={formData.interests}
              onChange={handleChange}
              className="mt-1 block w-full rounded border border-gray-300 p-2"
              placeholder="voyage, sport, lecture"
            />
          </label>

          <label className="block mb-2">
            URL image de profil
            <input
              type="url"
              name="profile_image"
              value={formData.profile_image}
              onChange={handleChange}
              className="mt-1 block w-full rounded border border-gray-300 p-2"
              placeholder="https://exemple.com/photo.jpg"
            />
          </label>

          <label className="block mb-4">
            Mot de passe (laisser vide pour ne pas changer)
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full rounded border border-gray-300 p-2"
              autoComplete="new-password"
            />
          </label>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Enregistrer
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50 rounded"
        >
          <img
            src={
              initialUser.profile_image ??
              "https://via.placeholder.com/100x100?text=User"
            }
            alt={`${initialUser.firstname ?? "Invité"} ${
              initialUser.lastname ?? ""
            }`}
            className="h-8 w-8 rounded-full bg-gray-50 object-cover"
          />
          <span>
            {initialUser.firstname
              ? `${initialUser.firstname} ${initialUser.lastname ?? ""}`
              : "Invité"}
          </span>
        </button>
      )}
    </div>
  );
}
