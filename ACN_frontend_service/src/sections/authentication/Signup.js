import React, { useState, useRef } from "react";
import { isEmail } from "validator";
import { useHistory } from "react-router-dom";
import axios from "axios";
import {
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
import EmailVerify from "./EmailVerify";
import { Visibility, VisibilityOff } from "@material-ui/icons";
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
    marginTop: theme.spacing(3),
  },
  errorTexts: {
    color: "#f00",
    fontSize: 12,
  },
  alertMessage: {},
}));

export default function Signup() {
  const history = useHistory();
  const classes = useStyle();
  const initialStates = {
    isSignedUp: false,
    username: "",
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
    showPassword: false,
    showConfPassword: false,
    nameError: "",
    emailError: "",
    usernameError: "",
    passwordError: "",
    code: "",
  };
  let code = "";
  const [values, setValues] = useState(initialStates);

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const [alertMessage, setAlertMessage] = useState("");
  const [open, setOpen] = React.useState(false);
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const handleValidation = () => {
    let nameError = "";
    let emailError = "";
    let usernameError = "";
    let passwordError = "";

    if (!values.name) {
      nameError = "Enter your name, please.";
    }
    if (!values.email || !isEmail(values.email)) {
      emailError = "Email is not valid.";
    }
    if (!values.username) {
      usernameError = "Username is required.";
    }
    if (
      !values.password ||
      values.password.length < 6 ||
      values.password.length > 40
    ) {
      passwordError = "Password must be at least 6 characters.";
    }
    if (values.password !== values.confirmPassword) {
      passwordError = "Passwords not match.";
    }
    setValues({
      ...values,
      nameError: nameError,
      emailError: emailError,
      usernameError: usernameError,
      passwordError: passwordError,
    });
    if (nameError || emailError || usernameError || passwordError) {
      return false;
    }
    return true;
  };

  const handleShowPassword = (prop) => () => {
    setValues({ ...values, [prop]: !values[prop] });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleEmailVerification = (isSignedUp) => {
    if (!isSignedUp) {
      setValues({ ...values, isSignedUp: false });
    }
  };

  async function handleSignup(event) {
    event.preventDefault();
    const isValid = handleValidation();
    if (isValid) {
      const data = {
        username: values.username,
        name: values.name,
        email: values.email,
        password: values.password,
      };

      const formData = Const.toFormData(data);
      axios.post(`${Const.baseUrl}/account/register`, formData).then((res) => {
        if (res.status === 200) {
          if (res.data.status === "success") {
            setValues({ ...values, isSignedUp: true });
            localStorage.setItem("token", res.data.token);
            history.push('/home');
          } else {
            if (res.data.error === "not available email") {
              setAlertMessage("Email is already used.");
              setOpen(true);
            } else if (res.data.error === "not available username") {
              setAlertMessage("Username is already used.");
              setOpen(true);
              console.log("lksjdflskjdflsjflskjflks");
            }
          }
        }
      });
    }
  }

  return (
    <>
      {!values.isSignedUp ? (
        <form onSubmit={handleSignup}>
          <Grid
            container
            justify="center"
            alignItems="flex-start"
            className={classes.root}
          >
            <Grid
              item
              container
              xl={12}
              lg={12}
              xs={12}
              alignItems="center"
              justify="center"
            >
              {[
                values.nameError,
                values.usernameError,
                values.emailError,
                values.passwordError,
              ].map((value) => {
                return (
                  <Grid
                    item
                    lg={7}
                    sm={8}
                    xs={10}
                    className={classes.errorTexts}
                  >
                    {value}
                  </Grid>
                );
              })}
              <Grid item lg={7} sm={8} xs={10}>
                <FormControl className={classes.textFields}>
                  <InputLabel htmlFor="standard-adornment-password">
                    Name
                  </InputLabel>
                  <Input
                    id="standard-number"
                    value={values.name}
                    onChange={handleChange("name")}
                    error={values.nameError ? true : false}
                  />
                </FormControl>
              </Grid>
              <Grid item lg={7} sm={8} xs={10}>
                <FormControl className={classes.textFields}>
                  <InputLabel htmlFor="standard-adornment-password">
                    Username
                  </InputLabel>
                  <Input
                    id="standard-number"
                    value={values.username}
                    onChange={handleChange("username")}
                    error={values.usernameError ? true : false}
                  />
                </FormControl>
              </Grid>
              <Grid item lg={7} sm={8} xs={10}>
                <FormControl className={classes.textFields}>
                  <InputLabel htmlFor="standard-adornment-password">
                    Email
                  </InputLabel>
                  <Input
                    id="standard-number"
                    value={values.email}
                    onChange={handleChange("email")}
                    error={values.emailError ? true : false}
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
                          onClick={handleShowPassword("showPassword")}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {values.showPassword ? (
                            <Visibility />
                          ) : (
                            <VisibilityOff />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </Grid>
              <Grid item lg={7} sm={8} xs={10}>
                <FormControl className={classes.textFields}>
                  <InputLabel htmlFor="standard-adornment-password">
                    Confirm password
                  </InputLabel>
                  <Input
                    id="standard-adornment-password"
                    type={values.showConfPassword ? "text" : "password"}
                    value={values.confirmPassword}
                    onChange={handleChange("confirmPassword")}
                    error={values.passwordError ? true : false}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleShowPassword("showConfPassword")}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {values.showConfPassword ? (
                            <Visibility />
                          ) : (
                            <VisibilityOff />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </Grid>
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
                    Signup
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </form>
      ) : (
        <EmailVerify
          code={values.code}
          username={values.username}
          handleVerify={handleEmailVerification}
        />
      )}
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
    </>
  );
}
