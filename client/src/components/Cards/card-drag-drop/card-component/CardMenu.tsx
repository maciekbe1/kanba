import React from "react";
import { useDispatch } from "react-redux";
import { openNewContent } from "store/actions/cardsActions";
import { updateCardProperties, removeCard } from "store/actions/cardsActions";

import * as CardsService from "services/CardsService";

import Badge from "@material-ui/core/Badge";
import IconButton from "@material-ui/core/IconButton";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MoreVertIcon from "@material-ui/icons/MoreVert";

interface Props {
  expand: boolean;
  listLength: number;
  cardID: string;
  index: number;
}

export default function Actions({ expand, listLength, cardID, index }: Props) {
  const dispatch = useDispatch();
  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(menuAnchor);

  const openMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };
  const onToggle = () => {
    CardsService.updateCardProperties(cardID, !expand, "expand");
    dispatch(
      updateCardProperties({
        cardID,
        expand: !expand
      })
    );
  };
  const closeMenu = () => {
    setMenuAnchor(null);
  };

  const removeCardHandler = () => {
    closeMenu();
    try {
      CardsService.removeCard(cardID);
      dispatch(removeCard({ cardID }));
    } catch (error) {
      console.log(error);
    }
  };

  const createNewContent = () => {
    closeMenu();
    dispatch(openNewContent(cardID));
  };

  return (
    <div className="card-component-navbar-actions">
      <IconButton
        aria-label={expand ? "expandLess" : "expandMore"}
        onClick={onToggle}
      >
        <Badge
          color="primary"
          badgeContent={listLength}
          max={99}
          anchorOrigin={{
            vertical: "top",
            horizontal: "left"
          }}
        >
          {expand ? <ExpandLess /> : <ExpandMore />}
        </Badge>
      </IconButton>
      <IconButton
        aria-label="more"
        aria-controls="card-menu"
        aria-haspopup="true"
        onClick={openMenu}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="card-menu"
        anchorEl={menuAnchor}
        open={isMenuOpen}
        onClose={closeMenu}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
      >
        <MenuItem onClick={createNewContent}>
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <ListItemText primary="Add Item" />
        </MenuItem>
        <MenuItem onClick={removeCardHandler}>
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          <ListItemText primary="Remove" />
        </MenuItem>
      </Menu>
    </div>
  );
}
