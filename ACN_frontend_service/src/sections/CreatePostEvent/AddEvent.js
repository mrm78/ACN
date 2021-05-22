import React, { useState, useRef } from "react";
import { isEmail } from "validator";
import axios from "axios";
import addimg from "../../static/add1.png";
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
  TextField,
  Paper
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
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
  button: {
    marginTop: theme.spacing(3),
    backgroundColor:"#4040ce",
    borderRadius:"100px"
  },
  textField: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(0),
    marginRight: theme.spacing(1),
    width: 185,
  },
  errorTexts: {
    color: "#f00",
    fontSize: 12,
  },
  alertMessage: {},
}));

export default function AddEvent(props) {
  const classes = useStyle();
  const initialStates = {
    token: localStorage.getItem("token"),
    title: "",
    caption: "",
    time: "",
    name: "",
  };
  const [values, setValues] = useState(initialStates);

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
    console.log(event.target.value)
  };

  const [alertMessage, setAlertMessage] = useState("");
  const [open, setOpen] = React.useState(false);
  const [image, setImage] = useState(addimg);
  const [imageSize, setImageSize] = useState("100px");
  const [pic, setPic] = useState();
  const [imgPos, setImgPos] = useState("25%");
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const handleValidation = () => {
    let titleError = "";
    let timeError = "";


    if (!values.title) {
      titleError = "Enter event title, please.";
    }
    if (!values.time) {
      timeError = "Set the event time.";
    }
    setValues({
      ...values,
      titleError: titleError,
      timeError: timeError,
    });
    if (titleError || timeError) {
      console.log("khaaaar");
      return false;
    }
    return true;
  };


  const handleUploadImage = (e) => {
    const file = e.target.files[0];
    setValues({ ...values, ['image']: e.target.files[0] });
    setImage(URL.createObjectURL(e.target.files[0]));
    setImageSize("200px");
    setImgPos("0%");
    //getAvatar(file);
  };

  async function handleMakeEvent(event) {
    const isValid = handleValidation();
    if (isValid) {
      const data = {
        title: values.title,
        begin_time: values.time,
        description: values.caption,
        image: values.image,
        community_id: props.comId,
      };

      const formData = Const.toFormData(data);
      axios.post(`${Const.baseUrl}/community/create_event`, formData,{
      headers : {Authorization: values.token}}
      ).then((res) => {
        if (res.status === 200) {
          if (res.data.status === "success") {
            setValues({ ...values, isSignedUp: true });
            window.location.reload();
            // localStorage.setItem("token", res.data.token);
            // history.push(`/home/${values.username}`);
          } else {
            if (res.data.error === "empty title") {
              setAlertMessage("Event has to have a title.");
              setOpen(true);

            } else if (res.data.error === "invalid community id") {
              setAlertMessage("The community does not exist.");
              setOpen(true);
            } else if (res.data.error === "permission denied") {
              setAlertMessage("You do not have permission to create post in current community.");
              setOpen(true);
            } else if (res.data.error === "invalid begin time format") {
              setAlertMessage("Your event time is invalid.");
              setOpen(true);
            }
          }
        }
      });
    }
  }

  return (
    <>
      {(
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
                values.titleError,
                values.timeError,
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
              <Grid
                item
                container
                xl={12}
                lg={12}
                xs={12}
                alignItems="center"
                justify="center"
              >
              <Grid style={{ padding: "10px" }} sm={6} xs={8}>
                <Paper elevation={5} style={{width: "200px" }}>
                  <div style={{height:"200px", width:"200px"}}>
                    <img src={image} style={{position: 'relative',width: imageSize, height: imageSize, left:imgPos, top:imgPos, borderRadius: "5px", objectFit:"cover"}}/>
                  </div>
                </Paper>
              </Grid>
              <Grid
                item
                container
                sm={4}
                xs={8}
                alignItems="center"
                justify="space-between"
              >
                <Grid item xs={12}>
                  <Button

                    variant="contained"
                    component="label"
                    color="primary"
                    className={classes.button}
                    fullWidth="true"
                  >
                    Upload Photo
                    <input type="file" hidden onChange={handleUploadImage} />
                  </Button>
                  <form className={classes.container} noValidate>
                     <TextField
                       id="datetime-local"
                       onChange={handleChange("time")}
                       label="Event Date & Time"
                       type="datetime-local"
                       defaultValue="now"
                       className={classes.textField}
                       InputLabelProps={{
                         shrink: true,
                       }}
                     />
                   </form>
                </Grid>
              </Grid>
              </Grid>
              <Grid item lg={9} sm={9} xs={9}>
                <FormControl className={classes.textFields}>
                  <InputLabel htmlFor="standard-adornment-password">
                    Event Title
                  </InputLabel>
                  <Input

                    value={values.title}
                    onChange={handleChange("title")}
                  />
                </FormControl>
              </Grid>

              <Grid style={{ padding: "10px" }} lg={10} sm={10} xs={10}>
                <TextField
                  onChange={handleChange("caption")}
                  multiline
                  rows={6}
                  fullWidth="true"
                  placeholder="Caption"
                  label="Caption"
                  variant="outlined"
                  style={{marginTop: "40px"}}
                />
              </Grid>

              <Grid
                item
                container

                xs={10}
                alignItems="center"
                justify="space-between"
              >
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    fullWidth="true"
                    onClick={() => handleMakeEvent()}
                  >
                    Add Event
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
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
