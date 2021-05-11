import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  ThemeProvider,
  createMuiTheme,
  makeStyles,
  Grid,
  Divider,
  CircularProgress,
  Backdrop,
  Paper,
} from "@material-ui/core";
import sampleAvatar from "../../static/man-avatar.svg";
import { FontDownloadSharp } from "@material-ui/icons";
import EditProfile from "./EditProfile";
import Profile from "./Profile";
import Const from "../../static/CONST";


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
    borderRadius: "4px",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  verticalDivider: {
    height: "100%",
    width: 2,
  },
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

export default function ProfilePage() {
  const [isLoaded, setIsLoaded] = useState(true);
  const [values, setValues] = useState({
    old_password: null,
    new_password: null,
  });
  const [activities, setActivities] = useState([]);
  const classes = useStyle();
  const getAvatar = (avatar) => {
    let newAvatar = avatar;
    setValues({ ...values, avatar: newAvatar });
  };
  const getInfo = () => {
    var isOK = false;
    const formData = Const.toFormData({
      reco: localStorage.getItem("token").toString(),
    });
    axios
      .post(`${Const.baseUrl}/account/get_user_info`, formData)
      .then((res) => {
        console.log(res);
        // console.log(res.data);
        setValues(res.data);
        if (res.status === 200) {
          setIsLoaded(true);
        }
      });
    axios
      .post(`${Const.baseUrl}/account/wishlist_activities`, formData)
      .then((res) => {
        setActivities(res.data);
      });
  };
  useEffect(() => getInfo(), []);

  return (
    // <>
    //   {isLoaded ? (
    <Paper elevation={5}>
      <ThemeProvider theme={theme1}>
      <Grid
        container
        justify="center"
        alignItems="flex-start"
        className={classes.root}
      >
        <Grid item container justify="center" alignItems="flex-start" lg={12}>
          <Profile
            values={{
              avatar: values.avatar,
              name: values.name,
              bio: values.bio,
            }}
            getAvatar={getAvatar}
            isLoaded={isLoaded}
          />
          <Grid item>
            <Divider
              orientation="vertical"
              flexItem
              className={classes.verticalDivider}
            />
          </Grid>
          <EditProfile
            data={values}
            activities={activities}
            isLoaded={isLoaded}
          />
        </Grid>
      </Grid>
      </ThemeProvider>
    </Paper>
    // ) : (
    //   <Backdrop className={classes.backdrop} open={!isLoaded}>
    //     <CircularProgress color="inherit" />
    //   </Backdrop>
    // )}
    // </>
  );
}
