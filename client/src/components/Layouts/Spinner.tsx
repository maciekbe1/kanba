import React from "react";

import CircularProgress from "@material-ui/core/CircularProgress";
import "./_spinner.scss";
export default function Spinner({ text }: any) {
  return (
    <div className="flex-d-column layout-spinner">
      <h5>{text}</h5>
      <CircularProgress size={50} />
    </div>
  );
}
