import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  makeStyles,
  useTheme,
  Button,
  TextField,
  Grid,
  IconButton,
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  Avatar,
  Paper,
  Dialog,
  Badge,
} from "@material-ui/core";
import { Attachment, Close } from "@material-ui/icons";
import Const from "../../static/CONST";
import Message from "./Message";

const useStyle = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
}));

export default function ChatBox(props) {
  const ws = useRef(null);
  const classes = useStyle();
  const [message, setMessage] = useState([]);
  const [value, setValue] = useState();
  const [edit,setEdit]=useState(false)
  const [editId,setEditId]=useState()
  const [reply,setReply]=useState("")
  const [file,setFile] = useState("");
  const scrollableGrid = useRef();

  useEffect(() => {
    ws.current = new WebSocket(
      "ws://" +
        Const.chatBaseUrl +
        "/ws/chat/" +
        `?${localStorage.getItem("token").toString()};${props.comId}` ///put your session_id and event_id in this format => '/?<session_id>;<event_id>'
    );
    ws.current.onopen = () => console.log("ws opened");
    ws.current.onclose = () => console.log("ws closed");
  }, []);

  useEffect(() => {
    ws.current.onmessage = (e) => {
      const data = JSON.parse(e.data);
      console.log(data);
      if (data.type == "pre_msgs") {
        setMessage(message.concat(data.pre_msgs));
      }
      if (data.type == "chat_message") {
        setMessage([...message, data.chat_message]);
      }
      if (data.type == "delete_message") {
        setMessage((chats) =>
          chats.filter((chat) => chat.id !== data.message_id)
        );
      }
      if (data.type == "edit_message") {
        setMessage((chats) =>
          chats.map((chat) => {
            if(chat.id == data.message_id){
              chat.text= data.new_text

            }return chat})
        );
      }
      if(scrollableGrid.current){scrollableGrid.current.scroll(0, scrollableGrid.current.scrollHeight)};
    };
  });

  const handleClick = (v) => {
    console.log("send");
    const ms = JSON.stringify({
      type: "chat_message",
      text: v,
      image: file,
      reply_to: reply,
    });
    ws.current.send(ms);
    setValue("")
    setReply('')
    setFile("")
  };

  const handleClickEdit = (id,v) => {
    const ms = JSON.stringify({
      type: "edit_message",
      message_id: id,
      new_text: v,

    });
    setEdit(false)
    setValue("")
    ws.current.send(ms);

  };

  const handleDelete = (id) => {
    console.log("Delete");
    const ms = JSON.stringify({
      type: "delete_message",
      message_id: id,
      image: "",
      reply_to: '',
    });
    ws.current.send(ms);

  };

  const handleEdit = (id,text) => {
    setValue(text)
    setEdit(true)
    setEditId(id)
  };

  const handleReply = (id) => {
    setReply(id)
  };

  const handleChangee = (e) =>{
    const fil = e.target.files[0];
    const fr = new FileReader();
    if (fil) {
      fr.readAsDataURL(fil);
      fr.onloadend = (e) => {
    setFile(fr.result)}}
  }
  // var messagesWindow = document.getElementById("chatPart");
  // if (messagesWindow) {
  //   messagesWindow.scrollTop = messagesWindow.scrollHeight;
  // }
  return (
    <Grid
      item
      container
      lg={11}
      md={11}
      sm={10}
      xs={12}
      justify="space-between"
      ref={scrollableGrid}
      alignItems="flex-end"
      className={"chatMessagesContainer"}
    >
      {message.map((message) => {
        return (
          <Message
            reply_to={message.reply_to}
            isSelf={message.is_mine}
            message={message.text}
            username={message.username}
            id={message.id}
            avatar={message.avatar}
            image={message.image}
            delete={handleDelete}
            edit={handleEdit}
            reply={handleReply}
          />
        );
      })}
      <Grid
        id="chatPart"
        item
        container
        lg={12}
        xs={12}
        justify="center"
        className="textFieldContainer"
      >
        {reply?(<><div style={{position:'absolute',bottom:file?'calc(100% + 110px)':"100%",padding:'20px',paddingTop:'30px',
        width:"100%",height:'110px',overflow:"hidden",color:'rgb(0,0,0,.5)',
        textOverflow:'ellipsis', backgroundColor:'rgb(242, 242, 0)'}}>
          {document.getElementById(reply)?document.getElementById(reply).innerText:''}
        </div><IconButton color="primary" style={{position:'absolute',bottom:file?'calc(100% + 70px + 110px)':'calc(100% + 70px)'
        ,right:0}} onClick={()=>setReply('')}>
            <Close/>
            </IconButton>
        </>):('')}
        {file?
        (<><div style={{position:'absolute',bottom:"100%",padding:'20px',paddingTop:'30px',
        width:"100%",height:'110px',overflow:"hidden", backgroundColor:'rgb(242, 242, 242)'}}>
          <img style={{width:"100%"}} src={file}></img></div>
          <IconButton color="primary" style={{position:'absolute',bottom:'calc(100% + 70px)'
        ,right:0}} onClick={()=>setFile('')}>
            <Close/>
            </IconButton></>):('')}

        <Grid item container lg={11} sm={11} justify="space-between">
          <Grid item container lg={1} xs={1}>
          <input accept="image/*" id="icon-button-file" type="file" style={{display: 'none'}} onChange={handleChangee} />
          <label htmlFor="icon-button-file">
          <IconButton  aria-label="upload picture" component="span" className="attachButton">
            <Attachment style={{color: '#ffd700'}} />
          </IconButton></label>
          </Grid>
          <Grid item container lg={9} xs={9}>
            <TextField
              value={value}
              variant="outlined"
              className="textField"
              placeholder="Write somthing"
              multiline
              onChange={(e) => setValue(e.target.value)}
              rows={1}
              rowsMax={4}
              style={{ whiteSpace: "pre-line" }}
            />
          </Grid>
          <Grid
            item
            container
            lg={2}
            xs={2}
            justify="center"
            alignItems="center"
          >

            <Button
              variant="contained"
              color="primary"
              className="sendButton"
              style={{backgroundColor: '#ffd700', color: '#000000'}}
              onClick={() => edit?handleClickEdit(editId,value):handleClick(value)}
            >
              {edit?"Edit":"Send"}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
