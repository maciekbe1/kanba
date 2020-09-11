import React, { useState, useEffect } from "react";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import Editor from "components/Editor/Editor";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import Grid from "@material-ui/core/Grid";

import { makeStyles } from "@material-ui/core/styles";
import { STATUSES, PRIORITES } from "constants/cards";

import Select from "react-select";

const useStyles = makeStyles((theme) => ({
  formControl: {
    [theme.breakpoints.down("sm")]: {
      width: 130
    },
    [theme.breakpoints.up("md")]: {
      width: 200
    }
  },
  prioritySelect: { marginTop: theme.spacing(1) }
}));

export default function CreateItem({ setData, error, message }) {
  const [editorContent, setEditorContent] = useState();
  const [title, setTitle] = useState("");
  const [selectedStatus, setSelectedStatus] = useState();

  const [selectedPriority, setSelectedPriority] = useState();
  const classes = useStyles();
  useEffect(() => {
    setData({
      title,
      content: editorContent,
      status: selectedStatus,
      priority: selectedPriority
    });
  }, [title, editorContent, selectedStatus, selectedPriority, setData]);
  const statusChange = (selectedOption) => {
    setSelectedStatus(selectedOption || null);
  };
  const priorityChange = (selectedOption) => {
    setSelectedPriority(selectedOption || null);
  };

  return (
    <div>
      <Box mb={2}>
        <TextField
          fullWidth
          required
          error={error}
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          name="title"
          type="text"
          autoComplete={"off"}
        />
        {error ? (
          <FormControl>
            <FormHelperText id="my-helper-text">{message}</FormHelperText>
          </FormControl>
        ) : null}
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={9}>
          <Editor content={editorContent} setEditorContent={setEditorContent} />
        </Grid>

        <Grid item xs={3}>
          <Box display="flex" flexDirection="column">
            <FormControl className={classes.formControl}>
              <Select
                value={selectedStatus}
                onChange={statusChange}
                options={STATUSES}
                placeholder={"Status"}
                isSearchable={false}
                isClearable
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  option: (provided, state) => ({
                    ...provided,
                    color: "#000"
                  })
                }}
                menuPortalTarget={document.body}
              />
            </FormControl>
            <FormControl
              className={`${classes.prioritySelect} ${classes.formControl}`}
            >
              <Select
                value={selectedPriority}
                onChange={priorityChange}
                options={PRIORITES}
                placeholder={"Priority"}
                isSearchable={false}
                isClearable
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  option: (provided, state) => ({
                    ...provided,
                    color: "#000"
                  })
                }}
                menuPortalTarget={document.body}
              />
            </FormControl>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}
