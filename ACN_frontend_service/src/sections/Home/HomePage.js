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
import EditEvent from "../Create-Community/CreateCommunity"

const theme = createMuiTheme({
    palette: {
      secondary: { main: "rgb(0, 90, 207)" },
    },
  });








export default function Home() {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [userinfo,setUserinfo] = useState({Avatar:'',name:'',username:''});
    const [MyC,setMyC] = useState(null);
    const [MyC2,setMyC2] = useState(null);
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
      else if (newValue === 1) {
        Tab_items = <div ><Community MyC={MyC2}/></div>
      }
      setTab(Tab_items)
    }
    const handleDialogClose = () => {
      setDialogOpen(false);
    };

    const handleDialogOpen = () => {
      setDialogOpen(true);
    };

    const handleLogout = () => {
      localStorage.removeItem("token");
      window.location.href='/'
    };
    useEffect(() => {
        // setLoader(true);
        if (localStorage.getItem("token") == null) {
          window.location.href = "/"
        } else {
          axios.defaults.headers.common['Authorization'] = localStorage.getItem("token")
          const formData = new FormData();
          formData.append("reco", localStorage.getItem("token").toString());
    
          axios.get(`${Const.baseUrl}/account/myself_info`).then((response) => {
            setUserinfo(response.data);
          });
          axios.get(`${Const.baseUrl}/community/all_communities`, formData).then((res) => {
                   
            setMyC(res.data);
            
            
            })
            axios.get(`${Const.baseUrl}/community/my_communities`, formData).then((res) => {
                   
              setMyC2(res.data);
              
              
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
                

                                <div className="loz2">
                    <ul className="smain_loz">
                    <li className="slozac1">
                    <ul className="smain_loz" >
                    <li className="slozac11" onClick={()=>history.push("./profileedit")}>
                    <div className="stitle"><h5>Profile Edits</h5></div>
                    <div className="sbg1"></div>
                    <p className="ffont sD_label1"></p>

                    </li>
                    </ul>
                    </li>
                    <li className="slozac2">
                    <ul className="smain_loz">
                    <li
                    className="slozac21"

                    >
                    <div className="stitle"><h6>Up Comming Events</h6></div>
                    <div className="sbg2"></div>
                    <p className= "ffont sD_label21">

                    </p>

                    </li>
                    </ul>
                    </li>
                    <li className="slozac3">
                    <ul className="smain_loz">
                    <li className="slozac31" onClick={() => handleDialogOpen()}>
                    <div className="stitle"><h6>Create Commiunity</h6></div>
                    <div className="sbg3"></div>
                    <p className="ffont sD_label3"></p>

                    </li>
                    </ul>
                    </li>
                    <li className="slozac4" onClick={() => handleLogout()}>
                    <div className="sslider">
                    <div class="outer">
                      <div class="inner">
                        <label class="hh">Exit</label>
                      </div>
                    </div>
                    </div>
                    </li>
                    </ul>
                    </div>
                
                <div className="profpage">
                    <div className="profile">
                        <Avatar
                        src={userinfo.avatar?Const.baseUrl+userinfo.avatar:`${pro}`}
                        className="img2"
                        />
                    </div>
                    <h4 style={{color:"rgb(54, 54, 54,0.6)",textAlign:"center",marginTop:"40px"}}>
                      <span style={{fontSize:".75rem",color:"rgb(54, 54, 54,0.4)"}}>Name:  </span>
                       {userinfo.name}<br/>
                      <span style={{fontSize:".75rem",color:"rgb(54, 54, 54,0.4)"}}>UserName:  </span>
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
            <EditEvent state={isDialogOpen} handleClose={handleDialogClose}/>
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