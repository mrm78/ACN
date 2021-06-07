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
  OutlinedInput,
  InputAdornment,
  Avatar,
  Paper,
  Divider,
  IconButton,
  Hidden,
} from "@material-ui/core";
import {
  FontDownloadSharp,
  Visibility,
  VisibilityOff,
} from "@material-ui/icons";
import FavoritesDialog from "./Favorites";

const useStyle = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.down("md")]: {
      marginTop: theme.spacing(8),
    },
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
}));

export default function EditProfile(props) {
  const initialStates = {
    number: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confNewPassword: "",
    username: "",
    showCurrentPassword: false,
    showNewPassword: true,
    showConfNewPassword: false,
    nameError: "",
    emailError: "",
    numberError: "",
    passwordError: "",
  };
  const [values, setValues] = useState(initialStates);
  const classes = useStyle();
  const basicInfo = [
    { currentPassword: "Name", default: values.name },
    { newPassword: "Emial", default: values.email },
    { confNewPassword: "Username", default: values.username },
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

  const [isDialogOpen, setDialogOpen] = useState(false);

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };
  const handleDialogClose = () => {
    setDialogOpen(false);
  };
  const handleValidation = () => {
    let nameError = "";
    let emailError = "";
    let numberError = "";
    let passwordError = "";

    if (!values.name) {
      nameError = "لطفا نام خود را وارد نمایید.";
    }
    if (!values.email || !isEmail(values.email)) {
      emailError = "ایمیل وارد شده صحیح نمی‌باشد.";
    }
    if (!values.number || values.number.length !== 11 || isNaN(values.number)) {
      numberError = "شماره تلفن وارد شده صحیح نمی‌باشد.";
    }
    if (
      !values.password ||
      values.password.length < 6 ||
      values.password.length > 40
    ) {
      passwordError = "پسورد باید بین ۶ تا ۴۰ کاراکتر باشد.";
    }
    if (values.password !== values.confirmPassword) {
      passwordError = "پسوردهای وارد شده یکسان نمی‌باشد.";
    }
    setValues({
      ...values,
      nameError: nameError,
      emailError: emailError,
      numberError: numberError,
      passwordError: passwordError,
    });
    if (nameError || emailError || numberError || passwordError) {
      return false;
    }
    return true;
  };

  async function handleEdit(event) {
    event.preventDefault();
    const isValid = handleValidation();
    if (isValid) {
      setValues({ ...initialStates });
      console.log("////////////////////////////");
      let params = {
        phone: values.number,
        password: values.password,
      };
      $.ajax({
        type: "POST",
        url: "http://74e4478d6dae.ngrok.io/account/login",
        data: params,
        xhrFields: {
          withCredentials: true,
        },
        success: () => {
          alert("welcom");
        },
      });
    }
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
      <Grid item container lg={10} xs={10} justify="center" alignItems="center">
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
          <Hidden smDown>
            <Grid item container lg={5} md={7} justify="space-between">
              <Grid item lg={6} md={6} className={classes.cancleButton}>
                <Button fullWidth="true" variant="contained">
                  Cancle
                </Button>
              </Grid>
              <Grid item lg={6} md={6} className={classes.saveButton}>
                <Button fullWidth="true" variant="contained" color="primary">
                  Save
                </Button>
              </Grid>
            </Grid>
          </Hidden>
          <Divider className={classes.divider} />
        </Grid>
        {basicInfo.map((value) => {
          return (
            <Grid item container lg={12} xs={12} className={classes.field}>
              <TextField
                variant="outlined"
                size="small"
                fullWidth="true"
                label={value.title}
                defaultValue={value.default}
              />
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
          <TextField
            variant="outlined"
            size="small"
            fullWidth="true"
            label="Biography"
            defaultValue=""
            multiline
            rows={2}
            rowsMax={4}
          />
        </Grid>
        <Grid item container lg={12} xs={12} className={classes.field}>
          <Button color="primary" onClick={handleDialogOpen}>
            Edit My Favorites
          </Button>
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
                  value={values[value.id]}
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
            className={[classes.cancleButton, classes.bottomButtons].join(" ")}
          >
            <Button fullWidth="true" variant="contained">
              Cancle
            </Button>
          </Grid>
          <Grid
            item
            lg={4}
            md={4}
            sm={6}
            xs={12}
            className={[classes.saveButton, classes.bottomButtons].join(" ")}
          >
            <Button fullWidth="true" variant="contained" color="primary">
              Save
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <FavoritesDialog state={isDialogOpen} handleClose={handleDialogClose} />
    </Grid>
  );
}
