import React, { useState } from "react";
import * as API from "api/API";

import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import { FormControl } from "@material-ui/core";
import { Input } from "@material-ui/core";
import { InputLabel } from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import FormHelperText from "@material-ui/core/FormHelperText";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Lock from "@material-ui/icons/Lock";
import Mail from "@material-ui/icons/Mail";
import Grid from "@material-ui/core/Grid";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import Typography from "@material-ui/core/Typography";
import GoogleAuth from "components/Auth/GoogleAuth";

const useStyles = makeStyles((theme) => ({
  button: {
    marginRight: "10px"
  },
  icon: {
    fontSize: 100,
    color: theme.palette.success.main
  },
  bold: {
    fontWeight: "bold"
  }
}));
export default function Signup() {
  const classes = useStyles();
  const [values, setValues] = useState({
    email: "",
    password: "",
    name: "",
    showPassword: false
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };
  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const signUpHandler = (e) => {
    e.preventDefault();
    API.request(`/api/users/signUp`, {
      name: values.name,
      password: values.password,
      email: values.email
    })
      .then(() => {
        setSuccess(true);
      })
      .catch((err) => {
        setError(err.response.data);
      });
  };
  return (
    <Container maxWidth="lg">
      {!success ? (
        <Grid container display="flex" justify="center">
          <Grid item lg={6} xs={8}>
            <form
              align="center"
              autoComplete="off"
              onSubmit={(e) => signUpHandler(e)}
            >
              <h5>Dołącz do nas</h5>
              <h1>Utwórz swoje konto</h1>
              <Box display="flex" alignItems="center">
                <Mail color="primary" style={{ marginRight: "10px" }} />
                <FormControl fullWidth style={{ marginBottom: "20px" }}>
                  <InputLabel htmlFor="standard-adornment-email">
                    Email address
                  </InputLabel>
                  <Input
                    id="email"
                    aria-describedby="email-helper-text"
                    type="email"
                    value={values.email}
                    onChange={handleChange("email")}
                  />
                </FormControl>
              </Box>
              <Box display="flex" alignItems="center">
                <AccountCircle
                  color="primary"
                  style={{ marginRight: "10px" }}
                />
                <FormControl fullWidth style={{ marginBottom: "20px" }}>
                  <InputLabel htmlFor="standard-adornment-name">
                    Name
                  </InputLabel>
                  <Input
                    id="name"
                    aria-describedby="name-helper-text"
                    type="name"
                    value={values.name}
                    onChange={handleChange("name")}
                  />
                </FormControl>
              </Box>
              <Box display="flex" alignItems="center">
                <Lock color="primary" style={{ marginRight: "10px" }} />
                <FormControl fullWidth style={{ marginBottom: "20px" }}>
                  <InputLabel htmlFor="standard-adornment-password">
                    Password
                  </InputLabel>
                  <Input
                    id="standard-adornment-password"
                    type={values.showPassword ? "text" : "password"}
                    value={values.password}
                    onChange={handleChange("password")}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {values.showPassword ? (
                            <Visibility />
                          ) : (
                            <VisibilityOff />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </Box>
              {!success ? (
                <FormControl
                  style={{
                    marginBottom: "20px",
                    color: "red"
                  }}
                >
                  <FormHelperText id="my-helper-text">{error}</FormHelperText>
                </FormControl>
              ) : null}
              <Button
                style={{ marginTop: "20px" }}
                type="submit"
                color="primary"
                variant="contained"
                fullWidth
                className={classes.button}
              >
                Zarejestruj się
              </Button>
            </form>
            <Box my={2}>
              <Typography align="center">Lub</Typography>
            </Box>
            <Box display="flex" justifyContent="center">
              <GoogleAuth />
            </Box>
          </Grid>
        </Grid>
      ) : (
        <Container maxWidth="sm">
          <Box
            mt={2}
            display="flex"
            boxShadow={3}
            justifyContent="center"
            flexDirection="column"
            alignItems="center"
          >
            <CheckCircleOutlineIcon className={classes.icon} />
            <Typography
              align="center"
              color="textSecondary"
              variant="h2"
              gutterBottom
            >
              Account was created.
            </Typography>
            <Typography align="center" variant="subtitle1">
              Dziękujemy za rejestracje. Wysłaliśmy link weryfikacyjny na twoją
              skrzynkę pocztową. Kliknij w link by ukończyć proces rejestracji
              konta.
            </Typography>
            <Typography
              align="center"
              variant="subtitle1"
              gutterBottom
              className={classes.bold}
            >
              Po weryfikacji, będziesz mógł zalogować się do aplikacji.
            </Typography>
          </Box>
        </Container>
      )}
    </Container>
  );
}
