import React, { useState, useRef } from "react";
import { isEmail } from "validator";
import * as $ from "jquery";
import {    
  ThemeProvider,
  CircularProgress,
  createMuiTheme,
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
  Divider,
} from "@material-ui/core";
import sampleAvatar from "../../static/man-avatar.svg";
import { FontDownloadSharp } from "@material-ui/icons";
import Profile from "./Profile";
import EditProfile from "./EditProfile";

const theme1 = createMuiTheme({
  palette: {
    secondary: { main: "rgb(0, 90, 207)" },
  },
});

const useStyle = makeStyles((theme) => ({
  root: {
    backgroundColor: "#fff",
    padding: theme.spacing(6, 0),
    textAlign: "center",
  },
  verticalDivider: {
    height: "100%",
    width: 2,
  },
}));

export default function ProfilePage(props) {
  const initialStates = {
    number: "",
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
    showPassword: false,
    nameError: "",
    emailError: "",
    numberError: "",
    passwordError: "",
  };
  const [values, setValues] = useState(initialStates);
  const classes = useStyle();

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
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

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
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
      container
      justify="center"
      alignItems="flex-start"
      className={classes.root}
    >
      <ThemeProvider theme={theme1}>
      <Grid item container justify="center" alignItems="flex-start" lg={12}>
        <Profile />
        <Grid item>
          <Divider
            orientation="vertical"
            flexItem
            className={classes.verticalDivider}
          />
        </Grid>
        <EditProfile />
      </Grid>
      </ThemeProvider>
    </Grid>
  );
}
