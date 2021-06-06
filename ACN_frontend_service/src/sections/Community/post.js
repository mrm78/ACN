import React , { useEffect, useState }  from "react";
import "./post.css"
import Link from '@material-ui/core/Link';
import axios from "axios";
import Const from "../../static/CONST";
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
import CommentShow from "./CommentShow"

function Post(props){
  const [likes , setLikes] = useState(props.pos.number_of_likes)
  const [Comments , setComments] = useState(props.pos.number_of_comments)
  const [liked , setLiked] = useState(props.pos.liked)
  const [dialog, setDialog] = useState(false);
  // let liked = pos.liked


  const handleclick = async (Id) =>{
      setDialog(true)     
     
    }

  const like=(id,likeed)=>{
    axios.defaults.headers.common['Authorization'] = localStorage.getItem("token")
    const formData = new FormData();
    formData.append("post_id", id);
    if(likeed==="true"){
      axios.post(`${Const.baseUrl}/community/unlike_post`, formData);
      setLiked("false")
      setLikes(likes - 1)
    }
    else{
      axios.post(`${Const.baseUrl}/community/like_post`, formData)
      setLiked("true")
      setLikes(likes + 1)
    }
}

    return(
    <Grid sm={12} xs={12} style={{width:"100%"
            ,paddingBottom:"30px",maxHeight:"700px"}}>
    	<div className="blog-card spring-fever" style={{background:`url(${Const.baseUrl}${props.pos.image}) center no-repeat`}}>
  <div className="title-content">
  <div style={{width:'40px',height:'40px'}}>
    <Avatar
       src={`${Const.baseUrl}${props.pos.creator_info.avatar}`}
        
        /> </div>
    <h3><a href="#">{props.pos.creator_info.username}</a></h3>
  </div>
  <div className="card-info">
    {props.pos.caption} 
  </div>
  <div className="utility-info">
    <ul className="utility-list">
    <li style={{cursor:"pointer"}} onClick={()=> like(props.pos.id,liked)}>
      <span className="licon icon-like"></span><a href="#">{likes}</a></li>
      <li style={{cursor:"pointer"}} onClick={()=> handleclick(props.pos.id)}><span className="licon icon-com"></span>
      <a href="#">{Comments}</a></li>
      <li><span className="licon icon-dat"></span>{props.pos.date.slice(0,10)}</li>
    </ul>
  </div>
  <div className="gradient-overlay"></div>
  <div className="color-overlay"></div>
</div>
{<CommentShow count={Comments} setcount={setComments} id={props.pos.id} open={dialog} setOpen={setDialog}/>}
</Grid>
)};

export default Post;