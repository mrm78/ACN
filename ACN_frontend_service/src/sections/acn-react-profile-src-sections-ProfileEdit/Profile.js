import React, { useState, useRef } from "react";
import { isEmail } from "validator";
import * as $ from "jquery";
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
} from "@material-ui/core";
import sampleAvatar from "../../static/man-avatar.svg";

const useStyle = makeStyles((theme) => ({
  profileTitle: {
    fontSize: 20,
    fontWeight: 600,
    marginBottom: theme.spacing(3),
  },
  avatar: {
    width: 80,
    height: 80,
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  avatarPaper: {
    borderRadius: "50%",
    height: 90,
    width: 90,
    position: "relative",
    boxShadow: "0 0 5px rgba(0,0,0,0.5)",
    margin: theme.spacing(2),
  },
  buttonContainer: {
    margin: theme.spacing(2),
  },
  button: {
    margin: 5,
  },
  name: {
    color: "#4592ff",
    fontSize: 18,
    fontWeight: 600,
    marginBottom: theme.spacing(2),
  },
  biographyTitle: {
    fontSize: 18,
    fontWeight: 600,
    margin: theme.spacing(1),
  },
  biography: {
    textAlign: "justify",
    textJustify: "inter-word",
  },
}));

export default function Profile(props) {
  const classes = useStyle();

  // ToDo: must complete upload handler
  async function handleUpload(event) {
    event.preventDefault();
  }
  return (
    <Grid
      item
      container
      lg={4}
      md={4}
      sm={12}
      xs={12}
      justify="center"
      alignItems="center"
    >
      <Grid item lg={12} xs={12} className={classes.profileTitle}>
        Profile
      </Grid>
      <Grid item container lg={12} xs={12} justify="center" alignItems="center">
        <Paper elevation={0} className={classes.avatarPaper}>
          <Avatar
            alt={props.name}
            src={sampleAvatar}
            className={classes.avatar}
          />
        </Paper>
      </Grid>
      <Grid
        item
        container
        lg={12}
        xs={12}
        justify="center"
        alignItems="center"
        className={classes.name}
      >
        AliReza Moradi
      </Grid>
      <Grid
        item
        container
        lg={9}
        sm={10}
        xs={10}
        justify="center"
        alignItems="center"
        className={classes.buttonContainer}
      >
        <Grid
          item
          container
          lg={7}
          sm={9}
          xs={11}
          justify="center"
          alignItems="center"
          className={classes.button}
        >
          <Button
            variant="contained"
            component="label"
            color="primary"
            fullWidth="true"
          >
            Upload New Avatar
            <input type="file" hidden />
          </Button>
        </Grid>
        <Grid
          item
          container
          lg={7}
          sm={9}
          xs={11}
          justify="center"
          alignItems="center"
          className={classes.button}
        >
          <Button
            variant="contained"
            fullWidth="true"
            className={classes.uploadButton}
          >
            Delete Avatar
          </Button>
        </Grid>
      </Grid>
      <Grid
        item
        container
        lg={9}
        xs={9}
        justify="center"
        alignItems="center"
        className={classes.buttonContainer}
      >
        <Grid item lg={12} xs={12} className={classes.biographyTitle}>
          Biography
        </Grid>
        <Grid item lg={11} xs={12} className={classes.biography}>
          This is my biography. This is my biography.This is my biography.This
          is my biography. This is my biography.This is my biography.This is my
          biography. This is my biography.This is my biography.This is my
          biography.
        </Grid>
      </Grid>
    </Grid>
  );
}
