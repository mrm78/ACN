import React,{useEffect,useState} from "react"
import {Drawer, makeStyles,List,ListItem,ListItemAvatar,ListItemText,Divider,Avatar,
        IconButton,ListItemSecondaryAction,} from "@material-ui/core"
import axios from "axios"
import Const from "../../static/CONST.js"
import {Delete} from "@material-ui/icons"

const useStyle = makeStyles({
    root:{
        width:"24vw",
        minWidth:"240px"
    }
})




export default function Paricipant(props){
    const classes = useStyle();
    const [members,setMembers]=useState([])

    const handleDelete = (user)=>{
        const formData = new FormData();
        formData.append("community_id", props.ID);
        formData.append("username", user);
        axios.post(`${Const.baseUrl}/community/remove_community_participant`,formData).then((response) => {
            if(response.data.status=="success"){
                setMembers((All)=>All.filter((member)=> member.username !== user ))
            }
        });
    }


    useEffect(()=>{
        axios.defaults.headers.common['Authorization'] = localStorage.getItem("token")
        axios.get(`${Const.baseUrl}/community/community_participants?community_id=${props.ID}`)
          .then((response) => {
            setMembers(response.data)
            });
    },[])



    return(
        <>
        <Drawer classes={{paper:classes.root}} open={props.open} onClose={()=>props.setOpen(false)} anchor="right" >
            <List>
                {members.map((item)=>(
                    <>
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar alt="" src={`${Const.baseUrl}${item.avatar}`} />
                        </ListItemAvatar>
                        <ListItemText primary={item.username} /> 
                        {props.isAdmin & !item.is_admin?<ListItemSecondaryAction>
                        <IconButton onClick={()=>handleDelete(item.username)} edge="end" aria-label="delete">
                            <Delete/>
                        </IconButton>
                        </ListItemSecondaryAction>:""}
                    </ListItem>
                    <Divider/>
                    </>
                ))}
            </List>
            
        </Drawer>
        </>
    )
}