import React from "react";
import { Route } from "react-router-dom";

import { Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

interface Props {
  component: any;
  path: string;
}

export default function RedirectRoute({
  component: Component,
  ...rest
}: Props) {
  const { isAuth } = useSelector(({ authReducer }: any) => authReducer);

  return (
    <Route
      render={(props) =>
        isAuth ? <Redirect to="/" /> : <Component {...props} />
      }
      {...rest}
    />
  );
}
