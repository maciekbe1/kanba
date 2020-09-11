import React, { useEffect, useRef } from "react";

import Drawer from "./Drawer";
import AppBar from "./AppBar";
import Bar from "components/Layouts/Bar";
import ReactGA from "react-ga";

import { SnackbarProvider } from "notistack";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

import "../../assets/styles/global.scss";

interface Props {
  isAuth: boolean;
  children: any;
}
const TRACKING_ID = "UA-158049591-1";
function initializeReactGA() {
  const trackingID: string = TRACKING_ID;
  ReactGA.initialize(trackingID, {
    gaOptions: {
      siteSpeedSampleRate: 100
    }
  });
  ReactGA.pageview(window.location.pathname + window.location.search);
}
export default function Layout({ isAuth, children }: Props): JSX.Element {
  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      initializeReactGA();
    }
  }, []);
  const notistackRef = useRef<any>(null);
  const onClickDismiss = (key: any) => () => {
    notistackRef.current.closeSnackbar(key);
  };
  if (isAuth) {
    return (
      <SnackbarProvider
        maxSnack={3}
        ref={notistackRef}
        action={(key) => (
          <IconButton
            color="default"
            size="small"
            onClick={onClickDismiss(key)}
          >
            <CloseIcon />
          </IconButton>
        )}
      >
        <Drawer>
          <Bar />
          {children}
        </Drawer>
      </SnackbarProvider>
    );
  } else {
    return (
      <AppBar>
        <Bar />
        {children}
      </AppBar>
    );
  }
}
