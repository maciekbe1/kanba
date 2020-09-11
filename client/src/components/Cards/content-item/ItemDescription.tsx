import React, { useState, useEffect } from "react";
import Editor from "components/Editor/Editor";
import EditorButtons from "components/Editor/EditorButtons";

import parse from "react-html-parser";

interface Props {
  description: any;
  onSaveDescription: Function;
}

export default function Description({ description, onSaveDescription }: Props) {
  const [edit, setEdit] = useState(false);
  const [editorValue, setEditorValue] = useState("");
  const [memoValue, setMemoValue] = useState("");

  useEffect(() => {
    setEditorValue(description);
    setMemoValue(description);
    setEdit(false);
  }, [description]);

  const save = () => {
    setEdit(!edit);
    if (editorValue !== memoValue) {
      setMemoValue(editorValue);
    }
    onSaveDescription(editorValue);
  };

  const onCancel = () => {
    setEdit(!edit);
    setEditorValue(memoValue);
  };

  const onSetEdit = (e: any) => {
    if (e.target.nodeName !== "A") {
      setEdit(true);
    }
  };

  return (
    <div className="card-description">
      <p className="card-description-title">Description</p>
      {edit ? (
        <>
          <Editor
            editorValue={editorValue ? editorValue : ""}
            setEditorValue={setEditorValue}
            isEdit={edit}
          />
          <EditorButtons onSave={save} onCancel={onCancel} />
        </>
      ) : (
        <div
          className="card-description-textbox w-100"
          onClick={(e) => onSetEdit(e)}
        >
          {editorValue ? (
            parse(editorValue)
          ) : (
            <span style={{ color: "#cfcfcf" }}>Add content</span>
          )}
        </div>
      )}
    </div>
  );
}
