import React, { useState } from "react";
import Container from "@material-ui/core/Container";
import * as API from "api/API";
import SendIcon from "@material-ui/icons/Send";

import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import InputBase from "@material-ui/core/InputBase";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: "100%"
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1
  },
  divider: {
    height: 28,
    margin: 4
  },
  success: {
    color: theme.palette.success.main
  },
  error: {
    color: theme.palette.error.main
  }
}));
export default function ResetPassword() {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [loading, setloading] = useState(false);

  const emailHandler = (e) => {
    e.preventDefault();
    setError(false);
    setSuccess(false);
    setloading(true);
    API.request(`/api/users/reset-password`, {
      email: email
    })
      .then((res) => {
        setloading(false);
        setSuccess(true);
        setMessage(res.data.message);
      })
      .catch((err) => {
        setloading(false);
        setError(true);
        setMessage(err.response.data);
      });
  };
  return (
    <Container>
      <Grid container display="flex" justify="center">
        <Grid item lg={6} xs={10} sm={6}>
          <Box display="flex" alignItems="center" flexDirection="column">
            <Typography
              align="center"
              color="textSecondary"
              variant="h3"
              gutterBottom
            >
              Zapomniałeś hasła?
            </Typography>
            <Typography align="center" variant="subtitle1" paragraph>
              Wprowadź adres email, który uyłeś do rejestracji, a my prześlemy
              na ten email link resetujący hasło.
            </Typography>
            <Paper
              component="form"
              onSubmit={(e) => emailHandler(e)}
              className={classes.root}
            >
              {error ? <ErrorOutlineIcon color="error" /> : null}
              {loading ? <CircularProgress size={20} /> : null}
              {success ? (
                <CheckCircleOutlineIcon className={classes.success} />
              ) : null}

              <InputBase
                className={classes.input}
                id="email"
                placeholder="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Divider className={classes.divider} orientation="vertical" />
              <Button
                type="submit"
                color="primary"
                className={classes.iconButton}
              >
                <SendIcon />
              </Button>
            </Paper>
          </Box>
          {success || error ? (
            <Typography className={success ? classes.success : classes.error}>
              {message}
            </Typography>
          ) : null}
        </Grid>
      </Grid>
    </Container>
  );
}
