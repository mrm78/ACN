import React, { useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import * as $ from "jquery";
import addimg from "../../static/add1.png";
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
  Paper
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
  button: {
    // width: "100%",
    marginTop: theme.spacing(3),
    backgroundColor:"#4040ce",
    borderRadius:"100px"
  },
  errorTexts: {
    color: "#f00",
    fontSize: 12,
  },
  alertMessage: {},
}));

export default function AddPost(props) {
  const history = useHistory();
  const initialStates = {
    token: localStorage.getItem("token"),
    caption: "",
    imageError: "",
  };
  console.log(props.comId)
  const classes = useStyle();
  const [values, setValues] = useState(initialStates);
  const [alertMessage, setAlertMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState(addimg);
  const [imageSize, setImageSize] = useState("100px");
  const [imgPos, setImgPos] = useState("25%");
  const [pic, setPic] = useState();
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };


  const handleUploadImage = (e) => {
    const file = e.target.files[0];
    setValues({ ...values, ['image']: e.target.files[0] });
    setImage(URL.createObjectURL(e.target.files[0]));
    setImageSize("200px");
    setImgPos("0%");
    //getAvatar(file);
  };

  const handleValidation = () => {
    let imageError = "";

    if (
      !values.image
    ) {
      imageError = "Picture is required for post!";
    }
    setValues({
      ...values,
      imageError: imageError,
    });
    if (imageError) {
      return false;
    }
    return true;
  };

  async function handlePost(event) {
    const isValid = handleValidation();
    if (isValid) {
      const data = { caption: values.caption, community_id: props.comId, image: values.image};
      const formData = Const.toFormData(data);
      axios.post(`${Const.baseUrl}/community/create_post`, formData,{
        headers : {Authorization: values.token}
      }).then((res) => {

        if (res.status === 200) {
          if (res.data.status === "success") {
            window.location.reload();

          } else if (res.data.error === "no image") {
            setAlertMessage("You have to upload a photo.");
            setOpen(true);
          } else if (res.data.error === "invalid community id") {
            setAlertMessage("The community does not exist.");
            setOpen(true);
          } else if (res.data.error === "permission denied") {
            setAlertMessage("You do not have permission to create post in current community.");
            setOpen(true);
          }
        }
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
          {[values.imageError].map((value) => {
            return (
              <Grid item lg={7} sm={8} xs={10} className={classes.errorTexts}>
                {value}
              </Grid>
            );
          })}

          <Grid style={{ padding: "10px" }} sm={6} xs={8}>
            <Paper elevation={5} style={{width: "200px" }}>
              <div style={{height:"200px", width:"200px"}}>
                <img src={image} style={{position: 'relative',width: imageSize, height: imageSize, left:imgPos, top:imgPos, borderRadius: "5px",objectFit:"cover"}}/>
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
            </Grid>
          </Grid>


          <Grid style={{ padding: "10px" }} xs={10}>
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

          <Grid item lg={7} sm={8} xs={10}></Grid>
          <Grid
            item
            container
            sm={10}
            xs={8}
            alignItems="center"
            justify="space-between"
          >
            <Grid item xs={12}>
              <Button
                type="submit"
                onClick={() => handlePost()}
                variant="contained"
                color="primary"
                className={classes.button}
                fullWidth="true"
              >
                Post
              </Button>
            </Grid>
            {/* <Grid item lg={5}>
                <Button variant="contained" className={classes.loginButton}>
                  ورود
                </Button>
              </Grid> */}
          </Grid>
        </Grid>
      </Grid>
  );
}
