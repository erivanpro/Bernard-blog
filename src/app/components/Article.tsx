"use client";
import { User } from "./User";

export type Article = {
  id: number;
  userId: number;
  user: User;
  titre: string;
  soustitre: string;
  datePublication: string; // format date ISO string
  imageCover?: string;
  categorie: string[]; // tableau de catégories
  contenu: string;
  created_at: string;
  updated_at: string;
};
