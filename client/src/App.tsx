import React, { lazy, Suspense } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Spinner from "components/Layouts/Spinner";
import CssBaseline from "@material-ui/core/CssBaseline";
import LayoutProvider from "components/Layouts/LayoutProvider";
import Layout from "components/Layouts/Layout";
import { useSelector } from "react-redux";

const ProtectedRoute = lazy(() => import("components/Utils/ProtectedRoute"));
const RedirectRoute = lazy(() => import("components/Utils/RedirectRoute"));

const HomePage = lazy(() => import("components/HomePage"));

const Signup = lazy(() => import("components/Auth/Signup"));
const Signin = lazy(() => import("components/Auth/Signin"));

const Dashboard = lazy(() => import("components/Dashboard/Dashboard"));
const AccountVerify = lazy(() => import("components/Account/Verify"));
const EmailVerify = lazy(() => import("components/ResetPassword/EmailVerify"));
const SetPassword = lazy(() => import("components/ResetPassword/SetPassword"));

const Cards = lazy(() => import("components/Cards/Cards"));
const Projects = lazy(() => import("components/Projects/Projects"));
const NotFound = lazy(() => import("components/Utils/NotFound"));

function App() {
  const { isAuth } = useSelector(({ authReducer }: any) => authReducer);
  return (
    <LayoutProvider>
      <BrowserRouter>
        <CssBaseline />
        <Layout isAuth={isAuth}>
          <Suspense fallback={<Spinner text="Page loading..." />}>
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
              <ProtectedRoute path="/cards" component={Cards} />
              <ProtectedRoute path="/projects" component={Projects} />
              <RedirectRoute path={"/signup"} component={Signup} />
              <RedirectRoute path={"/signin"} component={Signin} />
              <Route path="/verify/:hash" component={AccountVerify} />
              <Route path="/reset-password" component={EmailVerify} />
              <Route path="/set-password/:id" component={SetPassword} />
              <Route component={NotFound} />
            </Switch>
          </Suspense>
        </Layout>
      </BrowserRouter>
    </LayoutProvider>
  );
}

export default App;
