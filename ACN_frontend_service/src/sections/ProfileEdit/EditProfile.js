import React, { useState, useEffect } from "react";
import { isEmail } from "validator";
import axios from "axios";
import { Link } from "react-router-dom";
import * as $ from "jquery";
import {
  makeStyles,
  useTheme,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Input,
  OutlinedInput,
  InputAdornment,
  Avatar,
  Paper,
  Divider,
  IconButton,
  Hidden,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Dialog,
  FormGroup,
  Snackbar,
} from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";
import {
  FontDownloadSharp,
  Visibility,
  VisibilityOff,
  Check,
} from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import FavoritesDialog from "./Favorites";
import Const from "../../static/CONST";

const useStyle = makeStyles((theme) => ({
  root: {
    // [theme.breakpoints.down("md")]: {
    // marginTop: theme.spacing(8),
    // },
  },
  form: {
    position: "relative",
  },
  container: {
    // position: "absolute",
    // left: "50%",
    // transform: "translateX(-50%)",
  },
  divider: {
    width: "100%",
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },
  cancleButton: {
    [theme.breakpoints.up("sm")]: {
      paddingRight: theme.spacing(1),
    },
    [theme.breakpoints.down("sm")]: {},
  },
  saveButton: {
    [theme.breakpoints.up("sm")]: {
      paddingLeft: theme.spacing(1),
    },
  },
  title: {
    fontSize: 18,
    fontWeight: 600,
  },
  field: {
    margin: theme.spacing(1, 0),
  },
  textfieldSkeleton: {
    width: "100%",
    height: 40,
    borderRadius: 4,
  },
  textareaSkeleton: {
    width: "100%",
    height: 60,
    borderRadius: 4,
  },
  parts: {
    marginTop: theme.spacing(5),
  },
  passwordInputLable: {
    backgroundColor: "#fff",
    paddingRight: theme.spacing(1),
  },
  bottomButtonsPart: {
    marginTop: theme.spacing(3),
  },
  bottomButtons: {
    [theme.breakpoints.down("sm")]: {
      marginTop: theme.spacing(1),
    },
  },
  radioForm: {
    textAlign: "center",
    border: "1px solid #00000040",
    borderRadius: 4,
    height: 40,
    position: "relative",
  },
  radioFormLabel: {
    color: "rgba(0, 0, 0, 0.54)",
    fontSize: "0.85rem",
    fontWeight: 400,
    transform: "translateY(-55%)",
    marginLeft: theme.spacing(1),
    padding: theme.spacing(0, 0.7),
    backgroundColor: "#fff",
  },
  radios: {
    transform: "translateY(-45%)",
  },
}));

