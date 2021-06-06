import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  makeStyles,
  useTheme,
  Button,
  IconButton,
  TextField,
  Grid,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  Avatar,
  Paper,
  Dialog,
  Badge,
  rgbToHex,
} from "@material-ui/core";
import { Check, MoreVert } from "@material-ui/icons";
import Const from "../../static/CONST";
import "../../static/style/Chat.css";

const useStyle = makeStyles((theme) => ({}));

export default function Message(props) {
  const classes = useStyle();
  const [repT,setRepT] = React.useState('')
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleDelete = () => {
    props.delete(props.id);
    setAnchorEl(null);
  };
  const handleReply = () => {
    props.reply(props.id);
    setAnchorEl(null);
  };
  const handleEdit = () => {
    props.edit(props.id,props.message);
    setAnchorEl(null);
  };

  useEffect(()=>{
    setRepT(document.getElementById(props.reply_to)?document.getElementById(props.reply_to).innerText:'')
  },[document.getElementById(props.reply_to)])

  return (
    <Grid
      item
      container
      lg={12}
      xs={12}
      justify={props.isSelf ? "flex-end" : "flex-start"}
      alignItems="flex-end"
    >
      {!props.isSelf && (
        <Avatar
          alt={`${props.username}`}
          src={`${Const.baseUrl}${props.avatar}`}
          className="chatAvatar"
        />
      )}
      <Grid
        item
        container
        lg={6}
        md={6}
        sm={7}
        xs={9}
        justify={props.isSelf ? "flex-end" : "flex-start"}
        alignItems="flex-start"
      >
        <Paper
        style={{maxWidth:'100%',whiteSpace:'normal',
      paddingTop:document.getElementById(props.reply_to)?35:10}}
          elevation={0}
          className={props.isSelf ? "selfMessagePaper" : "messagePaper"}
        >
          {props.image?(<div style={{maxWidth:'100%'}}><img style={{width:'100%'}} src={props.image}></img></div>):("")}
          <Grid container justify="flex-start" alignItems="flex-start">
            <Grid
              item
              container
              lg={12}
              xs={12}
              justify="space-between"
              alignItems="center"
            >
              {!props.isSelf ? (<>
                <Grid item className="username">
                  {props.username}
                </Grid>
                <Grid item>
                  <IconButton onClick={handleClick} size="small">
                <MoreVert fontSize="inherit" />
              </IconButton>
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleReply}>Reply</MenuItem>
              </Menu></Grid>
                </>
              ) : (
                ""
              )}
              {props.isSelf ? (
                <>
                  <Grid item>
                    <IconButton onClick={handleClick} size="small">
                      <MoreVert fontSize="inherit" />
                    </IconButton>
                    <Menu
                      id="simple-menu"
                      anchorEl={anchorEl}
                      keepMounted
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                    >
                      <MenuItem onClick={handleEdit}>Edit</MenuItem>
                      <MenuItem onClick={handleDelete}>Delete</MenuItem>
                      <MenuItem onClick={handleReply}>Reply</MenuItem>
                    </Menu>
                  </Grid>
                  <Grid item className="username">
                    {props.username}
                  </Grid>
                </>
              ) : (
                ""
              )}
            </Grid>
            {document.getElementById(props.reply_to)?(
            <a href={`#${props.reply_to}`}><div style={{width:'100%',backgroundColor:'#ffe0e0',padding:'7px', color:'rgb(0, 0, 0 , .5)',
            whiteSpace:'nowrap',textOverflow:'ellipsis', overflow:'hidden',top:0,left:0
            ,borderRadius: '20px 20px 0px 0px', position:'absolute'}}>
            {repT}
              </div></a>):('')}
            <Grid item lg={12} xs={12} id={props.id}>
              {props.message}
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      {props.isSelf && (
        <Avatar
          alt={`${props.username}`}
          src={`${Const.baseUrl}${props.avatar}`}
          className="chatAvatar"
        />
      )}
    </Grid>
  );
}
