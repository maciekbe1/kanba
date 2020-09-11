import React, { useState } from "react";
import * as API from "api/API";
import { FormControl } from "@material-ui/core";
import { Input } from "@material-ui/core";
import { InputLabel } from "@material-ui/core";

import CheckIcon from "@material-ui/icons/Check";
import SendIcon from "@material-ui/icons/Send";
import Container from "@material-ui/core/Container";
import CircularProgress from "@material-ui/core/CircularProgress";
import { green } from "@material-ui/core/colors";
import { red } from "@material-ui/core/colors";

import Fab from "@material-ui/core/Fab";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import ErrorIcon from "@material-ui/icons/Error";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
  wrapper: {
    margin: theme.spacing(1),
    position: "relative"
  },
  buttonSuccess: {
    backgroundColor: green[500],
    "&:hover": {
      backgroundColor: green[700]
    }
  },
  buttonError: {
    backgroundColor: red[500],
    "&:hover": {
      backgroundColor: red[700]
    }
  },
  fabProgress: {
    color: green[500],
    position: "absolute",
    top: -6,
    left: -6,
    zIndex: 1
  },
  form: {
    display: "flex",
    flexDirection: "column",
    width: "100%"
  },
  success: {
    color: theme.palette.success.main
  },
  error: {
    color: theme.palette.error.main
  }
}));
export default function SetPassword(props) {
  const classes = useStyles();
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
    [classes.buttonError]: error
  });
  const setPasswordHandler = (e) => {
    e.preventDefault();
    setError(false);
    setSuccess(false);
    setLoading(true);
    if (password === repeatPassword) {
      API.request(`/api/users/set-password`, {
        password: password,
        hash: props.match.params.id
      })
        .then((res) => {
          setMessage(res.data.message);
          setSuccess(true);
          setLoading(false);
          setPassword("");
          setRepeatPassword("");
        })
        .catch((err) => {
          setMessage(err.response.data);
          setError(true);
          setLoading(false);
        });
    } else {
      setLoading(false);
      setError(true);
      setMessage("Passwords not compare");
    }
  };
  return (
    <Container>
      <Grid container display="flex" justify="center">
        <Grid item lg={6} xs={10} sm={6}>
          <Box display="flex" alignItems="center" flexDirection="column">
            <Typography
              align="center"
              color="textSecondary"
              variant="h2"
              gutterBottom
            >
              Set New Password
            </Typography>
            <form
              className={classes.form}
              onSubmit={(e) => setPasswordHandler(e)}
            >
              <Box display="flex" alignItems="center" mb={2}>
                <CheckCircleOutlineIcon
                  className={password.length >= 5 ? classes.success : null}
                />
                <Typography
                  style={{ marginLeft: "10px" }}
                  className={password.length >= 5 ? classes.success : null}
                >
                  Minimum 5 Characters
                </Typography>
              </Box>

              <FormControl fullWidth style={{ marginBottom: "20px" }}>
                <InputLabel htmlFor="standard-adornment-email">
                  Password
                </InputLabel>
                <Input
                  id="password"
                  aria-describedby="email-helper-text"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>
              <FormControl fullWidth style={{ marginBottom: "20px" }}>
                <InputLabel htmlFor="standard-adornment-email">
                  Repeat password
                </InputLabel>
                <Input
                  id="repeat-password"
                  aria-describedby="email-helper-text"
                  type="password"
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                />
              </FormControl>
              <div className={classes.wrapper}>
                <Fab
                  aria-label="save"
                  color="primary"
                  className={buttonClassname}
                  type="submit"
                  onClick={(e) => setPasswordHandler(e)}
                >
                  {error ? (
                    success ? (
                      <CheckIcon />
                    ) : (
                      <ErrorIcon />
                    )
                  ) : success ? (
                    <CheckIcon />
                  ) : (
                    <SendIcon />
                  )}
                </Fab>
                {loading && (
                  <CircularProgress size={68} className={classes.fabProgress} />
                )}
              </div>
            </form>
            <Typography className={success ? classes.success : classes.error}>
              {message}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
