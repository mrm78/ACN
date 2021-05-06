import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    ThemeProvider,
    CircularProgress,
    createMuiTheme,
    Backdrop,
    Container,
    Grid,
    makeStyles,
    Tabs,
    Tab,
    Paper,
    Avatar,
  } from "@material-ui/core";
import Const from "../../static/CONST";
import "./HomePage.css"
import pro from '../../static/pro2.png'
import { useHistory } from "react-router-dom";
import loz from "./Loz"
import Story from "./Story"

const theme = createMuiTheme({
    palette: {
      secondary: { main: "rgb(0, 90, 207)" },
    },
  });








export default function Home() {

    const [value, setValue] = React.useState(2);
    const history = useHistory();
    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
      setValue(newValue);
    }

    useEffect(() => {
        // setLoader(true);
        if (localStorage.getItem("token") == null) {
          history.push("/");
        } else {
          const formData = new FormData();
          formData.append("reco", localStorage.getItem("token").toString());
    
        //   axios.get(`${Const.baseUrl}/event/all_events`).then((response) => {
        //     setAll_evnt(response.data);
        //   });
        //   axios
        //     .post(`${Const.baseUrl}/event/all_activities`, formData)
        //     .then((response) => {
        //       response.data = response.data.map((data) => {
        //         data.id--;
        //         return data;
        //       });
    
        //       setAll_ac(response.data);
        //     });
        //   axios
        //     .post(`${Const.baseUrl}/account/get_user_info`, formData)
        //     .then((res) => {
        //       if (res.status === 200) {
        //         setUserD(res.data);
        //       } else {
        //         history.push("/");
        //       }
        //     });
        //   axios.post(`${Const.baseUrl}/event/my_events`, formData).then((res) => {
        //     setMyE1(res.data);
        //   });
        //   axios
        //     .post(`${Const.baseUrl}/account/events_count`, formData)
        //     .then((res) => {
        //       setUserStatic(res.data);
        //     });
        }
      }, []);


    return(
        <div className="Home_main">
            <div className="h_header">
                {loz}
                
                <div className="profpage">
                    <div className="profile">
                        <Avatar
                        src={`${pro}`}
                        className="img2"
                        />
                    </div>
                </div>
            </div>
            <div className="h_body">
            <div className="h_hbody">
                {Story}
            </div>
            <ThemeProvider theme={theme}>
            <Paper square>
                <Tabs
                    value={value}
                    centered
                    variant="fullWidth"
                    indicatorColor="secondary"
                    textColor="secondary"
                    onChange={handleChange}
                    aria-label="disabled tabs example">
                
                    <Tab label="Communities" />
                    <Tab label="My Communities" />
                </Tabs>
            </Paper>
            </ThemeProvider>
            </div>
        </div>
    )
}