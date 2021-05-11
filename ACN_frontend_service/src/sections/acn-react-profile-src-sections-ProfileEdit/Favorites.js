import React, { useState, useEffect } from "react";
import {
  makeStyles,
  useTheme,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  Avatar,
  Paper,
  Dialog,
  Badge,
} from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import hiking from "../../static/img/favorites/hiking.jpg";
import cinema from "../../static/img/favorites/cinema.jpg";

const useStyle = makeStyles((theme) => ({
  root: {},
  paper: {
    width: "100%",
    minHeight: 200,
    padding: theme.spacing(2),
  },
  card: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    height: 150,
    position: "relative",
    margin: theme.spacing(2),
    borderRadius: 10,
    "&:hover": {
      "& $layer": {
        opacity: 1,
      },
    },
  },
  layer: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(24, 50, 153, 0.5)",
    position: "absolute",
    top: 0,
    left: 0,
    borderRadius: 10,
    transition: "all 0.2s ease-out",
    opacity: 0.6,
  },
  text: {
    color: "#fff",
    transition: "all 0.2s ease-out",
  },
  selectIcon: {
    fontSize: 40,
    color: "#fff",
  },
}));

export default function Favorites(props) {
  const classes = useStyle();
  let initialFavorites = [
    { id: 0, title: "Cinema", logo: cinema, isSelected: false },
    { id: 1, title: "Hiking", logo: hiking, isSelected: false },
    { id: 2, title: "Cinema", logo: cinema, isSelected: true },
    { id: 3, title: "Hiking", logo: hiking, isSelected: true },
  ];
  // useEffect
  const favoritesState = {};
  initialFavorites.map((value) => {
    favoritesState[value.id] = value.isSelected;
  });
  // console.log(favoritesState);
  const [favorites, setFavorit] = useState(favoritesState);

  const handleSelect = (prop) => () => {
    setFavorit({ ...favorites, [prop]: !favorites[prop] });
  };
  return (
    <Dialog
      open={props.state}
      onClose={props.handleClose}
      aria-labelledby="form-dialog-title"
      fullWidth={true}
      maxWidth={"md"}
    >
      <Grid item lg={12} container justify="center" alignItems="center">
        <Paper className={classes.paper}>
          <Grid
            item
            container
            lg={12}
            justify="space-around"
            alignItems="center"
          >
            {initialFavorites.map((value) => {
              return (
                <Grid
                  item
                  container
                  lg={3}
                  justify="center"
                  alignItems="center"
                  className={classes.card}
                  style={{ backgroundImage: `url(${value.logo})` }}
                  onClick={handleSelect(value.id)}
                >
                  <Grid
                    item
                    container
                    justify="center"
                    alignItems="stretch"
                    className={classes.layer}
                    style={
                      favorites[value.id]
                        ? {
                            backgroundColor: "rgba(24, 50, 153, 0.6)",
                            opacity: 1,
                          }
                        : {}
                    }
                  >
                    <Grid
                      item
                      container
                      lg={12}
                      xs={12}
                      justify="space-between"
                      alignItems="flex-start"
                    >
                      <Grid
                        item
                        container
                        lg={12}
                        justify="center"
                        alignItems="flex-start"
                        className={classes.text}
                        style={favorites[value.id] ? { opacity: 1 } : {}}
                      >
                        {value.title}
                      </Grid>
                      <Grid
                        item
                        container
                        lg={12}
                        justify="center"
                        alignItems="flex-end"
                      >
                        {favorites[value.id] && (
                          <CheckIcon className={classes.selectIcon} />
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              );
            })}
          </Grid>
        </Paper>
      </Grid>
    </Dialog>
  );
}