export default function EditProfile(props) {
  const [values, setValues] = useState({});
  const [selectedFavorites, setSelectedFavorites] = useState("");
  const [edit, setEdit] = useState({ message: "", status: "" });
  const [open, setOpen] = useState(false);
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  const getData = () => {
    let info = {
      ...props.data,
      // cityId: "",
      currentPassword: "",
      newPassword: "",
      confNewPassword: "",
      nameError: "",
      emailError: "",
      usernameError: "",
      passwordError: "",
      showCurrentPassword: false,
      showNewPassword: false,
      showConfNewPassword: false,
    };
    setValues(info);
  };
  useEffect(() => getData(), [props.data]);
  // console.log(values);
  const classes = useStyle();
  const basicInfo = [
    { title: "Name", value: values.name, key: "name" },
    { title: "Emial", value: values.email, key: "email" },
    { title: "Username", value: values.username, key: "username" },
  ];
  const security = [
    {
      id: "currentPassword",
      show: "showCurrentPassword",
      title: "Current Password",
      value: values.password,
    },
    {
      id: "newPassword",
      show: "showNewPassword",
      title: "New Password",
      value: values.newPassword,
    },
    {
      id: "confNewPassword",
      show: "showConfNewPassword",
      title: "Confirm New Password",
      value: values.confNewPassword,
    },
  ];
  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleShowPassword = (prop) => () => {
    setValues({ ...values, [prop]: !values[prop] });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  // Favorites Modal
  const [isDialogOpen, setDialogOpen] = useState(false);

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };
  const handleDialogClose = () => {
    setDialogOpen(false);
  };
  const getFavorites = (myFavorites) => {
    let myInfo = myFavorites;
    setSelectedFavorites(myInfo);
  };

  // const handleCancle = (event) => {
  //   history.push(`/home`);
  // };
  async function handleEdit(event) {
    // event.preventDefault();
    // console.log(props.data);
    // console.log(selectedFavorites);
    // window.location.reload();
    const formData = Const.toFormData({
      reco: localStorage.getItem("token").toString(),
      username: values.username,
      name: values.name,
      email: values.email,
      avatar: values.avatar,
      gender: values.gender,
      age: values.age,
      bio: values.bio,
      old_password: values.currentPassword,
      new_password: values.newPassword,
      city_id: values.cityId,
      wishlist: selectedFavorites,
    });
    // console.log(values);
    axios
      .post(`${Const.baseUrl}/account/update_user_info`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.status === 200) {
          setEdit({
            message: "Your info edited successfully.",
            status: "success",
          });
        }
        setOpen(true);
        console.log(res);
        setValues(res.data);
      });
  }

  return (
    <Grid
      item
      container
      justify="center"
      alignItems="flex-start"
      lg={7}
      md={7}
      sm={12}
      xs={12}
      className={classes.root}
    >
      {/* <form onSubmit={handleEdit} className={classes.form}> */}
      <Grid
        item
        container
        lg={10}
        xs={10}
        justify="flex-start"
        alignItems="center"
        className={classes.container}
      >
        <Grid
          item
          container
          lg={12}
          xs={12}
          justify="space-between"
          alignItems="center"
        >
          <Grid
            item
            container
            lg={4}
            xs={4}
            justify="flex-start"
            alignItems="center"
            className={classes.title}
          >
            Basic Info
          </Grid>
          <Divider className={classes.divider} />
        </Grid>
        {basicInfo.map((value) => {
          return (
            <Grid item container lg={12} xs={12} className={classes.field}>
              {props.isLoaded ? (
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth="true"
                  label={value.title}
                  value={values[value.key]}
                  onChange={handleChange(value.key)}
                />
              ) : (
                <Skeleton
                  variant="rect"
                  className={classes.textfieldSkeleton}
                />
              )}
            </Grid>
          );
        })}
        <Grid
          item
          container
          lg={12}
          xs={12}
          justify="flex-start"
          alignItems="center"
          className={classes.parts}
        >
          <Grid
            item
            container
            lg={4}
            xs={4}
            className={classes.title}
            justify="flex-start"
          >
            About Me
          </Grid>
          <Divider className={classes.divider} />
        </Grid>
        <Grid item container lg={12} xs={12} className={classes.field}>
          {props.isLoaded ? (
            <TextField
              variant="outlined"
              size="small"
              fullWidth="true"
              label="Biography"
              value={values.bio}
              onChange={handleChange("bio")}
              multiline
              rows={2}
              rowsMax={4}
            />
          ) : (
            <Skeleton variant="rect" className={classes.textareaSkeleton} />
          )}
        </Grid>
        <Grid item container lg={12} xs={12} justify="space-between">
          <Grid item container xs={12} className={classes.field}>
            {props.isLoaded ? (
              <TextField
                variant="outlined"
                fullWidth="true"
                size="small"
                select
                value={values.age}
                onChange={handleChange("age")}
                label="Age"
                MenuProps={{
                  anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "left",
                  },
                  // getContentAnchorEl: null,
                }}
              >
                {Const.ageProducer().map((age) => {
                  return (
                    <MenuItem value={age}>{age}</MenuItem>
                  );
                })}
              </TextField>
            ) : (
              <Skeleton variant="rect" className={classes.textfieldSkeleton} />
            )}
          </Grid>
          <Grid item container xs={12} className={classes.field}>
            {props.isLoaded ? (
              <TextField
                variant="outlined"
                fullWidth="true"
                size="small"
                select
                value={values.city_id}
                onChange={handleChange("city_id")}
                label="City"
                MenuProps={{
                  anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "left",
                  },
                  // getContentAnchorEl: null,
                }}
              >
                {Const.citiesList.map((city) => {
                  // console.log(city);
                  return (
                    <MenuItem value={city.id}>{city.name}</MenuItem>
                  );
                })}
              </TextField>
            ) : (
              <Skeleton variant="rect" className={classes.textfieldSkeleton} />
            )}
          </Grid>
          <Grid item container xs={12} className={classes.field}>
            {props.isLoaded ? (
              <FormControl size="small" fullWidth="true" component="fieldset">
                <RadioGroup
                  row
                  aria-label="gender"
                  name="gender1"
                  value={values.gender}
                  onChange={handleChange("gender")}
                  className={classes.radioForm}
                >
                  <Grid item container lg={12} xs={12}>
                    <Grid item className={classes.radioFormLabel}>
                      Gender
                    </Grid>
                  </Grid>
                  <Grid
                    item
                    container
                    justify="center"
                    alignItems="center"
                    className={classes.radios}
                  >
                    <FormControlLabel
                      value="female"
                      control={<Radio />}
                      label="Female"
                    />
                    <FormControlLabel
                      value="male"
                      control={<Radio />}
                      label="Male"
                    />
                  </Grid>
                </RadioGroup>
              </FormControl>
            ) : (
              <Skeleton variant="rect" className={classes.textfieldSkeleton} />
            )}
          </Grid>
        </Grid>
        <Grid item container xs={12} className={classes.field}>
          {props.isLoaded ? (
            <Button
              variant="outlined"
              color="secondary"
              fullWidth="true"
              onClick={handleDialogOpen}
            >
              Edit My Favorites
            </Button>
          ) : (
            <Skeleton variant="rect" className={classes.textfieldSkeleton} />
          )}
        </Grid>
        <Grid
          item
          container
          lg={12}
          xs={12}
          justify="flex-start"
          alignItems="center"
          className={classes.parts}
        >
          <Grid
            item
            container
            lg={4}
            xs={4}
            className={classes.title}
            justify="flex-start"
          >
            Security
          </Grid>
          <Divider className={classes.divider} />
        </Grid>
        {security.map((value) => {
          return (
            <Grid item container lg={12} className={classes.field}>
              {props.isLoaded ? (
                <FormControl
                  size="small"
                  variant="outlined"
                  style={{ width: "100%" }}
                >
                  <InputLabel
                    htmlFor={value.id}
                    classes={{ root: classes.passwordInputLable }}
                  >
                    {value.title}
                  </InputLabel>
                  <OutlinedInput
                    id={value.id}
                    type={values[value.show] ? "text" : "password"}
                    // value={values[value.id]}
                    onChange={handleChange(value.id)}
                    error={values.passwordError ? true : false}
                    fullWidth={true}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleShowPassword(value.show)}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {values[value.show] ? (
                            <Visibility />
                          ) : (
                            <VisibilityOff />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                    labelWidth={70}
                  />
                </FormControl>
              ) : (
                <Skeleton
                  variant="rect"
                  className={classes.textfieldSkeleton}
                />
              )}
            </Grid>
          );
        })}
        <Grid
          item
          container
          lg={12}
          md={12}
          justify="flex-end"
          className={classes.bottomButtonsPart}
        >
          <Grid
            item
            lg={4}
            md={4}
            sm={6}
            xs={12}
            className={[classes.saveButton, classes.bottomButtons].join(" ")}
          >
            <Button
              fullWidth="true"
              // type="submit"
              onClick={handleEdit}
              variant="contained"
              color="secondary"
            >
              Save
            </Button>
          </Grid>
        </Grid>
      </Grid>
      {/* </form> */}
      <FavoritesDialog
        state={isDialogOpen}
        activities={props.activities}
        handleClose={handleDialogClose}
        getFavorites={getFavorites}
      />
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        className={classes.joinMes}
        key={"top center"}
      >
        <Alert onClose={handleClose} variant="filled" severity={edit.status}>
          {edit.message}
        </Alert>
      </Snackbar>
    </Grid>
  );
}
