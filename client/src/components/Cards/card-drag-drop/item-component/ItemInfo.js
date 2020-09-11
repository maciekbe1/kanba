import React from "react";
import ItemHelper from "helper/ItemHelper";
import Avatar from "@material-ui/core/Avatar";
import { isNil } from "lodash";
import Tooltip from "@material-ui/core/Tooltip";

export default function ItemInfo({ status, priority, date }) {
  const statusStyles = {
    backgroundColor: ItemHelper.statusButtonStyler(status)?.color?.background,
    marginLeft: "8px"
  };
  const priorityStyles = {
    backgroundColor: ItemHelper.priorityButtonStyler(priority)?.color
      ?.background,
    marginLeft: "8px"
  };

  return (
    <div className="item-info-container">
      {isNil(priority) || priority.label === "NO VALUE" ? null : (
        <Tooltip title={`Priority: ${priority.label}`}>
          <Avatar className="item-icon priority-icon" style={priorityStyles}>
            {ItemHelper.priorityButtonStyler(priority)?.icon}
          </Avatar>
        </Tooltip>
      )}
      {isNil(status) || status.label === "NO VALUE" ? null : (
        <Tooltip title={`Status: ${status.label}`}>
          <Avatar className="item-icon status-icon" style={statusStyles}>
            {ItemHelper.statusButtonStyler(status)?.icon}
          </Avatar>
        </Tooltip>
      )}
    </div>
  );
}
