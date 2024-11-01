"use client";
import { useMemo, useRef, useState } from "react";

// import QuillEditor from "react-quill";
import "react-quill/dist/quill.snow.css";
import React from "react";
import dynamic from "next/dynamic";

const QuillEditor = dynamic(() => import("react-quill"), { ssr: false });

// interface props {
//   handleContent: (e: any) => void;
//   content: string;
// }

const Editor = ({ handleContent, content }) => {
  const quill = useRef(null);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [2, 3, 4, false] }],
          ["bold", "italic", "underline", "blockquote"],
          [{ color: [] }],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
          ],
        ],
      },
      clipboard: {
        matchVisual: true,
      },
    }),
    []
  );

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "color",
    "clean",
  ];

  return (
    <div className="mt-4">
      <QuillEditor
        ref={(el) => (quill.current = el)}
        className={
          " w-full text-white rounded-lg min-h-[20rem] border-[#595959] hover:border-[#fc923b] border-solid border  focus:outline-none appearance-none focus:ring-0"
        }
        placeholder="Describe the bounty requirements in details"
        theme="snow"
        value={content}
        formats={formats}
        modules={modules}
        onChange={handleContent}
      />
    </div>
  );
};

export default Editor;
