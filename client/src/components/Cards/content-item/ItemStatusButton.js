import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

export default function StatusButton({ element, children }) {
  const background = element.color?.background || "#fff";
  const hover = element.color?.hover || "#fff";

  const ColorButton = withStyles((theme) => ({
    root: {
      backgroundColor: background,
      "&:hover": {
        backgroundColor: hover
      }
    }
  }))(Button);

  return (
    <div>
      <ColorButton
        variant="contained"
        color={element.color?.text || "default"}
        disableRipple
        aria-controls="simple-menu"
        aria-haspopup="true"
        startIcon={element.icon ? element.icon : null}
        size="small"
      >
        {children}
      </ColorButton>
    </div>
  );
}
