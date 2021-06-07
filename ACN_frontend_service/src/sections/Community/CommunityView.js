import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    ThemeProvider,
    CircularProgress,
    createMuiTheme,
    Backdrop,
    Container,
    Grid,
    Chip,
    makeStyles,
    Tabs,
    Tab,
    Paper,
    Avatar,
    Button
  } from "@material-ui/core";
import Const from "../../static/CONST";
import "./Com.css";
import pro from '../../static/pro2.png';
import Post from "./post"
import Event from "./event"
import { useHistory } from "react-router-dom";
import Butt from "./but"
import Com from "../../static/community.jpg"
import { post } from "jquery";
import AddIcon from "@material-ui/icons/Add"
import CreatePE from "../CreatePostEvent/DialogBox"



const theme = createMuiTheme({
    palette: {
      secondary: { main: "rgb(0, 90, 207)" },
    },
  });








export default function Community(props) {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [userinfo,setUserinfo] = useState(null);
    const [isjoin,setIsjoin] = useState(false);
    const [value, setValue] = React.useState(0);
    const [Loader, setLoader] = useState(true);
    const [posts , setPosts] = useState([])
    const [events , setEvents] = useState([])
    const [parti , setParti] = useState(0)
    const history = useHistory();
    const [Tab_item, setTab] = useState();
    const [url,setUrl]= useState();

    const id = props.match.params.comId;
    let Tab_items = null;
    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
      setValue(newValue);
      if (newValue === 0) {
        Tab_items =<>
        {posts.map((pos)=>{return(<Post pos={pos}/>)})}
        </>

      }
      else if(newValue === 1){
        Tab_items =<>
        {events.map((eve)=>{return(<Event eve={eve}/>)})}
        </>
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
          formData.append("id", props.match.params.comId);

          axios.get(`${Const.baseUrl}/community/community_info?id=${id}`).then((response) => {
            setIsjoin(response.data[0].is_joined === "true")
            setUserinfo(response.data);
            setParti(response.data[0].number_of_participants)
            if(response.data[0].image){
              setUrl(Const.baseUrl+response.data[0].image)
            }
            else{
              setUrl(Com)
            }
          });
          axios
            .get(`${Const.baseUrl}/community/community_posts?community_id=${id}`)
            .then((response) => {
              setTab(<>
                {response.data.map((pos)=>{return(<Post pos={pos}/>)})}
                </>)
              setPosts(response.data)
              });

          axios
            .get(`${Const.baseUrl}/community/community_events?community_id=${id}`)
              .then((response) => {
                setEvents(response.data)
                });

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
        if (userinfo != null) {
            setLoader(false);

          }
      }, [userinfo]);


    return(
      <>
      {!Loader ? (
        <div className="Home_main"><ThemeProvider theme={theme}>
            <div className="h_header2"
             style={{backgroundImage: `url(${url})`}}>

                    <div className="loz2">

                    <ul className="smain_loz">
                    <li className="slozac3">
                    <ul className="smain_loz">
                    <li className="slozac30" onClick={() => history.push(`/chat/${props.match.params.comId}`)}>
                    <div className="stitle"><h6>Community Chat</h6></div>
                    <div className="sbg4"></div>
                    <p className="ffont sD_label3"></p>

                    </li>
                    </ul>
                    </li>
                    <li className="slozac4" onClick={() => history.push("/home")}>
                    <div className="sslider sslozac4">

                    </div>
                    </li>
                    </ul>
                    </div>

            </div>
            <div className="h_body2">
            <div className="h_hbody2">
                <div className="profile11">
                    <Avatar
                        src={`${url}`}
                        className="img22"
                        /></div>
                <div className="bio">
                    <div>
                    <h4 style={{width: '160px', whiteSpace: 'normal', overflow: 'hidden'
                    , textOverflow: 'ellipsis'}}>{userinfo[0].title}
                    </h4>{userinfo[0].is_admin=="true"?"":Butt(isjoin,setIsjoin,id,setParti,parti)}</div>
                    <div className="participants" style={{color:"rgb(159 159 159)"}}>
                        <p >{parti} Participant</p></div>
                    <div className="desc">
                        {userinfo[0].description}</div></div>
            </div>
            <div className="tags">
              { userinfo[0].tags_info.map((chip) => {
            return(<Chip
            avatar={<Avatar>#</Avatar>}
            label={chip.name}
            clickable
            color="secondary"
            variant="outlined"
      />)})}
            </div>

            <Paper square>
                <Tabs
                    value={value}
                    centered
                    variant="fullWidth"
                    indicatorColor="secondary"
                    textColor="secondary"
                    onChange={handleChange}
                    aria-label="disabled tabs example">

                    <Tab label="Posts"/>
                    <Tab label="Events" />
                </Tabs>
            </Paper>

            <Grid sm={12} xs={12} style={{ margin: '15px auto 60px auto',width:"100%"
            ,backgroundColor:"white" }}>
                            {Tab_item}
                        </Grid>

            </div></ThemeProvider>

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
          <Button onClick={handleDialogOpen} color="primary" style={{width:"60px", height:"60px", borderRadius: "30px", position:"fixed", bottom:"20px", right:"20px", backgroundColor:"#efc700"}}>
           <AddIcon style={{color:"#000000"}}/>
          </Button>
          <CreatePE state={isDialogOpen} handleClose={handleDialogClose} comId={id}/>
          </>
    )
}
