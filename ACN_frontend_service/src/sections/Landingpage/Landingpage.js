import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import Const from "../../static/CONST";
import "./landingpage.css";
import Carousel from "react-bootstrap/Carousel";
import med from "./med.jpg";
import med1 from "./med1.jpg";
import med2 from "./med2.jpg";
import PropTypes from "prop-types";
//import SwipeableViews from "react-swipeable-views";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";

import {
  makeStyles,
  useTheme,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  AppBar,
  Tabs,
  Tab,
  Typography,
  Box,
  Drawer,
} from "@material-ui/core";
import DialogBox from "../authentication/DialogBox";

const useStyle = makeStyles((theme) => ({
  paper: {
    height: "100px",
  },
  root: {
    height: "100%",
    width: 700,
    backgroundColor: "#888",
  },
  root2: {
    transform: "scale(3)",
  },
}));
// function TabPanel(props) {
//   const { children, value, index, ...other } = props;

//   return (
//     <div
//       role="tabpanel"
//       hidden={value !== index}
//       id={`full-width-tabpanel-${index}`}
//       aria-labelledby={`full-width-tab-${index}`}
//       {...other}
//     >
//       {value === index && (
//         <Box p={3}>
//           <Typography>{children}</Typography>
//         </Box>
//       )}
//     </div>
//   );
// }

// TabPanel.propTypes = {
//   children: PropTypes.node,
//   index: PropTypes.any.isRequired,
//   value: PropTypes.any.isRequired,
// };

// function a11yProps(index) {
//   return {
//     id: `full-width-tab-${index}`,
//     "aria-controls": `full-width-tabpanel-${index}`,
//   };
// }

export default function Landingpage() {
  const history = useHistory();
  const classes = useStyle();
  // const theme = useTheme();
  const [isLogedin, setIsLogedin] = useState(false);
  const [Sfooter, setSfooter] = useState(false);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [values, setValues] = useState({});

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };
  const redirectToHome = () => {
    history.push(`/home/${values.username}`);
  };
  const getData = () => {
    if (
      localStorage.getItem("token")
    ) {
      console.log(localStorage.getItem("token"));
      const formData = Const.toFormData({
        reco: localStorage.getItem("token").toString(),
      });
      axios
        .post(`${Const.baseUrl}/account/get_user_info`, formData)
        .then((res) => {
          // console.log(res);
          console.log(res.data);
          setValues(res.data);
          setIsLogedin(true);
        });
    }
  };
  useEffect(() => getData(), []);
  return (
    <div className="body_bg">
      <header className="main">
        {/* <div className="header"></div> */}
        <div className="vasat">
          <div className="loz">
            <ul className="main_loz">
              <li className="lozac1">
                <ul className="main_loz">
                  <li className="lozac11">
                    <div className="bg1"></div>
                      <h3 className="ffont D_label1">Community</h3>
                    <ArrowDownwardIcon className="MuiSvg" />
                  </li>
                </ul>
              </li>
              <li className="lozac2">
                <ul className="main_loz">
                  <li
                    className="lozac21"
                    onClick={isLogedin ? redirectToHome : handleDialogOpen}
                  >
                    <div className="bg2"></div>
                    <h5 className= {isLogedin ? "ffont D_label21" : "ffont D_label2"}>
                      {isLogedin ? "Home" : "Login|Signup"}
                    </h5>
                    <ArrowDownwardIcon className="MuiSvg" />
                  </li>
                </ul>
              </li>
              <li className="lozac3">
                <ul className="main_loz">
                  <li className="lozac31">
                    <div className="bg3"></div>
                    <h2 className="ffont D_label3">Info</h2>
                    <ArrowDownwardIcon className="MuiSvg" />
                  </li>
                </ul>
              </li>
              <li className="lozac4">
                <div className="slider">
                  <Carousel className="slider2">
                    <Carousel.Item className="s_item">
                      <img
                        className="d-block w-100"
                        src={med}
                        alt="First slide"
                      />
                      <Carousel.Caption></Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item className="s_item">
                      <img
                        className="d-block w-100"
                        src={med1}
                        alt="Third slide"
                      />

                      <Carousel.Caption></Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item className="s_item">
                      <img
                        className="d-block w-100"
                        src={med2}
                        alt="Third slide"
                      />

                      <Carousel.Caption></Carousel.Caption>
                    </Carousel.Item>
                  </Carousel>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </header>
      {/* <div className={Sfooter ? "bgb1" : "bgb"}></div>

      <div
        className={Sfooter ? "footer1" : "footerr"}
        onClick={() => setSfooter(!Sfooter)}
      >
        <div className="footLoz">
          <div className={Sfooter ? "payin" : "bala"}></div>
        </div>
        <p className={Sfooter ? "cool1" : "cool"}>A Cool Name</p>
      </div> */}
      <DialogBox state={isDialogOpen} handleClose={handleDialogClose} />
    </div>
  );
}
