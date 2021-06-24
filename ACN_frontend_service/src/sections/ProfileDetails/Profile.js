import {React , useState , useEffect} from 'react'
import {Tooltip,Grid,makeStyles,Avatar} from '@material-ui/core'
import {Wc,LocationOn,Star,DateRange} from "@material-ui/icons";
import './Profile.css';
import axios from "axios";
import Const from "../../static/CONST";
import cup from '../../static/cup.gif'
import star from '../../static/star.gif'
import Community from '../Home/Community'

const useStyle = makeStyles({
    root1: {
        padding: '0',
        flexGrow: 1,

        marginBottom: '150px'
    },
    indicator: {
        color:'rgb(206, 64, 64)',
        width: "5px"
    },
    back:{
        alignContent:'center',
        zIndex:'3000',
        color:'#ff0',
        backgroundColor: 'rgba(0, 0, 0, 0.9)'
    },
    popper:{
        top:'-35px'
    }
});

export default function Profile(props){
    const classes = useStyle();
    const [userD , setUserD]= useState({})
    const [events, setEvents] = useState()
    const [MyC,setMyC] = useState(null);
    const [Tab_item, setTab] = useState();



    useEffect(()=>{
        setUserD(props.userD);
        console.log(props.userD.user_events);


    }
        ,[props])




    const favorites = userD.user_favorites && userD.user_favorites.map((fav)=>
        <Grid item style={{width:"90%",overflow:'hidden',whiteSpace:'nowrap',textAlign:'start'}}>
            <div style={{backgroundColor:fav.color1,width:'10px', height:'10px',marginRight:"7px" , display:'inline-flex'}}></div>
                            <h5 className='ffont' style={{color:"rgb(0, 0, 0,.60)",display:"inline-flex"}}>{fav.name}</h5>
                                    </Grid>)


    return(
        <div style={{ width: '100%', height: '100%',flexGrow: 1 }}>


            <div style={{ padding: "0",flexGrow: 1, marginTop:"60px"  }}>

                    <Grid container><Grid className="H_M_head1" style={{ position: "relative", backgroundColor: "rgb(244, 244, 244)" }} sm={4} xs={12}>

                    </Grid>
                    <Grid className="H_M_head2" style={{ position: "relative", backgroundColor: "rgb(244, 244, 244)" }} sm={4} xs={12}>
                        <div className="profileVPic">
                            <Avatar className='img1'  src={`${Const.baseUrl}${userD.avatar}`} alert="" />
                        </div>
                        <div className="H_M_head1div">
                        <h2 className='ffont' style={{textTransform:'capitalize',color:"rgb(0, 0, 0,.70)",position:"relative",top:"90px"}} > {userD.name} </h2>
                        <h4 className='ffont' style={{textTransform:'capitalize',color:"rgb(0, 0, 0,.70)",position:"relative",top:"90px"}} > {`@ ${userD.username}`} </h4>
                        </div>
                    </Grid>

                        <Grid container sm={4} xs={12} className="h_grid1" justify="center" direction="column"  alignItems="flex-start" style={{paddingLeft:"15px"}}>
                                
                                    <Grid item style={{width:"100%",overflow:'hidden',whiteSpace:'nowrap',textAlign:'start'}}>
                                    <Wc fontSize="small"
                                    style={{color:"#5588ff" ,marginRight:"7px"}}/>
                                    <h5 className='ffont' style={{width:'120px',color:"rgb(0, 0, 0,.60)" ,display:"inline-flex"}}>Gender  :  {userD.pretty_gender ? userD.pretty_gender : "N/A"}</h5>
                                    </Grid>
                                    <Grid item alignItems="flex-start">
                                    <DateRange fontSize="small"
                                    style={{color:"#5588ff" ,marginRight:"7px"}}/>
                                    <h5 className='ffont' style={{color:"rgb(0, 0, 0,.60)",display:"inline-flex"}}>Age  :  {userD.age ? userD.age : 'N/A'}</h5>
                                    </Grid>
                        </Grid>
                        <Grid container sm={12} xs={12}>
                        <Tooltip title={userD.bio} arrow classes={{tooltip:classes.popper}}>
                        <div className="home_header21 ffont"><span>{userD.bio}</span></div></Tooltip>
                        </Grid>


    <Grid sm={12} xs={12} className="h_grid2">
    <div ><Community MyC={props.MyC}/></div>
    </Grid>

                    </Grid></div>
                    </div>
    )
}
