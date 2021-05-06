import React, { Useh, useState } from "react";
import { useHistory } from "react-router-dom";
import "./loz.css"

const handleLogout = () => {
  localStorage.removeItem("token");
  window.location.href='/'
};
const loz = ( 
<div className="loz2">
<ul className="smain_loz">
<li className="slozac1">
<ul className="smain_loz" >
<li className="slozac11">
<div className="stitle"><h5>Profile Edits</h5></div>
<div className="sbg1"></div>
<p className="ffont sD_label1"></p>

</li>
</ul>
</li>
<li className="slozac2">
<ul className="smain_loz">
<li
className="slozac21"

>
<div className="stitle"><h6>Up Comming Events</h6></div>
<div className="sbg2"></div>
<p className= "ffont sD_label21">

</p>

</li>
</ul>
</li>
<li className="slozac3">
<ul className="smain_loz">
<li className="slozac31">
<div className="stitle"><h6>Create Commiunity</h6></div>
<div className="sbg3"></div>
<p className="ffont sD_label3"></p>

</li>
</ul>
</li>
<li className="slozac4" onClick={() => handleLogout()}>
<div className="sslider">
<div class="outer">
  <div class="inner">
    <label class="hh">Exit</label>
  </div>
</div>
</div>
</li>
</ul>
</div>);

export default loz;