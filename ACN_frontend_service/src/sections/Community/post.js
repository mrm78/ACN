import React from "react";
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


const post =(posts)=> {


    return(
    <>
    {posts.map((pos)=>{

    return(
    <Grid sm={12} xs={12} style={{width:"100%"
            ,paddingBottom:"30px",maxHeight:"700px"}}>
    	<div className="blog-card spring-fever" style={{background:`url(${Const.baseUrl}${pos.image}) center no-repeat`}}>
  <div className="title-content">
  <div style={{width:'40px',height:'40px'}}>
    <Avatar
       src={`${Const.baseUrl}${pos.creator_info.avatar}`}
        
        /> </div>
    <h3><a href="#">{pos.creator_info.username}</a></h3>
  </div>
  <div className="card-info">
    {pos.caption} 
  </div>
  <div className="utility-info">
    <ul className="utility-list">
      <li><span className="licon icon-like"></span><a href="#">2</a></li>
      <li><span className="licon icon-com"></span><a href="#">12</a></li>
      <li><span className="licon icon-dat"></span>{pos.date.slice(0,10)}</li>
    </ul>
  </div>
  <div className="gradient-overlay"></div>
  <div className="color-overlay"></div>
</div>
</Grid>)})}
    </>
)};

export default post;