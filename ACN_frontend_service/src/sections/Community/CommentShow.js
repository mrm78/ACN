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
    comments: {
      width:"98%",
      margin:"0 auto",
      padding: "10px",
      borderLeft: "6px solid #fdcc3b",
      backgroundColor: "white",
      marginTop: theme.spacing(1.5),
    },
    commentContainer: {
      width: "50%",
      whiteSpace: "pre-line",
    },
  }));


export default function CommentShow(props){
    const nameForm = useRef(null)
    const classes = useStyles()
    const [show,setShow]=useState(false)
    const [comments,setComments]=useState([])

    useEffect(()=>{
      axios.defaults.headers.common['Authorization'] = localStorage.getItem("token")
      axios
      .get(`${Const.baseUrl}/community/post_comments?post_id=${props.id}`)
        .then((response) => {
          setComments(response.data)
          });
    },[])

    const handleSend=()=>{
        axios.defaults.headers.common['Authorization'] = localStorage.getItem("token")
        const formData = new FormData();
        formData.append("post_id", props.id);
        formData.append("text", nameForm.current["comment"].value);
        axios.post(`${Const.baseUrl}/community/post_comment`, formData).then((res)=>{
          if(res.data.status=200){
            props.setcount(props.count + 1)
            axios.get(`${Const.baseUrl}/community/post_comments?post_id=${props.id}`)
            .then((response) => {
              setComments(response.data)
              });
          }
        })
    }
    return(
        <>
        <Dialog maxWidth={"md"} onClose={()=>props.setOpen(false)} aria-labelledby="simple-dialog-title" open={props.open}>
        <div style={{fontFamily:"'Roboto', sans-serif"}}>
            <div style={{padding:"20px 20px",width:"70vw",margin:"0 auto",backgroundColor:"white",
            borderRadius:"5px"}}>
              <div style={{position:"sticky",top:"20px",backgroundColor:"white",paddingBottom:"10px"}} >
                <h4 style={{fontWeight:"bold"}}>Comment</h4>
                <form ref={nameForm} noValidate autoComplete="off">
                <TextField multiline name="comment" label="Your Comment"  fullWidth secondary/></form>
                <div style={{width:"100%"}}>
                <div style={{display:"flex",justifyContent:"flex-end",width:"50%",float:"right"}}>
                <Button onClick={()=>handleSend()} className={classes.root} variant="outlined" color="secondary">Send</Button></div>
                <div style={{display:"flex",justifyContent:"flex-start",width:"50%"}}>
                <Button onClick={()=>setShow(!show)} className={classes.root} variant="outlined" color="secondary">
                {show?"Hidden":"Show"}</Button></div></div></div>
                <Grid container style={{marginTop:"15px",transition:"all .2s ease",maxHeight:show?"50vh":"0",
                overflow:"auto",paddingBottom:show?"10px":"0"}}>
                  {comments.map((cmt)=>
                    (<Paper className={classes.comments}>
                      <span style={{color:"#fdcc3bc4"}}>{cmt.creator_info.username}</span>
                      <span style={{color:"#fdcc3bc4",float:"right"}}>
                        {cmt.date.slice(0,10).replace(/-/g,'/')+" | "+cmt.date.slice(11,16)}</span>
                      <hr/>
                      <span style={{whiteSpace:"pre"}}>
                      {cmt.text}
                      </span>
                    </Paper>)
                  
                  )}
                </Grid>
            </div>
        </div></Dialog>
        </>
    )
}