import React, { useState, useEffect } from "react";
import axios from "axios";
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
import Const from "../../static/CONST";

const useStyle = makeStyles((theme) => ({
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
    // width: 150,
    position: "relative",
    margin: theme.spacing(2),
    borderRadius: "50%",
    transition: "all 0.3s ease-out",
    "&:hover": {
    borderRadius: 15,
      "& $layer": {
        opacity: 1,
        borderRadius: 15,
      },
    },
    [theme.breakpoints.down("sm")]:{
    borderRadius: "50%",

    },
  },
  layer: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(24, 50, 153, 0.3)",
    position: "absolute",
    top: 0,
    left: 0,
    borderRadius: "50%",
    transition: "all 0.3s ease-out",
    opacity: 0.6,
  },
  text: {
    marginTop: theme.spacing(2),
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
  const [favorites, setFavorit] = useState({});
  const [selectedFavorites, setSelectedFavrites] = useState("");
  let objFavorites = {};
  const setData = () => {
    props.activities.map((obj) => {
      objFavorites[obj.id] = obj;
    });
    setFavorit(objFavorites);
  };
  useEffect(() => setData(), [props.activities]);
  const getSelected = () => {
    let selectedActivities = "";
    for (const obj in favorites) {
      if (favorites[obj].is_favorite) {
        selectedActivities += " " + favorites[obj].id.toString();
      }
    }
    props.getFavorites(selectedActivities);
    setSelectedFavrites(selectedActivities);
    // console.log(selectedActivities);
    // console.log(props.getFavorites);
  };
  const handleSelect = (prop) => () => {
    setFavorit({
      ...favorites,
      [prop]: { ...favorites[prop], is_favorite: !favorites[prop].is_favorite },
    });
  };
  useEffect(() => getSelected(), [favorites]);
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
            {Object.entries(favorites).map(([key, value]) => {
              return (
                <Grid
                  item
                  container
                  lg={3}
                  md={3}
                  sm={6}
                  xs={8}
                  justify="center"
                  alignItems="center"
                  className={classes.card}
                  style={{
                    backgroundImage: `url(${Const.baseUrl}${value.image})`,
                  }}
                  onClick={handleSelect(value.id)}
                >
                  <Grid
                    item
                    container
                    justify="center"
                    alignItems="stretch"
                    className={classes.layer}
                    style={
                      value.is_favorite
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
                        style={value.is_favorite ? { opacity: 1 } : {}}
                      >
                        {value.name}
                      </Grid>
                      <Grid
                        item
                        container
                        lg={12}
                        justify="center"
                        alignItems="flex-end"
                      >
                        {value.is_favorite && (
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
