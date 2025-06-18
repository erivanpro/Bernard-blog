import React, { useState } from 'react';
import { useUser } from '@/app/context/UserContext';
import { EditorComponent } from './Editor';


type Article = {
  imageCover: File | null;
  titre: string;
  soustitre: string;
  datePublication: string;
  images: File[];
  categorie: string;
  keywords: string[];
  contenu: string;
  gridContent: string;
  adressePublication: string;
};





export default function AjouterArticle() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
const [article, setArticle] = useState<Article>({
  imageCover: null,
  titre: '',
  soustitre: '',
  datePublication: '',
  images: [],
  keywords: [],
  categorie: 'santé',
  contenu: '',
  gridContent: '',
  adressePublication: '',
});

  

 const handleChangeField = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
) => {
  const { name, value } = e.target;
  if (name === 'imageCover') {
    const input = e.target as HTMLInputElement;
    setArticle((prev) => ({ ...prev, imageCover: input.files?.[0] ?? null }));
  } else if (name === 'images') {
    const input = e.target as HTMLInputElement;
    setArticle((prev) => ({ ...prev, images: input.files ? Array.from(input.files) : [] }));
} else {
  setArticle((prev) => ({ ...prev, [name]: value }));
  }
};


  const handleContentChange = (value: string) => {
    setArticle((prev) => ({ ...prev, contenu: value }));
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "unsigned_profile_upload"); // Remplace par ton preset
    const CLOUD_NAME = "dxtkcaqlk";
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    return data.secure_url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return alert("Utilisateur non identifié");
    if (!article.titre.trim() || !article.soustitre.trim() || !article.contenu.trim()) {
      return alert("Merci de remplir tous les champs obligatoires.");
    }

    setLoading(true);

    try {
      // Upload imageCover
      let imageCoverUrl = "";
      if (article.imageCover) {
        imageCoverUrl = await uploadToCloudinary(article.imageCover);
      }
      // Upload images[]
      const imagesUrls: string[] = [];
      for (const file of article.images) {
        const url = await uploadToCloudinary(file);
        imagesUrls.push(url);
      }
     const payload = {
        titre: article.titre,
        soustitre: article.soustitre,
        datePublication: article.datePublication,
        categorie: article.categorie,
        contenu: article.contenu,
        imageCover: imageCoverUrl,
        images: imagesUrls,
        keywords: article.keywords,
        userId: user.id,
        gridContent: parseInt(article.gridContent, 10),

        adressePublication: article.adressePublication,
      };

      const res = await fetch('https://bernard-backend-a1go.onrender.com/articles/insert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Article publié !");
        setArticle({
          imageCover: null,
          titre: '',
          soustitre: '',
          datePublication: '',
          images: [],
          categorie: 'santé',
          keywords: [],
          contenu: '',
          gridContent: '',
          adressePublication: '',
        });
      } else {
        alert("Erreur lors de la publication");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l’upload des images");
    } finally {
      setLoading(false);
    }
  };








  

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white rounded-xl shadow-md mt-12 border border-gray-200">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Image couverture */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700 text-sm">Image de couverture</label>
            <input
              type="file"
              name="imageCover"
              onChange={handleChangeField}
              accept="image/*"
              className="
                block w-full text-gray-700
                file:rounded-md file:border-0 file:px-4 file:py-2
                file:bg-blue-500 file:text-white file:text-sm file:font-medium
                hover:file:bg-blue-600 transition cursor-pointer
              "
            />
            {article.imageCover && (
              <img
                src={URL.createObjectURL(article.imageCover)}
                alt="Image de couverture"
                className="mt-3 rounded-lg border border-gray-300 object-cover max-h-36 shadow-sm"
              />
            )}
          </div>




          {/* Titre */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700 text-sm">Titre</label>
            <input
              type="text"
              name="titre"
              value={article.titre}
              onChange={handleChangeField}
              placeholder="Titre de l'article"
              className="
                w-full border border-gray-300 px-4 py-2 rounded-md shadow-sm
                focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400
                transition text-sm
              "
              required
            />
          </div>

          {/* Sous-titre */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700 text-sm">Sous-titre</label>
            <input
              type="text"
              name="soustitre"
              value={article.soustitre}
              onChange={handleChangeField}
              placeholder="Sous-titre"
              className="
                w-full border border-gray-300 px-4 py-2 rounded-md shadow-sm
                focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400
                transition text-sm
              "
              required
            />
          </div>



          {/* Adresse de publication */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700 text-sm">Adresse de publication</label>
            <input
              type="text"
              name="adressePublication"
              value={article.adressePublication}
              onChange={handleChangeField}
              placeholder="ex: Paris, France"
              className="
                w-full border border-gray-300 px-4 py-2 rounded-md shadow-sm
                focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400
                transition text-sm
              "
            />
          </div>

         



          {/* Date publication */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700 text-sm">Date de publication</label>
            <input
              type="date"
              name="datePublication"
              value={article.datePublication}
              onChange={handleChangeField}
              className="
                w-full border border-gray-300 px-4 py-2 rounded-md shadow-sm
                focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400
                transition text-sm
              "
              required
            />
          </div>

          {/* Images supplémentaires */}
          <div className="col-span-1 md:col-span-2">
            <label className="block mb-2 font-semibold text-gray-700 text-sm">Images supplémentaires</label>
            <input
              type="file"
              name="images"
              onChange={handleChangeField}
              multiple
              accept="image/*"
              className="
                block w-full text-gray-700
                file:rounded-md file:border-0 file:px-4 file:py-2
                file:bg-gray-200 file:text-gray-800 file:text-sm file:font-medium
                hover:file:bg-gray-300 transition cursor-pointer
              "
            />
            {/* Choix taille grille */}
            <label className="block mt-5 mb-1 font-semibold text-gray-600 text-xs">Choisir la grille d'affichage</label>
        


        <select
  name="gridContent"
  value={article.gridContent}
  onChange={handleChangeField}
>
  <option value="3">3 x 3</option>
  <option value="4">4 x 4</option>
  <option value="5">5 x 5</option>
</select>


           
          </div>

          {/* Catégorie */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700 text-sm">Catégorie</label>
            <select
              name="categorie"
              value={article.categorie}
              onChange={handleChangeField}
              className="
                w-full border border-gray-300 px-4 py-2 rounded-md shadow-sm
                focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400
                transition bg-white text-sm cursor-pointer
              "
            >
              <option value="santé">Santé</option>
              <option value="technologie">Technologie</option>
              <option value="voyages">Voyages</option>
            </select>
          </div>
        </div>

      <div>
      <label className="block mb-2 font-semibold text-gray-700 text-sm">Mots-clés (séparés par des virgules)</label>
      <input
        type="text"
        name="keywords"
        value={article.keywords.join(', ')}
        onChange={(e) =>
          setArticle((prev) => ({
            ...prev,
            keywords: e.target.value.split(',').map(k => k.trim()),
          }))
        }
        placeholder="ex: santé, bien-être, nutrition"
        className="w-full border border-gray-300 px-4 py-2 rounded-md shadow-sm text-sm"
      />
    </div>


    <EditorComponent
      article={article}
setArticle={setArticle}
    />
  


       
        <button
          type="submit"
          disabled={loading}
          className={`
            w-64 px-6 py-2 rounded-lg text-white font-semibold text-base shadow-lg
            ${loading
              ? 'bg-blue-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
            }
            transition duration-200 ease-in-out transform hover:scale-105 active:scale-95
            focus:outline-none focus:ring-2 focus:ring-blue-400
          `}
          aria-busy={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
              </svg>
              Publication en cours...
            </span>
          ) : (
            "Publier l'article"
          )}
        </button>
      </form>
    </div>
  );
}


      

        export interface EditorProps  {
          article: Article;
setArticle: React.Dispatch<React.SetStateAction<Article>>;
        }

      
