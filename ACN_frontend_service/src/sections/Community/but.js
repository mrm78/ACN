import React from "react";
import styles from "./but.module.css"
import Link from '@material-ui/core/Link';
import axios from "axios";
import Const from "../../static/CONST";


const Butt = (isjoin,setIsjoin,id) =>{ 
    
    const handleclick = (ur)=>{
        axios.defaults.headers.common['Authorization'] = localStorage.getItem("token")
        const formData = new FormData();
        formData.append("community_id", id);
        axios.post(`${Const.baseUrl}${ur}`, formData);
        setIsjoin(!isjoin)}
    console.log(isjoin)
    return <div className={styles.aa} onClick={isjoin?()=>handleclick("/community/leave_community"):()=>handleclick("/community/join_community")} >
        {isjoin?"leave":"join"}</div>;
    
}
export default Butt;