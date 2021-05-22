import React , { useEffect, useState }  from "react";
import "./event.scss"
import Link from '@material-ui/core/Link';
import axios from "axios";
import Const from "../../static/CONST";
import { TodayOutlined, Person, GroupAdd} from "@material-ui/icons";
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
  } from "@material-ui/core";
import { PersonOutline } from "@material-ui/icons";


function Event(props){
  const [parti , setParti] = useState(props.eve.number_of_participants)
  const [count , setcount] = useState(0)
  // let liked = pos.liked

  const AddPart=(id)=>{
    axios.defaults.headers.common['Authorization'] = localStorage.getItem("token")
    const formData = new FormData();
    formData.append("event_id", id);
    if(count<1){
      axios.post(`${Const.baseUrl}/community/join_event`, formData).then((res) => {
        if (res.status === 200) {
          if (res.data.status === "success") {
            setParti(parti + 1)
          }}});
    }
    setcount(1)
}

    return(
    <Grid sm={12} xs={12} style={{width:"100%"
            ,paddingBottom:"30px",maxHeight:"700px"}}>
    	  <div className="blog-card2">
    <div className="meta">
      <div className="photo" 
      style={{backgroundImage: "url(https://bigdata-ir.com/wp-content/uploads/2020/04/Event1.jpg)"}}></div>
      <ul className="details">
    <li className="author">
    <a href="#"><Person style={{marginBottom:"-2px", fontSize:"15px" ,color:"white" }}/>
    {" " +props.eve.creator_info.username}</a></li>
    <li className="date"><TodayOutlined style={{marginBottom:"-2px",marginTop:"30px", fontSize:"15px" ,color:"white" }}/>
      {" "+ props.eve.begin_time.slice(0,10).replaceAll('-',' ')+" | "+props.eve.begin_time.slice(11,16)}</li>
        <li className="tags2"><GroupAdd style={{marginBottom:"-2px",marginTop:"30px", fontSize:"19px" ,color:"white" }}/>
        {" "+parti}
        </li>
      </ul>
    </div>
    <div className="description">
      <h1>{props.eve.title}</h1>
      <h2>The Best Are Waiting For You</h2>
      <p> {props.eve.description}</p>
      <p className="read-more" onClick={()=>AddPart(props.eve.id)}>
        <div className="lets">Let's Go</div>
      </p>
    </div>
  </div>
</Grid>
)};

export default Event;