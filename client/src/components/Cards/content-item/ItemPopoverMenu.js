import React, { useState, useEffect } from "react";

import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

import { isNil } from "lodash";
import ItemHelper from "helper/ItemHelper";

import StatusButton from "components/Cards/content-item/ItemStatusButton";

export default function PopoverMenu({ array, elem, onItemChange, type }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [element, setElement] = useState({ value: 0, label: "NO VALUE" });

  useEffect(() => {
    setElement(isNil(elem) ? { value: 0, label: "NO VALUE" } : elem);
  }, [elem, setElement]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const elementChange = (element) => {
    onItemChange(element, type);
    setElement(element);
    setAnchorEl(null);
  };

  return (
    <div>
      <div onClick={handleClick}>
        <StatusButton
          element={
            type === "status"
              ? ItemHelper.statusButtonStyler(element)
              : ItemHelper.priorityButtonStyler(element)
          }
        >
          {element?.label}
        </StatusButton>
      </div>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => elementChange(element)}
      >
        <MenuItem
          onClick={() => elementChange({ value: 0, label: "NO VALUE" })}
        >
          NO VALUE
        </MenuItem>
        {array.map((element) => {
          return (
            <MenuItem
              key={element.value}
              onClick={() => elementChange(element)}
            >
              {element?.label}
            </MenuItem>
          );
        })}
      </Menu>
    </div>
  );
}
