import React from 'react';

export default function NavBar(){

return(<div style={{boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.1)',textAlign: 'left',height: '65px',backgroundColor: 'white'}}>
            <nav className="navbar navbar-light sticky-top flex-md-nowrap">
                 <a className="navbar-brand" href="#">
                      <img src="/images/pblogo/pblogo@3x.jpg" alt="" style={{width: "40px",height: "49px"}}/>
                      <span className="heading" >PUNJAB STATE</span>
                 </a>
                 <ul className="navbar-nav px-3 list-inline">
                     <li><span className="px-3" style={{fontSize: '14px'}}>Help</span><img src="/images/help/help@2x.png" style={{  width: '18px',height: '18px'}}/></li>
                     <li>
                        <span className="badge badge-light">-A</span>
                        <span className="badge badge-primary">A</span>
                        <span className="badge badge-light">+A</span>
                     </li>
                     <li className="nav-item dropdown">
                           <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">English</a>
                         </li>
                         <li>  <img className="rounded-circle" src="/images/1.jpg" style={{width: '32px',height: '36px'}}/></li>
                     <li className="nav-item dropdown">

                         <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">User</a>
                    </li>
                     <li>
                        <a><img src="/images/digit-powered-by-egov/digit-powered-by-egov@2x.jpg" style={{width: '97px',height: '32px'}}/></a>
                     </li>
                  </ul>
            </nav>
       </div>);
}

