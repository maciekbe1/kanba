import React, { useState, useEffect } from "react";

import { makeStyles } from "@material-ui/core/styles";
import {
  TextField,
  Typography,
  FormControl,
  FormHelperText
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  button: {
    marginRight: "10px"
  },
  error: {
    color: theme.palette.error.main,
    fontWeight: "bold",
    fontSize: "14px"
  }
}));
export default function CreateCard({ setData, error, message, user }) {
  const classes = useStyles();
  const [values, setValues] = useState({
    user,
    title: "",
    description: ""
  });

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };
  useEffect(() => {
    setData({
      title: values.title,
      description: values.description,
      user
    });
  }, [values, user, setData]);
  return (
    <>
      <Typography variant="h4" gutterBottom style={{ textAlign: "center" }}>
        Utwórz kartę
      </Typography>

      <TextField
        fullWidth
        required
        error={error}
        label="Tytuł"
        value={values.title}
        onChange={handleChange("title")}
        helperText="* Require"
        name="title"
        type="text"
        variant="outlined"
        style={{ margin: "10px 0 5px 0" }}
        autoComplete={"off"}
      />

      <TextField
        fullWidth
        id="standard-optional"
        label="Description"
        value={values.description}
        onChange={handleChange("description")}
        multiline
        name="description"
        type="text"
        variant="outlined"
        style={{ margin: "5px 0 10px 0" }}
      />
      {error ? (
        <div>
          <FormControl style={{ marginBottom: "20px" }}>
            <FormHelperText className={classes.error} id="my-helper-text">
              {message}
            </FormHelperText>
          </FormControl>
        </div>
      ) : null}
    </>
  );
}
