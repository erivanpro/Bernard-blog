"use client";
import React, { use, useEffect, useState } from "react";
import CommentDrawer from "./commentdrawer"; // 🔁 ajuste le chemin selon ton projet
import { useUser } from "@/app/context/UserContext";
import Modal from "../LikeModal";
import NavbarTop from "../navbar/navbartop";

interface Article {
  id: string;
  titre: string;
  soustitre: string;
  datePublication: string;
  adressePublication?: string;
  keywords?: string[];
  categorie?: string;
  imageCover?: string;
  contenu?: string;
  images?: string[];           // plusieurs images
  gridContent?: number;        // pour définir la grille (4 ou 5)
  user?: {
    firstname: string;
    lastname: string;
    profile_image?: string;
  };
}

interface Comment {
  id: number;
  content: string;
  createdAt: string;
  user: {
    firstname: string;
    lastname: string;
    profile_image?: string;
  };
}

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default function Page({ params }: Props) {
  const { id } = use(params);
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likes, setLikes] = useState<number>(0);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const { user } = useUser();
  const lastCommentUser = comments.length > 0 ? comments[0].user : null;
  const [commentCount, setCommentCount] = useState<number>(0);

  const toggleComments = () => setShowComments(true);

  const handleLike = async () => {
    try {
      const userId = user?.id;
      const res = await fetch(
        `http://localhost:2000/likes?userId=${userId}&articleId=${id}`,
        { method: "POST" }
      );
      if (!res.ok) {
        const errorData = await res.json();
        setModalMessage(errorData.message || "Erreur lors du like.");
        setShowModal(true);
        return;
      }
      setLikes((prev) => prev + 1);
    } catch (e) {
      setModalMessage("Erreur de connexion au serveur.");
      setShowModal(true);
    }
  };

  useEffect(() => {
    fetch(`http://localhost:2000/articles/post/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Article non trouvé");
        return res.json();
      })
      .then((data: Article) => setArticle(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const res = await fetch(
          `http://localhost:2000/likes/article/${id}/count`
        );
        const data = await res.json();
        setLikes(data.totalLikes || 0);
      } catch (e) {
        console.error("Erreur lors du chargement des likes :", e);
      }
    };

    fetchLikes();
  }, [id]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const fetchCommentCount = async () => {
      try {
        const res = await fetch(
          `http://localhost:2000/comments/article/${id}/count`
        );
        const data = await res.json();
        setCommentCount(data.totalComments || 0);
      } catch (e) {
        console.error(
          "Erreur lors du chargement du nombre de commentaires :",
          e
        );
      }
    };
    fetchCommentCount();
    intervalId = setInterval(fetchCommentCount, 20000);
    return () => clearInterval(intervalId);
  }, [id]);

  if (loading)
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 animate-pulse">
        Chargement…
      </div>
    );
  if (error)
    return <p className="text-center text-red-500 mt-10">Erreur : {error}</p>;
  if (!article)
    return (
      <p className="text-center text-gray-500 mt-10">
        Aucun article à afficher.
      </p>
    );

  // Grille dynamique : 4 ou 5
  const gridCount = article.gridContent === 5 ? 5 : 4;

  return (
    <>
    <NavbarTop/>
      <div className="max-w-4xl mt-12 mx-auto px-4 py-10 scroll-smooth relative">
        {/* Image Cover */}
        {article.imageCover && (
          <div className="mb-8">
            <img
              src={article.imageCover}
              alt={article.titre}
              className="w-full rounded-2xl object-cover max-h-[500px]"
            />
          </div>
        )}

        {/* Meta */}
        <div className="flex flex-col sm:flex-row sm:justify-between text-sm text-gray-500 mb-4 gap-2">
          <p>
            Publié le{" "}
            {new Date(article.datePublication).toLocaleDateString("fr-FR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>

          {article.adressePublication && (
            <p className="italic text-gray-600">Adresse: {article.adressePublication}</p>
          )}

          {article.categorie && (
            <p className="font-semibold text-indigo-700">Catégorie : {article.categorie}</p>
          )}

          {article.keywords && article.keywords.length > 0 && (
            <p className="text-gray-600">
              Mots-clés :{" "}
              {article.keywords.map((k, i) => (
                <span
                  key={k}
                  className="inline-block bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded mr-1"
                >
                  {k}
                </span>
              ))}
            </p>
          )}

          {article.user && (
            <div className="flex items-center space-x-2">
              {article.user.profile_image && (
                <img
                  src={article.user.profile_image}
                  alt={article.user.firstname}
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}
              <span>
                {article.user.firstname} {article.user.lastname}
              </span>
            </div>
          )}
        </div>

        {/* Like/Comment */}
        <div className="mt-6 flex justify-center">
          <div
            className="flex items-center gap-6 px-6 py-3 rounded-2xl border shadow-sm"
            style={{
              background: "rgba(255, 255, 255, 0.2)",
              borderRadius: "16px",
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
              backdropFilter: "blur(5px)",
              WebkitBackdropFilter: "blur(5px)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
            }}
          >
            <button
              onClick={handleLike}
              className="flex items-center gap-1 text-sm text-gray-700 hover:text-red-600 transition"
            >
              ❤️ <span>{likes}</span>
            </button>

            <button
              onClick={toggleComments}
              className="flex items-center gap-1 text-sm text-gray-700 hover:text-green-600 transition"
            >
              💬 <span>{commentCount}</span>
            </button>

            {lastCommentUser && (
              <div className="text-sm text-gray-600 flex items-center gap-1">
                • Dernier par{" "}
                <span className="font-medium">
                  {lastCommentUser.firstname} {lastCommentUser.lastname}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Title & Subtitle */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4 mt-10">
          {article.titre}
        </h1>
        <p className="text-lg text-gray-600 mb-8">{article.soustitre}</p>

        {/* Content */}
        <div className="prose prose-lg max-w-none text-gray-800 space-y-16">
          {article.contenu && (
            <div dangerouslySetInnerHTML={{ __html: article.contenu }} />
          )}
        </div>

        {/* Images Grid */}
        {article.images && article.images.length > 0 && (
          <div
            className={`grid gap-4 mt-10`}
            style={{
              gridTemplateColumns: `repeat(${gridCount}, minmax(0, 1fr))`,
            }}
          >
            {article.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Image supplémentaire ${idx + 1}`}
                className="w-full h-48 object-cover rounded-lg"
              />
            ))}
          </div>
        )}

        {/* Drawer commentaires */}
        {showComments && (
          <CommentDrawer
            articleId={id}
            userId={user?.id || 1} // remplacer par l'id user connecté
            onClose={() => setShowComments(false)}
          />
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        message={modalMessage}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}
