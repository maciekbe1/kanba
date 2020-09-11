import React from "react";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "ckeditor5-build-classic-plus";

export default function Editor({ editorValue, setEditorValue, isEdit }) {
  return (
    <CKEditor
      editor={ClassicEditor}
      data={editorValue}
      config={editorConfiguration}
      onInit={(editor) => {
        if (isEdit) {
          editor.editing.view.focus();
        }
      }}
      onChange={(event, editor) => {
        const data = editor.getData();
        setEditorValue(data);
      }}
    />
  );
}

const editorConfiguration = {
  toolbar: [
    "undo",
    "redo",
    "|",
    "bold",
    "italic",
    "underLine",
    "strikethrough",
    "alignment",
    "|",
    "heading",
    "fontColor",
    "fontBackgroundColor",
    "fontSize",
    "link",
    "|",
    "bulletedList",
    "numberedList",
    "insertTable",
    "blockQuote",
    "code"
  ]
};
