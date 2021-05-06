import React, { useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import {
  TextField,
  Grid,
  makeStyles,
  Button,
  IconButton,
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  Snackbar,
  Portal,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
// import { Visibility, VisibilityOff } from "@material-ui/icons";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import Const from "../../static/CONST";

const useStyle = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.up("md")]: {
      minHeight: 400,
      width: "100%",
    },
  },
  textFields: {
    width: "100%",
    marginTop: theme.spacing(2),
  },
  loginButton: {
    // width: "100%",
    marginTop: theme.spacing(3),
  },
  errorTexts: {
    color: "#f00",
    fontSize: 12,
  },
  alertMessage: {},
}));

export default function Login(props) {
  const history = useHistory();
  const initialStates = {
    username: "",
    password: "",
    showPassword: false,
    usernameError: "",
    passwordError: "",
  };
  const classes = useStyle();
  const [values, setValues] = useState(initialStates);
  const [alertMessage, setAlertMessage] = useState("");
  const [open, setOpen] = useState(false);
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleValidation = () => {
    let usernameError = "";
    let passwordError = "";

    if (
      !values.password ||
      values.password.length < 6 ||
      values.password.length > 40
    ) {
      passwordError = "Password must be at least 6 characters.";
    }
    setValues({
      ...values,
      usernameError: usernameError,
      passwordError: passwordError,
    });
    if (usernameError || passwordError) {
      return false;
    }
    return true;
  };

  async function handleLogin(event) {
    event.preventDefault();
    const isValid = handleValidation();
    if (isValid) {
      const data = { username: values.username, password: values.password };
      const formData = Const.toFormData(data);
      axios.post(`${Const.baseUrl}/account/login`, formData).then((res) => {
        
        if (res.status === 200) {
          if (res.data.status === "success") {
            localStorage.setItem("token", res.data.token);
            // history.push(`/home/${values.username}`);
            history.push('./home');
          } else {
            setAlertMessage("Username or password wrong.");
            setOpen(true);
          }
        }
      });
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <Grid
        container
        justify="center"
        alignItems="flex-start"
        className={classes.root}
      >
        <Portal>
          <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={handleClose}
            className={classes.alertMessage}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
          >
            <Alert onClose={handleClose} variant="filled" severity="error">
              {alertMessage}
            </Alert>
          </Snackbar>
        </Portal>
        <Grid
          item
          container
          xl={12}
          lg={12}
          xs={12}
          alignItems="center"
          justify="center"
        >
          {[values.usernameError, values.passwordError].map((value) => {
            return (
              <Grid item lg={7} sm={8} xs={10} className={classes.errorTexts}>
                {value}
              </Grid>
            );
          })}
          <Grid item lg={7} sm={8} xs={10}>
            <FormControl className={classes.textFields}>
              <InputLabel htmlFor="standard-adornment-password">
                Username
              </InputLabel>
              <Input
                id="standard-number"
                value={values.username}
                onChange={handleChange("username")}
                error={
                  values.requiredError || values.usernameError ? true : false
                }
              />
            </FormControl>
          </Grid>
          <Grid item lg={7} sm={8} xs={10}>
            <FormControl className={classes.textFields}>
              <InputLabel htmlFor="standard-adornment-password">
                Password
              </InputLabel>
              <Input
                id="standard-adornment-password"
                type={values.showPassword ? "text" : "password"}
                value={values.password}
                onChange={handleChange("password")}
                error={values.passwordError ? true : false}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {values.showPassword ? (
                        <VisibilityIcon />
                      ) : (
                        <VisibilityOffIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </Grid>
          <Grid item lg={7} sm={8} xs={10}></Grid>
          <Grid
            item
            container
            lg={7}
            sm={8}
            xs={10}
            alignItems="center"
            justify="space-between"
          >
            <Grid item lg={6} sm={6} xs={7}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className={classes.loginButton}
                fullWidth="true"
              >
                Login
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
}
