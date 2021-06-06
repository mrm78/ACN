import {React , useState , useEffect} from 'react'
import {Tooltip,Grid,makeStyles} from '@material-ui/core'
import {Wc,LocationOn,Star,DateRange} from "@material-ui/icons";
import './Profile.css'
import Const from "../../static/CONST";
import cup from '../../static/cup.gif'
import star from '../../static/star.gif'
//import MyEvents from '../HomePage/Components/MyEvents/MyEvents.js'

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

    useEffect(()=>{
        setUserD(props.userD)
        console.log(props.userD.user_events)

    }
        ,[props])


    const favorites = userD.user_favorites && userD.user_favorites.map((fav)=>
        <Grid item style={{width:"90%",overflow:'hidden',whiteSpace:'nowrap',textAlign:'start'}}>
            <div style={{backgroundColor:fav.color1,width:'10px', height:'10px',marginRight:"7px" , display:'inline-flex'}}></div>
                            <h5 className='ffont' style={{color:"rgb(0, 0, 0,.60)",display:"inline-flex"}}>{fav.name}</h5>
                                    </Grid>)


    return(
        <div style={{ width: '100%', height: '100%',flexGrow: 1 }}>
            <Tooltip title={userD.bio} arrow classes={{tooltip:classes.popper}}>
            <div className="home_header21 ffont"><span>{userD.bio}</span></div></Tooltip>
            <div style={{ padding: "0",flexGrow: 1  }}>

                    <Grid container><Grid className="H_M_head1" style={{ position: "relative", backgroundColor: "rgb(244, 244, 244)" }} sm={4} xs={12}>
                        <div className="profile1">
                            <img className='img1' src={`${Const.baseUrl}${userD.avatar}`} alert="" />
                        </div>
    <h2 className='ffont' style={{textTransform:'capitalize',color:"rgb(0, 0, 0,.70)",position:"relative",top:"90px"}} > {userD.name} </h2>

                    </Grid>
                        <Grid sm={4} xs={12} className="h_grid1"><div style={{ backgroundImage: `url(${cup})` }} className='hback'></div>
                        <Star fontSize="large" style={{color:"rgb(250, 210, 80)"}}/><h1 className='ffont' style={{color:"rgb(0, 0, 0,.60)" , display:"inline-flex"}}>{userD.rate}</h1></Grid>
                        <Grid container sm={4} xs={12} className="h_grid1" justify="center" direction="column"  alignItems="flex-start" style={{paddingLeft:"15px"}}>
                                <Grid item style={{width:"90%",overflow:'hidden',whiteSpace:'nowrap',textAlign:'start'}}>
                                  <LocationOn fontSize="small"
                                    style={{color:"rgb(206, 64, 64)" ,marginRight:"7px"}} />
                                    <h5 className='ffont' style={{color:"rgb(0, 0, 0,.60)",display:"inline-flex"}}>City  :  {userD.city}</h5>
                                    </Grid>
                                    <Grid item style={{width:"100%",overflow:'hidden',whiteSpace:'nowrap',textAlign:'start'}}>
                                    <Wc fontSize="small"
                                    style={{color:"rgb(206, 64, 64)" ,marginRight:"7px"}}/>
                                    <h5 className='ffont' style={{width:'120px',color:"rgb(0, 0, 0,.60)" ,display:"inline-flex"}}>Gender  :  {userD.gender}</h5>
                                    </Grid>
                                    <Grid item alignItems="flex-start">
                                    <DateRange fontSize="small"
                                    style={{color:"rgb(206, 64, 64)" ,marginRight:"7px"}}/>
                                    <h5 className='ffont' style={{color:"rgb(0, 0, 0,.60)",display:"inline-flex"}}>Age  :  {userD.age}</h5>
                                    </Grid>
                        </Grid>

                        <Grid sm={4} xs={12} className="h_grid1" justify="center" direction="column"  alignItems="flex-start" >
                            <div style={{ backgroundImage: `url(${star})` }} className='hback'></div>
                            <Grid style={{paddingLeft:"15px",marginTop:'20px'}}>
                            {favorites}
                        </Grid>
                        </Grid>
    <Grid sm={8} xs={12} className="h_grid2">{events}</Grid>
                    </Grid></div>
                    </div>
    )
}
