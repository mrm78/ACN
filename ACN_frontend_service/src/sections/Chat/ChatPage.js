import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  makeStyles,
  useTheme,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  Avatar,
  Paper,
  Dialog,
  Badge,
  Zoom,
  Tooltip,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import Const from "../../static/CONST";
import "../../static/style/Chat.css";
import ChatBox from "./ChatBox";
import Profile from "../ProfileDetails/Profile"
import "./Req.css"

// import Swiper core and required components
import SwiperCore, {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Mousewheel,
} from "swiper";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/swiper.scss";
import "swiper/components/navigation/navigation.scss";
import "swiper/components/pagination/pagination.scss";
import "swiper/components/scrollbar/scrollbar.scss";



// install Swiper components
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y, Mousewheel]);

const useStyle = makeStyles((theme) => ({
  tooltip: {
    backgroundColor: "#ffd700",
    color: "#000000",
  },
  tooltipArrow: {
    color: "#ffd700",
  },
  slide: {
    height: "100%",
  },
  Dialog:{
    maxWidth:'900px',
    width:'90%',
    backgroundColor:'transparent'
  }
}));

export default function ChatPage(props) {
  const classes = useStyle();
  const [participants, setParticipant] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [DiOpen,setDiOpen] = useState(false)
  const [userdata , setUserdata] = useState({})
  const scrollableGrid = useRef();

  async function getInfo() {

    const formData = new FormData();
    formData.append("community_id", props.match.params.comId);
    console.log(formData);
    console.log(props.match.params.comId);
    await axios
      .get(`${Const.baseUrl}/community/community_participants`, {params:{community_id:props.match.params.comId}},{
        headers : {Authorization:localStorage.getItem('token')}
      })
      .then((res) => {

        console.log(res.data);
        let tempParticipants = res.data;

        setParticipant(tempParticipants);
        setIsLoaded(true);
      });
  }
  useEffect(() => {
    // scrollableGrid.current.scroll(0, scrollableGrid.current.scrollHeight);
    getInfo();
  }, []);

  const handleProfile=(user)=>{
    const formData = new FormData();
    formData.append("username",user)
    axios
    .get(`${Const.baseUrl}/account/user_info`, {params:{username: user}}).then((res) => {
      setUserdata(res.data);
    console.log(res.data);
    });

    setDiOpen(true)
  }
  return (
    <Grid
      container
      justify="space-between"
      alignItems="center"
      className="root"
    >
      <Grid
        item
        container
        lg={1}
        md={1}
        sm={2}
        xs={12}
        className="chatparticipants"
        justify="center"
        alignItems="flex-start"
      >
        <Swiper
          className={classes.slide}
          direction={"vertical"}
          mousewheel={true}
          breakpoints={{
            200: {
              slidesPerView: 2,
              spaceBetween: 20,
              direction: "horizontal",
            },
            270: {
              slidesPerView: 4,
              spaceBetween: 20,
              direction: "horizontal",
            },
            390: {
              slidesPerView: 5,
              spaceBetween: 20,
              direction: "horizontal",
            },
            470: {
              slidesPerView: 5,
              spaceBetween: 20,
              direction: "horizontal",
            },
            600: {
              slidesPerView: 4,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 4,
              spaceBetween: 30,
            },
            1024: {
              slidesPerView: 5,
              spaceBetween: 40,
            },
          }}
        >
          {participants.map((person) => {
            return (
              <SwiperSlide>
                <Grid
                  item
                  container
                  justify="center"
                  alignItems="center"
                  lg={12}
                  xs={12}
                >
                  {/* <Grid item lg={12} xs={12} className="avatarContainer"> */}
                  <Tooltip
                    title={person.username}
                    arrow
                    placement="right"
                    TransitionComponent={Zoom}
                    classes={{
                      tooltip: classes.tooltip,
                      arrow: classes.tooltipArrow,
                    }}
                  >
                    <Avatar onClick={()=>handleProfile(person.username)}
                      alt={person.name}
                      src={`${Const.baseUrl}${person.avatar}`}
                      className="avatar"
                    />
                  </Tooltip>
                  {/* </Grid> */}
                </Grid>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </Grid>
      <ChatBox
        participants={participants}
        comId={props.match.params.comId}
      />
      <Dialog classes={{paper:classes.Dialog}} aria-labelledby="simple-dialog-title"
       open={DiOpen} onClose={()=>setDiOpen(false)}>{<Profile userD={userdata} />}</Dialog>

    </Grid>
  );
}
