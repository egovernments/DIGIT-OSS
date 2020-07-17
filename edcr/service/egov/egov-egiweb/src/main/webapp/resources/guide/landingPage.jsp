<!DOCTYPE html>
<html>

<head>
    <!--Import Google Icon Font-->
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <!--Import materialize.css-->
    <link type="text/css" rel="stylesheet" href="/egi/resources/guide/css/materialize.min.css" media="screen,projection" />
    <link type="text/css" rel="stylesheet" href="/egi/resources/guide/css/landingpage.css" />

    <!--Let browser know website is optimized for mobile-->
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
        .icon-header {
            display: block !important;
        }
    </style>
    <script type="text/javascript" src="/egi/resources/guide/js/materialize.min.js"></script>
    <script type="text/javascript">
        document.addEventListener('DOMContentLoaded', function () {
            var elems = document.querySelectorAll('.collapsible');
            var instances = M.Collapsible.init(elems, {
                inDuration: 0,
                outDuration: 0,
                onOpenStart: function (e) {
                    var row = e.querySelectorAll('.lp-row-1');
                    row[0].classList.add("row-hide");
                    var downarrow = e.querySelectorAll('.landingpage-card-down-arrow');
                    downarrow[0].classList.add("row-hide");
                    var uparrow = e.querySelectorAll('.landingpage-card-up-arrow');
                    uparrow[0].classList.remove("row-hide");

                },
                onCloseEnd: function (e) {
                    var row = e.querySelectorAll('.lp-row-1');
                    row[0].classList.remove("row-hide");
                    var downarrow = e.querySelectorAll('.landingpage-card-down-arrow');
                    downarrow[0].classList.remove("row-hide");
                    var uparrow = e.querySelectorAll('.landingpage-card-up-arrow');
                    uparrow[0].classList.add("row-hide");

                }
            });



        });


    </script>
</head>

<body>
   
   
    <div class="main-content landingpage-font-style" >

        <div class="card landingpage-card">
            <ul class="collapsible card-collapse">
                <li style="padding-left: 40px; padding-right: 40px;">
                    <div class="card-content collapsible-header landingpage-card-content">
                        <span class="card-title card-header">About Building Plan Approval System</span>
                    </div>
                    <div class="row lp-row-1 collapsible-header landingpage-card-content">
                        <div class="col s12 m2">
                            <img class="header-icon" src="/egi/resources/guide/assets/ICONS/BPA_1.png" />
                            <p class="landingpage-card-icon-description">End to end Process Digitisation</p>
                        </div>
                        <div class="col s12 m2 lp-col-margin">
                            <img class="header-icon" src="/egi/resources/guide/assets/ICONS/BPA_2.png" />
                            <p class="landingpage-card-icon-description">Single window for multiple services</p>
                        </div>
                        <div class="col s12 m2 lp-col-margin">
                            <img class="header-icon" src="/egi/resources/guide/assets/ICONS/BPA_3.png" />
                            <p class="landingpage-card-icon-description">Open source smart platform</p>
                        </div>
                        <div class="col s12 m2 lp-col-margin">
                            <img class="header-icon" src="/egi/resources/guide/assets/ICONS/BPA_4.png" />
                            <p class="landingpage-card-icon-description">Achieving Transparency</p>
                        </div>
                        <div class="col s12 m2 lp-col-margin">
                            <img class="header-icon" src="/egi/resources/guide/assets/ICONS/BPA_5.png" />
                            <p class="landingpage-card-icon-description">Seamless Application Processes</p>
                        </div>
                    </div>
                    <div class="row collapsible-header collapsible-body card-body">
                        <div class="col s12 m2">
                            <img class="header-icon" src="/egi/resources/guide/assets/ICONS/BPA_1.png" />
                            <p class="landingpage-card-icon-description">End to end Process Digitisation</p>

                            <div class="landingpage-card-description"> Scrutiny reports are produced in the matter of minutes with automatic rule mapping. The development regulation process is also automated saving paperwork and time of stakeholders. 
                            </div>
                        </div>
                        <div class="col s12 m2 lp-col-margin">
                            <img class="header-icon" src="/egi/resources/guide/assets/ICONS/BPA_2.png" />
                            <p class="landingpage-card-icon-description">Single window for multiple services</p>

                            <div class="landingpage-card-description">Stakeholders like ULB officials, architects, town planners, engineers and citizens are connected on a single platform to coordinate various services. Stakeholders are updated in  real time of the application progress thus achieving transparency.
                          
                            </div>
                        </div>
                        <div class="col s12 m2 lp-col-margin">
                            <img class="header-icon" src="/egi/resources/guide/assets/ICONS/BPA_3.png" />
                            <p class="landingpage-card-icon-description">Open source smart platform</p>

                            <div class="landingpage-card-description">It is a state-of-the-art, ERP-based platform created for urban governance, built on advanced open source technologies ensuring flexibility, interoperability and faster implementation.
                                     </div>
                        </div>
                        <div class="col s12 m2 lp-col-margin">
                            <img class="header-icon" src="/egi/resources/guide/assets/ICONS/BPA_4.png" />
                            <p class="landingpage-card-icon-description">Achieving Transparency</p>
                            <div class="landingpage-card-description">Existing manual processes are completely replaced with automated workflows. Standardisation of processes with well-defined roles and responsibilities of stakeholders mapped in the system. MIS reports are automatically generated to help track process efficiency.
                            
                            </div>
                        </div>

                        <div class="col s12 m2 lp-col-margin">
                            <img class="header-icon" src="/egi/resources/guide/assets/ICONS/BPA_5.png" />
                            <p class="landingpage-card-icon-description">Seamless Application Processes</p>

                            <div class="landingpage-card-description">Earlier processes which were tedious have been replaced with  a seamless submission process for Building Plan Licensing systems through auto synchronisation of data between DIGIT DCR and BPA application.
