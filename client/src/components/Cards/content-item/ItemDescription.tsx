import React, { useState, useEffect } from "react";
import Editor from "components/Editor/Editor";
import EditorButtons from "components/Editor/EditorButtons";

import parse from "react-html-parser";

interface Props {
  onSaveDescription?: Function;
  createCardItem?: Function;
  onClose?: Function;
  isNew: boolean;
  description: string;
}

export default function Description({
  onSaveDescription,
  description,
  isNew,
  createCardItem,
  onClose
}: Props) {
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
    if (onSaveDescription) onSaveDescription(editorValue);
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
      {edit || isNew ? (
        <>
          <Editor
            editorValue={editorValue ? editorValue : ""}
            setEditorValue={setEditorValue}
            isEdit={edit}
          />
          <EditorButtons
            onSave={
              isNew && createCardItem ? () => createCardItem(editorValue) : save
            }
            onCancel={isNew ? onClose : onCancel}
          />
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
