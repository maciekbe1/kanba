import React from "react";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

import moment from "moment";
import { STATUSES, PRIORITES } from "constants/cards";

import PopoverMenu from "components/Cards/content-item/ItemPopoverMenu";
import ItemHelper from "helper/ItemHelper";
// import ItemTags from "components/Cards/content-item/ItemTags";

interface Props {
  status: any;
  date: any;
  priority: any;
  onItemChange: Function;
  tags?: Array<any>;
}

export default function ItemSideBar({
  status,
  date,
  priority,
  onItemChange,
  tags
}: Props) {
  return (
    <div>
      <List disablePadding>
        <ListItem divider disableGutters>
          <ListItemText secondary="Created" />
          <ListItemText primary={moment(date).format("DD/MM/YYYY")} inset />
        </ListItem>

        <ListItem divider disableGutters>
          <ListItemText secondary="Status" />
          <PopoverMenu
            array={STATUSES}
            elem={ItemHelper.statusButtonStyler(status)}
            onItemChange={onItemChange}
            type="status"
          />
        </ListItem>

        <ListItem divider disableGutters>
          <ListItemText secondary="Priority" />
          <PopoverMenu
            array={PRIORITES}
            elem={ItemHelper.priorityButtonStyler(priority)}
            onItemChange={onItemChange}
            type="priority"
          />
        </ListItem>
        {/* <ListItem disableGutters>
          <ItemTags tags={tags || []} />
        </ListItem> */}
      </List>
    </div>
  );
}