</div>
                        </div>
                    </div>
                    <div class="row collapsible-header card-action card-collapse-header">
                        <i class="material-icons landingpage-card-down-arrow">keyboard_arrow_down</i>
                        <i class="material-icons row-hide landingpage-card-up-arrow">keyboard_arrow_up</i>
                    </div>
                </li>
            </ul>
        </div>


        <div class="card landingpage-card">
            <ul class="collapsible card-collapse">
                <li style="padding-left: 40px; padding-right: 40px;">
                    <div class="card-content collapsible-header landingpage-card-content">
                        <span class="card-title card-header">Citizen & Building Licensee </span>
                    </div>
                    <!--<div class="row collapsible-header lp-row-1 landingpage-card-content">
                        <div class="col s12 m2 offset-m3">
                            <img class="header-icon" src="/egi/resources/guide/assets/ICONS/licensee_1.png" />
                            <p class="landingpage-card-icon-description">Online payment</p>
                        </div>
                        <div class="col s12 m2">
                            <img class="header-icon" src="/egi/resources/guide/assets/ICONS/citizen_1.png" />
                            <p class="landingpage-card-icon-description">Track Application</p>
                        </div>
                        <div class="col s12 m2">
                            <img class="header-icon" src="/egi/resources/guide/assets/ICONS/citizen_2.png" />
                            <p class="landingpage-card-icon-description">Receive alert and notification</p>
                        </div>

                    </div>-->
                    <div class="row collapsible-header card-body">
                        <div class="col s12 m4 ">
                            <img class="header-icon" src="/egi/resources/guide/assets/ICONS/licensee_1.png" />
                            <p class="landingpage-card-icon-description">Online payment</p>
                            <div class="landingpage-card-description">Citizens and Building Licensees can make an online payment at anytime and from anywhere. Online payments can be made using debit/credit card/internet banking.
                            </div>
                        </div>
                        <div class="col s12 m4">
                            <img class="header-icon" src="/egi/resources/guide/assets/ICONS/citizen_1.png" />
                            <p class="landingpage-card-icon-description">Track Application</p>
                            <p class="landingpage-card-description">The citizen as well as building licensee can receive real time updates on submitted application. The applicant will be provided with the login credentials to the user portal.
                            </p>
                        </div>
                        <div class="col s12 m4">
                            <img class="header-icon" src="/egi/resources/guide/assets/ICONS/citizen_2.png" />
                            <p class="landingpage-card-icon-description">Receive alert and notification</p>
                            <p class="landingpage-card-description">All stakeholders including citizens, business users, and ULB officials are on one platform. Real time synchronisation of the entire process including status updates for every required interaction between end users via SMS and email notifications.
                            </p>
                        </div>
                    </div>
                    <!--<div class="row collapsible-header card-action card-collapse-header">
                        <i class="material-icons landingpage-card-down-arrow">keyboard_arrow_down</i>
                        <i class="material-icons row-hide landingpage-card-up-arrow">keyboard_arrow_up</i>
                    </div>-->
                </li>
            </ul>

        </div>


    <!-- <div class="row main-padding">
        <div class="col s12 m12">
            <div class="card ">
                <div class="help-documents-card">
                    <div class="card-title card-header header-padding">Help Documents</div>
                       <div class="help-document-font-style line-spacing">
                        <a href="/egi/resources/guide/bpaHelpDocument.html" target="_blank">Suvega phase 2 videos</a> 
                    </div>
                    <div class="help-document-font-style line-spacing">
                        <a href="/egi/resources/guide/assets/docs/Business Licensee User.pdf" target="_blank">Registered building licensee user manual</a>
                    </div>
                    <div class="help-document-font-style line-spacing">
                        <a href="/egi/resources/guide/assets/docs/DIGIT DCR-Building Plan Scrutiny.pdf" target="_blank">DIGIT DCR user manual</a>
                    </div>
                    <div class="help-document-font-style line-spacing">
                        <a href="/egi/resources/guide/assets/docs/Citizen Help Manual.pdf" target="_blank">Citizen Help Manual</a>
                    </div>
                    <div class="help-document-font-style line-spacing">
                        <a href="/egi/resources/guide/assets/docs/Fee details.pdf" target="_blank">Fee Details</a>
                    </div>
                      <div class="help-document-font-style line-spacing">
                        <a href="/egi/resources/guide/assets/docs/Drawings.pdf" target="_blank">Drawing Guidelines</a>
                    </div>
                      <div class="help-document-font-style line-spacing">
                        <a href="/egi/resources/guide/assets/docs/eDcr_Phase01_layers.las" target="_blank">Layer Set</a>
                    </div>


                </div>
            </div>
        </div>
    </div> -->
   </div> 
	 <!-- <footer>
					<div class="col-md-12 feature-top text-center"></div>
					<div class="col-md-4 top-community-space login-footer-icon" style=" text-align: center ;color: #039be5; position: relative;
					left: 35px;bottom: 4px;>
						<a href="${sessionScope.corpGisLink}" target="_blank"><span><i
								class="fa fa-map-marker fa-3x"></i></span></a>
						<p style="margin: 0px ;color: #000000;">
							${sessionScope.corpAddress}
						</p>
						<a class="block-left-text" href="${sessionScope.corpGisLink}"
						   target="_blank">Find us on google maps</a>
					</div>
						<div class="col-md-4 top-community-space login-footer-icon" style=" text-align: center ;color: #039be5;position: relative;
						left: 23px;">
						<a href="tel:${sessionScope.corpContactNo}"><span><i
								class="fa fa-phone fa-3x"></i></span></a>
						<p style="margin: 0px;color: #000000;">${sessionScope.corpContactNo}</p>
						<a href="mailto:${sessionScope.corpContactEmail}"><p>${sessionScope.corpContactEmail}</p></a>
					</div>
					<div class="col-md-4 top-community-space login-footer-icon" style=" text-align: center;color: #000000;">
						<a href="javascript:void(0)"><span><i
								class="fa fa-thumbs-o-up fa-2x"></i></span></a>
						<p>Follow us on</p>
						<a href="${sessionScope.corpTwitterLink}" target="_blank"><i
								class="fa fa-twitter fa-2x"></i></a> <a
							href="${sessionScope.corpFBLink}" target="_blank"><i
							class="fa fa-facebook fa-2x"></i></a>
					</div>
			</div>
			</div>
			</div>
			</footer> -->
			<footer class="page-footer font-small blue social-media-contact-container">
  <div class=" logo">
   <img src="<cdn:url value='/resources/guide/assets/digit_dcr_glow_logo.png'/>"
								 height="128" style="position: relative;right: 37px;bottom:  -10px;">
  </div>
  <div class="item-list training-ttutorial">
    <p class="subheader">Training & Tutorials</p>
    <ul class="tutorial-list">
     
      <li class="tutorial-item">
        <a href="/egi/resources/guide/assets/docs/Business Licensee User.pdf" target="_blank">Registered building licensee user manual</a>
      </li>
      <li class="tutorial-item">
        <a href="/egi/resources/guide/assets/docs/DIGIT DCR-Building Plan Scrutiny.pdf" target="_blank">DIGIT DCR user manual</a>
      </li>
      <li class="tutorial-item">
        <a href="/egi/resources/guide/assets/docs/Citizen Help Manual.pdf" target="_blank">Citizen Help Manual</a>
      </li>
      <li class="tutorial-item">
        <a href="/egi/resources/guide/assets/docs/Fee details.pdf" target="_blank">Fee Details</a>
      </li>
      <li class="tutorial-item">
        <a href="https://s3.ap-south-1.amazonaws.com/suvega/images/Single+family+residential+layer.dxf" target="_blank">Single family residential building layers</a>
      </li>
       <li class="tutorial-item">
        <a href="https://s3.ap-south-1.amazonaws.com/suvega/images/LAYER+MATRIX+-+MULTIPLE+OCCUPANCIES-+Revision+01-+Dated+04-01-2019.dwg" target="_blank">Layer Matrix for multiple occupancies</a>
      </li>
        <li class="tutorial-item">
        <a href="https://s3.ap-south-1.amazonaws.com/suvega/images/Single+Family+Layer.las" target="_blank">Layer Set (las format)</a>
      </li>
      <li class="tutorial-item">
        <a href="https://s3.ap-south-1.amazonaws.com/suvega/images/Single+family+residential+building.pdf" target="_blank">Single family residential building - Drawing Guidelines</a>
      </li> 
      
    </ul>
  </div>
  <div class="item-list social-media">
			<p class="subheader">Follow us on</p>
			<a href="" target="_blank" class="media-link"><i class="fa fa-twitter fa-2x"></i></a>
      <a href="" target="_blank" class="media-link"><i class="fa fa-facebook fa-2x"></i></a>
  </div>
  <div class="item-list contact-us">
    <p class="subheader">Contact Us</p>
<ul class="contact-mode-container" style="width: 245px;"> 
      <li class="contact-mode-item">
      
        <i class="fa fa-envelope fa-1x"></i>
       <!--  <a href="mailto:contact@egovernments.org">contact@egovernments.org</a>
        -->
						<a href="mailto:${sessionScope.corpContactEmail}"><p>${sessionScope.corpContactEmail}</p></a>
      </li>
      <li>
        <i class="fa fa-phone fa-1x"></i>
         <a href="tel:${sessionScope.corpContactNo}">${sessionScope.corpContactNo}</a>
      </li>
      <li>
        <i class="fa fa-map-marker fa-1x"></i>
        <a href="${sessionScope.corpGisLink}" target="_blank"></a>
						<a class="block-left-text" href="${sessionScope.corpGisLink}"
						   target="_blank">${sessionScope.corpAddress}</a>
						</p>
						
        <!-- <a href="https://www.google.co.in/maps/@11.2547842,75.7710018,18.5z">Egovernment Foundation</a> -->
      </li>
    </ul>
  </div>
</footer>
   
    </div>
</body>

</html>