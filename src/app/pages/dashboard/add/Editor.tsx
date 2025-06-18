import React from "react";
import { EditorProps } from "./addanarticle";
import Editor, {
  Toolbar,
  BtnBold,
  BtnItalic,
  BtnUnderline,
  BtnBulletList,
  BtnNumberedList,
} from "react-simple-wysiwyg";

export function EditorComponent({ article, setArticle }: EditorProps) {
  return (
    <div>
      <label className="block mb-3 font-semibold text-gray-700 text-base">
        Contenu (WYSIWYG)
      </label>

      <Editor
        value={article.contenu}
        onChange={(e: any) =>
          setArticle((prev) => ({ ...prev, contenu: e.target.value }))
        }
      >
        <Toolbar>
          <BtnBold />
          <BtnItalic />
          <BtnUnderline />
          <BtnBulletList />
          <BtnNumberedList />
        </Toolbar>
      </Editor>
    </div>
  );
}
