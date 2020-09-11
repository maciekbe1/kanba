import React from "react";
import Chip from "@material-ui/core/Chip";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";

interface Props {
  tags: Array<any>;
}
export default function ItemTags({ tags }: Props) {
  return (
    <div style={{ marginTop: "10px", width: "inherit" }}>
      <Autocomplete
        multiple
        id="tags-filled"
        size="small"
        options={tags.map((option: any) => option)}
        filterSelectedOptions={true}
        freeSolo
        value={tags.map((label: any) => label)}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              variant={option.variant}
              label={option.name}
              clickable
              {...getTagProps({ index })}
              size="small"
            />
          ))
        }
        renderInput={(params) => (
          <TextField {...params} variant="outlined" label="Tags" />
        )}
      />
    </div>
  );
}
