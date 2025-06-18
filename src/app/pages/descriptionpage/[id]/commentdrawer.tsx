"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@/app/context/UserContext";

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

interface CommentDrawerProps {
  articleId: string;
  userId: number;
  onClose: () => void;
}

export default function CommentDrawer({ articleId, userId, onClose }: CommentDrawerProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const { user } = useUser(); 

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://bernard-backend-a1go.onrender.com/comments/article/${articleId}`);
      const data = await res.json();
      setComments(data);
    } catch (e) {
      console.error("Erreur lors du chargement des commentaires", e);
    } finally {
      setLoading(false);
    }
  };

  const handlePostComment = async () => {
    if (!newComment.trim()) return;
    const userId = user?.id;
    if (!userId) {
      console.error("User is not logged in or user ID is undefined");
      alert("Vous devez être connecté pour commenter.");
      return;
    }
    const payload = {
      content: newComment,
      userId,
      articleId: parseInt(articleId),
    };
    try {
      const res = await fetch("https://bernard-backend-a1go.onrender.com/comments/insert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      let data;
      try {
        data = await res.json();
      } catch {
        data = null;
      }
      if (!res.ok) {
        console.error("Backend returned error:", data);
        throw new Error(data?.message || "Échec de l'envoi du commentaire");
      }
      setNewComment("");
      fetchComments();
    } catch (e) {
      console.error("Posting comment failed:", e);
      alert(e instanceof Error ? e.message : "Une erreur inattendue est survenue");
    }
  };

  useEffect(() => {
    fetchComments();
  }, [articleId]);

  return (
    <div
      className="
        fixed top-0 right-0 w-full sm:w-[400px] h-full 
        bg-white/30 border border-white/40
        backdrop-blur-lg
        shadow-xl
        border-l
        border-gray-200/30
        z-50 overflow-y-auto
        transition-transform duration-300 ease-in-out
        rounded-l-xl
        "
    >
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gray-50/40 backdrop-blur-sm">
        <h2 className="text-xl font-bold text-gray-800">Commentaires</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-red-500 text-2xl transition"
          aria-label="Fermer"
        >
          ✖
        </button>
      </div>

      {/* New Comment */}
      <div className="p-6 border-b border-gray-100 bg-white/40 backdrop-blur-sm">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Écrivez un commentaire..."
          className="w-full border border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-lg px-3 py-2 text-sm transition resize-none bg-white/50 backdrop-blur-sm"
          rows={3}
        />
        <button
          onClick={handlePostComment}
          className="mt-3 bg-black hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-[8px] transition"
        >
          Publier
        </button>
      </div>

      {/* Comment List */}
      <div className="px-6 py-4">
        {loading ? (
          <p className="text-gray-500 text-sm">Chargement des commentaires...</p>
        ) : comments.length === 0 ? (
          <p className="text-gray-500 text-sm">Aucun commentaire pour cet article.</p>
        ) : (
          <ul className="space-y-4">
            {comments.map((comment) => (
              <li key={comment.id} className="bg-gray-50/50 p-4 rounded-lg shadow-sm backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-2">
                  {comment.user?.profile_image ? (
                    <img
                      src={comment.user.profile_image}
                      className="w-8 h-8 rounded-full object-cover border"
                      alt="avatar"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-300" />
                  )}
                  <div className="text-sm font-medium text-gray-800">
                    {comment.user.firstname} {comment.user.lastname}
                  </div>
                </div>
                <p className="text-sm text-gray-700">{comment.content}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(comment.createdAt).toLocaleString("fr-FR", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
