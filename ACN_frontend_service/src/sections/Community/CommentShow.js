import React, { useEffect, useState,useRef } from "react";
import {
    ThemeProvider,
    CircularProgress,
    createMuiTheme,
    Backdrop,
    Container,
    Grid,
    makeStyles,
    Button,
    TextField,
    Dialog,
    Paper,
    Avatar,
  } from "@material-ui/core";
  import axios from "axios";
import Const from "../../static/CONST";
import { useHistory } from "react-router-dom";
import Event from "./event.js"

const useStyles = makeStyles((theme) => ({
    root: {  
      marginTop:"10px",
    },
  }));


export default function CommentShow(props){
    const nameForm = useRef(null)
    const classes = useStyles()
    const w = window.screen.width.toString()+"px";
    const h = window.screen.height.toString()+"px";
    const handleSend=()=>{
        axios.defaults.headers.common['Authorization'] = localStorage.getItem("token")
        const formData = new FormData();
        formData.append("post_id", props.id);
        formData.append("text", nameForm.current["comment"].value);
        axios.post(`${Const.baseUrl}/community/post_comment`, formData)
        props.setcount(props.count + 1)
    }
    return(
        <>
        <Dialog maxWidth={"md"} onClose={()=>props.setOpen(false)} aria-labelledby="simple-dialog-title" open={props.open}>
        <div style={{fontFamily:"'Roboto', sans-serif"}}>
            <div style={{padding:"20px 20px",width:"70vw",margin:"0 auto",
            backgroundColor:"white",borderRadius:"5px"}}>
                <h4 style={{fontWeight:"bold"}}>Comment</h4>
                <form ref={nameForm} noValidate autoComplete="off">
                <TextField name="comment" label="Your Comment"  fullWidth secondary/></form>
                <div style={{width:"100%"}}>
                <div style={{display:"flex",justifyContent:"flex-end",width:"50%",float:"right"}}>
                <Button onClick={()=>handleSend()} className={classes.root} variant="outlined" color="secondary">Send</Button></div>
                <div style={{display:"flex",justifyContent:"flex-start",width:"50%"}}>
                <Button className={classes.root} variant="outlined" color="secondary">Show</Button></div></div>
            </div>
        </div></Dialog>
        </>
    )
}