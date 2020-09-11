import React from "react";
import LinearProgress from "@material-ui/core/LinearProgress";

export default function ProgressBar({}) {
  return (
    <div>
      <LinearProgress value={50} />
    </div>
  );
}
