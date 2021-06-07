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
import Const from "../../static/CONST";

const useStyle = makeStyles((theme) => ({
  textFields: {
    width: "100%",
    marginTop: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(3),
  },
  errorTexts: {
    color: "#f00",
    fontSize: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 600,
  },
  cancleContainer: {
    paddingLeft: theme.spacing(1),
  },
  submitContainer: {
    paddingRight: theme.spacing(1),
  },
}));

export default function Login(props) {
  const history = useHistory();
  const classes = useStyle();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setCode(event.target.value);
  };
  const [alertMessage, setAlertMessage] = useState("");
  const [open, setOpen] = React.useState(false);
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  const handleCodeValidation = () => {
    if (code.length == 0) {
      setError("Enter code.");
      return false;
    }
    return true;
  };

  const handleCancle = () => {
    props.handleVerify(false);
  };
  async function handleVerify(event) {
    event.preventDefault();
    console.log(code);
    console.log(props.username);
    const isValid = handleCodeValidation();
    if (isValid) {
      const data = { username: props.username, verification_code: code };
      const formData = Const.toFormData(data);
      axios
        .post(`${Const.baseUrl}/account/verify_code`, formData)
        .then((res) => {
          console.log(res);
          console.log(res.data);
          if (res.status === 200) {
            if (res.data.status === "success") {
              localStorage.setItem("token", res.data.token);
              history.push("./home");
            } else {
              setAlertMessage("Code is not valid.");
              setOpen(true);
            }
          }
        });
    }
  }
  return (
    <form onSubmit={handleVerify}>
      <Grid
        item
        container
        xl={12}
        lg={12}
        xs={12}
        alignItems="center"
        justify="center"
      >
        <Grid item lg={7} sm={8} xs={10} className={classes.title}>
          Enter verification code.
        </Grid>
        <Grid item lg={7} sm={8} xs={10} className={classes.description}>
          It has been sent to your Email.
        </Grid>
        <Grid item lg={7} sm={8} xs={10} className={classes.errorTexts}>
          {error}
        </Grid>
        <Grid item lg={7} sm={8} xs={10}>
          <FormControl className={classes.textFields}>
            <InputLabel htmlFor="code">Verification Code</InputLabel>
            <Input
              id="code"
              value={code}
              onChange={handleChange}
              error={error ? true : false}
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
          <Grid item lg={6} sm={6} xs={6} className={classes.submitContainer}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.button}
              fullWidth="true"
            >
              Verify
            </Button>
          </Grid>
          <Grid item lg={6} sm={6} xs={6} className={classes.cancleContainer}>
            <Button
              variant="contained"
              color="secondary"
              className={classes.button}
              fullWidth="true"
              onClick={handleCancle}
            >
              Cancle
            </Button>
          </Grid>
        </Grid>
      </Grid>
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
    </form>
  );
}
