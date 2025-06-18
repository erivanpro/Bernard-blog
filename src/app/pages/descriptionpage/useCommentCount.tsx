"use client";
import { useEffect, useState } from "react";
export function useCommentCount(articleId: string) {
  const [count, setCount] = useState<number>(0);
  const fetchCount = async () => {
    try {
      const res = await fetch(`https://bernard-backend-a1go.onrender.com/comments/article/${articleId}`);
      if (res.ok) {
        const data = await res.json();
        setCount(data.length); // ou `data.count` si ton backend expose juste le nombre
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du nombre de commentaires :", error);
    }
  };
  useEffect(() => {
    fetchCount();
    const interval = setInterval(fetchCount, 5000); // rafraîchit toutes les 5s
    return () => clearInterval(interval);
  }, [articleId]);
  return count;
}
