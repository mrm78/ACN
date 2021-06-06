import React, { useEffect, useState } from "react";
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
import { useHistory } from "react-router-dom";
import Event from "../Community/event.js"



export default function StoryShow(props){
    const [stinfo,setStinfo] = useState({});
    const [isDialogOpen, setDialogOpen] = useState(true);
    const w = window.screen.width.toString()+"px";
    const h = window.screen.height.toString()+"px";
    console.log(h);

    return(
        <>
        <div style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
        <div className="baackdrop" onClick={()=>props.func(<></>)} style={{width:"100vw",height:"100vh",
        backgroundColor:"rgba(0, 0, 0, 0.68)", position:"fixed",top:"0",left:"0",zIndex:"1800"}}>
        <div style={{zIndex:"1818",marginTop:"35vh"}}><Event eve={props.eve} /></div>
        </div></div>
        </>
    )
}
