import React from "react";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import PauseCircleOutlineIcon from "@material-ui/icons/PauseCircleOutline";
import AvTimerIcon from "@material-ui/icons/AvTimer";
import { green, blue, grey, orange, red } from "@material-ui/core/colors";
import { isNil } from "lodash";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";

class StyledInfo {
  constructor(color, icon, value, label) {
    this.color = color;
    this.icon = icon;
    this.value = value;
    this.label = label;
  }
}

export default {
  statusButtonStyler(status) {
    if (isNil(status)) {
      const color = {
        background: "#fff",
        hover: "#fff",
        text: "default"
      };
      const icon = null;
      return new StyledInfo(color, icon, 0, "NO VALUE");
    }
    switch (status.value) {
      case 0: {
        const color = {
          background: "#fff",
          hover: "#fff",
          text: "default"
        };
        const icon = null;
        return new StyledInfo(color, icon, 0, "NO VALUE");
      }
      case 1: {
        const color = {
          background: grey[500],
          hover: grey[700],
          text: "primary"
        };
        const icon = <PauseCircleOutlineIcon />;
        return new StyledInfo(color, icon, status.value, status.label);
      }

      case 2: {
        const color = {
          background: blue[500],
          hover: blue[700],
          text: "primary"
        };
        const icon = <AvTimerIcon />;
        return new StyledInfo(color, icon, status.value, status.label);
      }

      case 3: {
        const color = {
          background: green[500],
          hover: green[700],
          text: "primary"
        };
        const icon = <CheckCircleOutlineIcon />;
        return new StyledInfo(color, icon, status.value, status.label);
      }

      default:
        break;
    }
  },
  priorityButtonStyler(priority) {
    const color = {
      background: "#fff",
      hover: grey[50]
    };
    if (isNil(priority)) {
      const icon = null;
      return new StyledInfo(color, icon, 0, "NO VALUE");
    }
    switch (priority.value) {
      case 0: {
        const icon = null;
        return new StyledInfo(color, icon, 0, "NO VALUE");
      }
      case 1: {
        const icon = <ArrowUpwardIcon style={{ color: red[600] }} />;
        return new StyledInfo(color, icon, priority.value, priority.label);
      }
      case 2: {
        const icon = <ArrowForwardIcon style={{ color: orange[600] }} />;
        return new StyledInfo(color, icon, priority.value, priority.label);
      }
      case 3: {
        const icon = <ArrowDownwardIcon style={{ color: green[800] }} />;
        return new StyledInfo(color, icon, priority.value, priority.label);
      }
      default:
        break;
    }
    return priority;
  },
  findItem(itemID, cards) {
    function dfs(obj, targetId) {
      if (obj._id === targetId) {
        return obj;
      }
      if (obj.list) {
        for (let item of obj.list) {
          let check = dfs(item, targetId);
          if (check) {
            return check;
          }
        }
      }
      return null;
    }

    let result = null;

    for (let obj of cards) {
      result = dfs(obj, itemID);
      if (result) {
        break;
      }
    }
    return result;
  }
};
