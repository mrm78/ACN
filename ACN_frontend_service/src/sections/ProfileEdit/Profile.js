import React, { useState, useEffect } from "react";
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
import Skeleton from "@material-ui/lab/Skeleton";
import sampleAvatar from "../../static/man-avatar.svg";
import Const from "../../static/CONST";

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
    backgroundImage:
      "linear-gradient(to right, rgb(0, 90, 207) 0%, rgb(0, 90, 207) 50%, white 50%, white 100%)",
    // backgroundSize: "100% 50px, 50%",
  },
  avatarSkeleton: {
    margin: theme.spacing(2),
    position: "relative",
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
  const [avatar, setAvatar] = useState("no");
  const handleChange = (e) => {
    const file = e.target.files[0];
    var tmppath = URL.createObjectURL(file)
    setAvatar(tmppath);
    props.getAvatar(file);
  };
  const handleDelete = () => {
    setAvatar(null);
    props.getAvatar("delete");
  };

  const getAvatar = () => {
    ;
  };
  useEffect(() => getAvatar(), [props.values]);

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
        {props.isLoaded ? (
          <Paper elevation={0} className={classes.avatarPaper}>
            <Avatar
              alt={props.values.name}
              src={avatar=="no"?`${Const.baseUrl}${props.values.avatar}`:avatar}
              className={classes.avatar}
            />
          </Paper>
        ) : (
          <Skeleton
            variant="circle"
            width={90}
            height={90}
            className={classes.avatarSkeleton}
          />
        )}
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
        {props.isLoaded ? props.values.name : <Skeleton variant="text" width={40} />}
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
            color="secondary"
            fullWidth="true"
          >
            Upload
            <input type="file" hidden onChange={handleChange} />
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
            onClick={handleDelete}
          >
            Delete
          </Button>
        </Grid>
      </Grid>
      {/* <Grid
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
          {props.values.bio}
        </Grid>
      </Grid> */}
    </Grid>
  );
}
