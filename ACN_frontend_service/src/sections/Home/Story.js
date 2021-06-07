import { StoreMallDirectory } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./story.css"
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
  import pro from '../../static/pro2.png';
  import "./HomePage.css";
  import StoryShow from "./StoryShow.js";
  import Const from "../../static/CONST";

// import Swiper core and required modules
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper';

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/swiper.scss';
import 'swiper/components/navigation/navigation.scss';
import 'swiper/components/pagination/pagination.scss';
import 'swiper/components/scrollbar/scrollbar.scss';
import { set } from "date-fns";

// install Swiper modules
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

const st = ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgrWaPNUFxfBZ8WEm86JkMgebpy3an-5NKrQ&usqp=CAU"
,"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvsiNwM9NDE_zmCcdDK9UVC9jrmL1crYYkG1IRvJfnbqa0hkPiux80mWCXnTxj9SXwT3s&usqp=CAU"
,"https://cdn5.vectorstock.com/i/1000x1000/39/24/man-wearing-face-mask-environmental-industrial-vector-26743924.jpg"
,"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsnM85Q_FgR2Q_2Wi7WdLRbyhN325OHLN_6TDn4UA2JeLTLXgzOS_1By24SI_EoyKfQ38&usqp=CAU"
,"https://thumbs.dreamstime.com/z/vector-flat-illustration-people-wearing-surgical-mask-black-woman-topic-coronavirus-flu-cold-175414426.jpg"
,"https://cdn3.vectorstock.com/i/1000x1000/46/47/man-wearing-face-mask-environmental-industrial-vector-26914647.jpg"
,"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuMp5ZbNcL_HrjKEmdAKHxnRgBm4ya2Rbgh7TTXjYDfJxxU82DRYZleg8TmOeiBH7K-F0&usqp=CAUttps://st3.depositphotos.com/4383881/36699/v/450/depositphotos_366990030-stock-illustration-family-wearing-mask-vector-illustration.jpg"
,"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0J-bTuL2gmO21LQ99F7iPQS3diSxrodZ5cA&usqp=CAU"
,"https://www.hopkinsmedicine.org/-/media/images/health/1_-conditions/coronavirus/masks.ashx?h=300&la=en&mh=300&mw=500&w=436&hash=6B88FABF22C0198042581AEABCA3433AF24FA7F3"
,"https://img.huffingtonpost.com/asset/5ecd54352500008320eb222f.jpeg?cache=Sp6Us9TmA2&ops=scalefit_720_noupscale"
,""
];
export default function Story (props){
  
  
  const [dialog, setDialog] = useState(null);
  const [allstory, setAllstory] = useState(props.story);


  const handleclick = async (Id) =>{
            axios.defaults.headers.common['Authorization'] = localStorage.getItem("token");
            await axios.get(`${Const.baseUrl}/community/story_info?event_id=${Id}`).then((res) => {
              setDialog(<StoryShow id={Id} func={setDialog} eve={res.data}/>)     
              })
            axios.get(`${Const.baseUrl}/community/stories`).then((response) => {
              setAllstory(response.data);
            })
    
  }



  
  
  return( <>
 <Swiper
 style={{height:'100%'}}
      breakpoints={{
        0: {
          slidesPerView: 4,
          spaceBetween: 10,
        },
        270: {
          slidesPerView: 4,
          spaceBetween: 20,
        },
        501: {
          slidesPerView: 3,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
        888: {
          slidesPerView: 6,
          spaceBetween: 50,
        },}}
      
      pagination={{ clickable: true }}
      
      onSwiper={(swiper) => console.log(swiper)}
      onSlideChange={() => console.log('slide change')}
    >{allstory.map((s)=>{
        return(
      <SwiperSlide>
          
          <div className={s.is_seen=="true"?"profile3":"profile2"} onClick={()=>handleclick(s.id)}>
                        <Avatar
                        src={`${Const.baseUrl}${s.community_info.image}`}
                        className="img3"
                        />
                    </div></SwiperSlide>)})}
      
    </Swiper>
    {dialog}
</>)
};
