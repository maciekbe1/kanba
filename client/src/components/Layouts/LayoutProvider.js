import React from "react";
import { createMuiTheme } from "@material-ui/core/styles";
import blue from "@material-ui/core/colors/blue";
import green from "@material-ui/core/colors/green";
import red from "@material-ui/core/colors/red";
import { useSelector } from "react-redux";
import { ThemeProvider } from "@material-ui/styles";

export default function LayoutProvider(props) {
  const primary = blue[800];
  const success = green[500];
  const successHover = green[800];

  const error = red[500];
  const themeType = useSelector(state => state.layoutReducer.theme);
  const theme = createMuiTheme({
    palette: {
      type: themeType ? "dark" : "light",
      primary: {
        main: primary
      },
      success: {
        main: success,
        hover: successHover
      },
      error: {
        main: error
      }
    },
    status: {
      danger: "orange"
    }
  });
  return <ThemeProvider theme={theme}>{props.children}</ThemeProvider>;
}
