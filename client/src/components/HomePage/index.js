import React from "react";
import "./Home.scss";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import logo from "../../assets/images/logo.png";
import Box from "@material-ui/core/Box";
import { Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import useMediaQuery from "@material-ui/core/useMediaQuery";
const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  image: {
    width: "100%"
  },
  h1: {
    fontSize: "56px",
    margin: "0",
    fontWeight: "400",
    textAlign: "center"
  },
  box: {
    marginTop: "20px"
  },
  button: {
    marginTop: "30px"
  }
}));
export default function Homepage() {
  const classes = useStyles();
  const matches = useMediaQuery("(min-width:960px)");
  return (
    <Container maxWidth="md">
      <Box className={classes.box}>
        <Grid container justify="center" spacing={5}>
          <Grid item md={4} xs={4}>
            <img src={logo} alt="logo" className={classes.image} />
          </Grid>
          <Grid
            item
            md={8}
            container
            direction="column"
            justify="space-between"
            alignItems="center"
          >
            <Typography color="primary" className={classes.h1}>
              Kanba
            </Typography>
            <Typography align="center">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt
              harum sapiente inventore odit maxime quaerat? Provident amet
              placeat autem sequi voluptatibus, quidem numquam ab cumque neque
              ut ipsum quis quos?
            </Typography>
            <Button
              className={!matches ? classes.button : null}
              color="primary"
              variant="outlined"
            >
              Get Started
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
