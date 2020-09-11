import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import ProtectedRoute from "components/Utils/ProtectedRoute";
import RedirectRoute from "components/Utils/RedirectRoute";

import HomePage from "components/HomePage";
import { useSelector } from "react-redux";
import Signup from "components/Auth/Signup";
import Signin from "components/Auth/Signin";

import Dashboard from "components/Dashboard/Dashboard";
import AccountVerify from "components/Account/Verify";
import EmailVerify from "components/ResetPassword/EmailVerify";
import SetPassword from "components/ResetPassword/SetPassword";
import CssBaseline from "@material-ui/core/CssBaseline";
import LayoutProvider from "components/Layouts/LayoutProvider";
import Layout from "components/Layouts/Layout";
import { CardsPrivate, ProjectsPrivate } from "components/Private";
import NotFound from "components/Utils/NotFound";

function App() {
  const { isAuth } = useSelector(({ authReducer }: any) => authReducer);
  return (
    <LayoutProvider>
      <BrowserRouter>
        <CssBaseline />
        <Layout isAuth={isAuth}>
          <Switch>
            {isAuth ? (
              <ProtectedRoute
                path="/"
                exact
                render={(render: any) => <Dashboard {...render} />}
              />
            ) : (
              <Route
                path="/"
                exact
                render={(render: any) => <HomePage {...render} />}
              />
            )}
            <ProtectedRoute path="/cards" component={CardsPrivate} />
            <ProtectedRoute path="/projects" component={ProjectsPrivate} />
            <RedirectRoute path={"/signup"} component={Signup} />
            <RedirectRoute path={"/signin"} component={Signin} />
            <Route path="/verify/:hash" component={AccountVerify} />
            <Route path="/reset-password" component={EmailVerify} />
            <Route path="/set-password/:id" component={SetPassword} />
            <Route component={NotFound} />
          </Switch>
        </Layout>
      </BrowserRouter>
    </LayoutProvider>
  );
}

export default App;
