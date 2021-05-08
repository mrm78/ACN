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
import Community from "./Community"

const theme = createMuiTheme({
    palette: {
      secondary: { main: "rgb(0, 90, 207)" },
    },
  });








export default function Home() {

    const [userinfo,setUserinfo] = useState(null);
    const [MyC,setMyC] = useState(null);
    const [value, setValue] = React.useState(0);
    const [Loader, setLoader] = useState(true);
    const history = useHistory();
    const [Tab_item, setTab] = useState();

    let Tab_items = null
    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
      setValue(newValue);
      if (newValue === 0) {
        Tab_items = <div ><Community MyC={MyC}/></div>
      }
      setTab(Tab_items)
    }

    useEffect(() => {
        // setLoader(true);
        if (localStorage.getItem("token") == null) {
          history.push('/')
        } else {
          axios.defaults.headers.common['Authorization'] = localStorage.getItem("token")
          const formData = new FormData();
          formData.append("reco", localStorage.getItem("token").toString());
    
          axios.get(`${Const.baseUrl}/account/myself_info`).then((response) => {
            setUserinfo(response.data);
          });
          axios.get(`${Const.baseUrl}/community/all_community`, formData).then((res) => {
                   
            setMyC(res.data);
            
            
            })
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
      useEffect(() => {
        if (MyC != null) {
          setLoader(false);
        }
        setTab(<div data-testid="tab0"><Community MyC={MyC}/></div>)
      }, [MyC,userinfo]);


    return(
      <>
      {!Loader ? (
        <div className="Home_main">
            <div className="h_header">
                {loz}
                
                <div className="profpage">
                    <div className="profile">
                        <Avatar
                        src={userinfo.Avatar?userinfo.Avatar:`${pro}`}
                        className="img2"
                        />
                    </div>
                    <h4 style={{color:"rgb(54, 54, 54,0.6)",textAlign:"center",marginTop:"40px"}}>
                      {/* <span style={{fontSize:".3rem",color:"rgb(54, 54, 54,0.4)"}}>Name:</span> */}
                       {userinfo.name}<br/>
                      {/* <span style={{fontSize:".3rem",color:"rgb(54, 54, 54,0.4)"}}>UserName:</span> */}
                       {userinfo.username}</h4>
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
                
                    <Tab label="Communities"/>
                    <Tab label="My Communities" />
                </Tabs>
            </Paper>
            </ThemeProvider>
            <Grid sm={12} xs={12} style={{ margin: '15px auto 60px auto' }}>
                            {Tab_item}
                        </Grid>
            
            </div>
        </div>
          ) : (<Backdrop classes={{
            root:{
            alignContent: "center",
            zIndex: "3000",
            color: "#ff0",
            backgroundColor: "rgba(0, 0, 0, 0.9)",}
          }} open={Loader}>
            <div className="loader"></div>
          </Backdrop>)}
          </>
    )
}