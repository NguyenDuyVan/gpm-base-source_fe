"use client";
import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

interface EditorWrapperProps {
  value?: string;
  onChange?: (content: string) => void;
}

const EditorWrapper = ({
  value = "<p>Hello from CKEditor 5!</p>",
  onChange,
}: EditorWrapperProps) => {
  return (
    <CKEditor
      editor={ClassicEditor as any}
      data={value}
      onChange={(event: any, editor: any) => {
        const data = editor.getData();
        if (onChange) {
          onChange(data);
        }
      }}
    />
  );
};

export default EditorWrapper;
