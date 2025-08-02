"use client";
import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const EditorWrapper = () => {
  return (
    <CKEditor
      editor={ClassicEditor as any}
      data="<p>Hello from CKEditor 5!</p>"
      onReady={() => {
        // You can store the "editor" and use when it is needed.
      }}
      // onChange={(editor) => {
      //     editor.getData();
      // }}
    />
  );
};

export default EditorWrapper;
