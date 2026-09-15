"use client";

import { Textarea } from "@/components/ui/textarea";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useRef, useState } from "react";
import { BubbleMenu } from '@tiptap/react/menus'
import { Separator } from "@/components/ui/separator";

type RichTextFieldProps = {
  name: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
};

export function RichTextField({
  name,
  defaultValue = "",
  placeholder,
  required,
}: RichTextFieldProps) {
  const [value, setValue] = useState(defaultValue);
 
  const editor = useEditor({
    extensions: [StarterKit],
    content: defaultValue,
    immediatelyRender: false,
    onUpdate({ editor }) {
      setValue(editor.getHTML());
    },
  });


  useEffect(() => {
    if (!editor) return;

    editor.commands.setContent(defaultValue || "");
    setValue(defaultValue || "");
  }, [editor, defaultValue]);

  if (!editor) return null;

  return (
    <div>

<BubbleMenu editor={editor} className="flex gap-2 bg-foreground text-secondary rounded-md p-2">
  <button
    type="button"
    onClick={()=> editor.chain().focus().toggleBold().run()}
    className="hover:text-secondary/60 cursor-pointer transition-all"
  >
    Bold
  </button>
  <Separator orientation="vertical"/>

  <button
    type="button"
    onClick={()=> editor.chain().focus().toggleItalic().run()}
        className="hover:text-secondary/60 cursor-pointer transition-all"

  >
    Italic
  </button>

  <Separator orientation="vertical"/>

  <button
    type="button"
    onClick={() => editor.chain().focus().toggleBulletList().run()}
      className="hover:text-secondary/60 cursor-pointer transition-all"

  >
    Bullets
  </button>
</BubbleMenu>

      <EditorContent
        editor={editor}
        className="min-h-30 p-3 border-2 border-foreground rounded-md [&_.ProseMirror]:min-h-30 [&_.ProseMirror]:outline-none [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-6"
        aria-label={placeholder}
      />

      <input type="hidden" name={name} value={value} />
    </div>
  );
}