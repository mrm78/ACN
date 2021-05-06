import React, { useState, useRef } from "react";
import { Redirect } from "react-router-dom";
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
} from "@material-ui/core";

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
}));

export default function Login(props) {
  const classes = useStyle();
  const [values, setValues] = useState({ code: "", error: "" });

  const handleChange = () => (event) => {
    setValues({ ...values, code: event.target.value });
  };

  const handleCodeValidation = () => {
    console.log(values.code);
    // console.log(props);
    if (props.code != values.code) {
      setValues({ ...values, error: "Code is not valid." });
      return false;
    }
    return true;
  };

  async function handleVerify(event) {
    event.preventDefault();
    console.log(values.code);
    console.log(props.username);
    const isValid = handleCodeValidation();
    if (isValid) {
      const formData = new FormData();
      formData.append("username", values.username);
      formData.append("verification_code", values.code);
      axios
        .post(`http://mrm7878.pythonanywhere.com/account/verify_code`, formData)
        .then((res) => {
          console.log(res);
          console.log(res.data);
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
        <Grid item lg={7} sm={8} xs={10} className={classes.errorTexts}>
          {values.error}
        </Grid>
        <Grid item lg={7} sm={8} xs={10}>
          <FormControl className={classes.textFields}>
            <InputLabel htmlFor="code">Verification Code</InputLabel>
            <Input
              id="code"
              value={props.code}
              onChange={handleChange}
              // error={
              //   values.requiredError || values.numberError ? true : false
              // }
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
              className={classes.button}
              fullWidth="true"
            >
              Verify
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
}
