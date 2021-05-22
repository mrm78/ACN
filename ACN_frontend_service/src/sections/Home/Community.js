import React , {useState,useEffect} from 'react';
import {createMuiTheme,ThemeProvider,Button,GridListTileBar,makeStyles,createStyles,GridListTile,GridList, Grid} from '@material-ui/core';
import "./community.css"
import { useHistory } from "react-router-dom";
import {Add,ArrowForwardIos,Info, LinearScale} from '@material-ui/icons';
import Com from "../../static/community.jpg"
import Const from "../../static/CONST";

const theme = createMuiTheme({palette:{
    secondary:{main:"rgb(206, 64, 64)"}
}})
const useStyle = makeStyles((theme: Theme)=>createStyles({
    root1 : {
        alignItems:'center',
    justifyContent:'center'
    },
    
    btroot:{
        transition:"all linear .3s",
        zIndex:1000,
        borderRadius:"30px",
        position:"fixed",
        right:"20%",
        textTransform: "none"
    },
    root2 :{
        fontWeight:"600",
        color:"rgb(0, 0, 0,.32)",
        alignItems:'center',
        justifyContent:'center',
        textAlign:"center",
    },
    gridList: {
        padding:"0",
        width:"100%",
        maxHeight: "800px",
      },
    paper:{
        paddingTop:"50px",
        alignItems:'center',
        justifyContent:'center',
        height:'120px',
        textAlign:'center',
        cursor:"pointer",
        
    },
    icon: {
        color: 'rgba(255, 255, 255, 0.54)',
      },
    chip: {
        margin: "4px",
      },
}));

export default function Community(props){
    const history = useHistory()
    const classes = useStyle()
    const [userD , setUserD]= useState([])


    useEffect(()=>{
        setUserD(props.MyC)
    }
        ,[props])

    const Event_c = 
        
    <GridList spacing={10} cols={3} style={{maxHeight:"500px",backgroundColor:"white",padding:"20px",margin:"10px 0 0 0"}} cellHeight={180} className={classes.gridList}>

    {props.MyC && props.MyC.map((tile) => {
        
        const TTData= <GridListTile onClick={()=>history.push(`/community/${tile.id}`)} style={{cursor:"pointer"}} key={tile.id} className="Eimg">
        
        <img style={{transition:'all .6s ease'}}  src={tile.image?Const.baseUrl+tile.image:`${Com}`} alt={tile.title}  />
         <GridListTileBar
            title={tile.title}
            subtitle={<span> |  {tile.description?tile.description:''}  | </span>}
            //   actionIcon={
            //     <IconButton aria-label={`info about ${tile.title}`} className={classes.icon}>
            //       <Info />
            //     </IconButton>
            //   }
            />
            </GridListTile>;
            return TTData;
    } 
    )}
  </GridList>
    return(
        <><Grid container>
            {Event_c}
        </Grid></>
    )
}