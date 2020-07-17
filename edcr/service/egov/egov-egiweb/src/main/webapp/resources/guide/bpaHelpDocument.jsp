<!DOCTYPE html>
<%@ taglib uri="/WEB-INF/taglib/cdn.tld" prefix="cdn"%> 
<html>
<head>
    <!--Import Google Icon Font-->
    
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <!--Import materialize.css-->
  <link type="text/css" rel="stylesheet" href="/egi/resources/guide/css/materialize.min.css" media="screen,projection" />
  <link type="text/css" rel="stylesheet" href="/egi/resources/guide/css/landingpage.css" />
  
  <link href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.0/css/bootstrap.min.css" rel="stylesheet" id="bootstrap-css">
    <link href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">
<!--     <link href="//maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" rel="stylesheet" id="bootstrap-css">
 -->
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
	<div class="logo-container"  style="background-color:#F8F9F9;">
				
				<img src="https://www.egovernments.org/wp-content/uploads/2018/11/Logo-2.png" style="background-color:#3b73af" height="90">
				
				<a href="http://www.egovernments.org" style="padding-top:8px;padding-right:30px;" 
						data-strwindname="egovsite" class="open-popup"> <img
							src="<cdn:url value='/resources/global/images/egov_logo_tr_h.png'/>"
							title="Powered by eGovernments" height="45" alt=""> 
					</a>
	</div>	

	<div class="main-content landingpage-font-style">
			
		<div class="card landingpage-card landingpage-card-video">
			<div class="card-content collapsible-header landingpage-card-content">
				<span class="card-title card-header card-subheader" style="text-align:center; color:black; font-weight:500;">Training and Tutorials - Building plan drawing videos </span>
			</div>
			<ul class="collapsible card-collapse video-documents-csrd">
				<li style="padding-left: 40px; padding-right: 40px;">

					<div class="video-container-card">
						<div class="videos-container-element">
							<div class="col s12 m4 video-play">
								<video width="320" height="240" controls>
									<source
										src="https://s3.ap-south-1.amazonaws.com/suvega/videos/001+-+Preliminaries+and+creation+of+pdf+sheets+from+dxf.mp4#t=0.5"
										type="video/mp4">
								</video>
								<p class="landingpage-card-icon-description">1.Preliminaries
									and creation of pdf sheets from dxf</p>
							</div>
							<div class="col s12 m4 video-play"> 
								<video width="320" height="240" controls preload="metadata">
									<source
										src="https://s3.ap-south-1.amazonaws.com/suvega/videos/002++bilt+up+area+of+proposed+portions.mp4#t=0.5"
										type="video/mp4">
								</video>
								<!-- 	 <iframe src="https://s3.ap-south-1.amazonaws.com/suvega/videos/002++bilt+up+area+of+proposed+portions.mp4&autoplay=0"
								 frameborder="0" allowfullscreen ></iframe> 	 -->
								<p class="landingpage-card-icon-description">2.Built up area
									of proposed portions</p>
								</p>
							</div>

							<div class="col s12 m4 video-play">
								<video width="320" height="240" controls preload="metadata">
									<source
										src="https://s3.ap-south-1.amazonaws.com/suvega/videos/003++Built+up+area+of+existing+buildings.mp4#t=0.5"
										type="video/mp4">
								</video>
								<p class="landingpage-card-icon-description">3.Built up area
									of existing buildings</p>
								</p>
							</div>

						</div>
						<div class="videos-container-element">
							<div class="col s12 m4 video-play">
								<video width="320" height="240" controls>
									<source
										src="https://s3.ap-south-1.amazonaws.com/suvega/videos/004++Deductions+for+calculating+floor+area.mp4#t=0.5"
										type="video/mp4">
								</video>
								<p class="landingpage-card-icon-description">4.Deductions
									for calculating floor area</p>
							</div>

							<div class="col s12 m4 video-play">
								<video width="320" height="240" controls preload="metadata">
									<source
										src="https://s3.ap-south-1.amazonaws.com/suvega/videos/006++PLOT+BOUNDARY.mp4#t=0.5"
										type="video/mp4">
								</video>
								<p class="landingpage-card-icon-description">5.Plot Boundary</p>
								</p>
							</div>

							<div class="col s12 m4 video-play">
								<video width="320" height="240" controls preload="metadata">
									<source
										src="https://s3.ap-south-1.amazonaws.com/suvega/videos/007++SHADES+AND+OVERHANGS.mp4#t=0.5"
										type="video/mp4">
								</video>
								<p class="landingpage-card-icon-description">6.Shades and
									overhanging</p>
								</p>
							</div>
						</div>
						<div class="videos-container-element">
							<div class="col s12 m4 video-play">
								<video width="320" height="240" controls>
									<source
										src="https://s3.ap-south-1.amazonaws.com/suvega/videos/008++COVERED+AREA+FOR+COVERAGE.mp4#t=0.5"
										type="video/mp4">
								</video>
								<p class="landingpage-card-icon-description">7.Covered Area
									and Coverage</p>
							</div>
							<div class="col s12 m4 video-play">
								<video width="320" height="240" controls preload="metadata">
									<source
										src="https://s3.ap-south-1.amazonaws.com/suvega/videos/009++HEIGHT+OF+BUILDING.mp4#t=0.5"
										type="video/mp4">
								</video>
								<p class="landingpage-card-icon-description">8.Height of
									Building</p>
								</p>
							</div>

							<div class="col s12 m4 video-play">
								<video width="320" height="240" controls preload="metadata">
									<source
										src="https://s3.ap-south-1.amazonaws.com/suvega/videos/010++OPEN+SPACES.mp4#t=0.5"
										type="video/mp4">
								</video>
								<p class="landingpage-card-icon-description">9.Open Spaces</p>
								</p>
							</div>

						</div>

						<div class="videos-container-element">
							<div class="col s12 m4 video-play">
								<video width="320" height="240" controls>
									<source
										src="https://s3.ap-south-1.amazonaws.com/suvega/videos/011++BUILDING+FOOT+PRINT.mp4#t=0.5"
										type="video/mp4">
								</video>
								<p class="landingpage-card-icon-description">10.Building
									footprint</p>
							</div>
							<div class="col s12 m4 video-play">
								<video width="320" height="240" controls preload="metadata">
									<source
										src="https://s3.ap-south-1.amazonaws.com/suvega/videos/013++RAIN+WATER+HARVESTING.mp4#t=0.5"
										type="video/mp4">
								</video>
								<p class="landingpage-card-icon-description">11.Rain water
									Harvesting</p>
								</p>
							</div>

							<div class="col s12 m4 video-play">
								<video width="320" height="240" controls preload="metadata">
									<source
										src="https://s3.ap-south-1.amazonaws.com/suvega/videos/014++OHEL.mp4#t=0.5"
										type="video/mp4">
								</video>
								<p class="landingpage-card-icon-description">12.OHEL</p>
								</p>
							</div>
						</div>
						<div class="videos-container-element">
							<div class="col s12 m4 video-play">
								<video width="320" height="240" controls>
									<source
										src="https://s3.ap-south-1.amazonaws.com/suvega/videos/015++TYPES+OF+ROADS.mp4#t=0.5"
										type="video/mp4">
								</video>
								<p class="landingpage-card-icon-description">13.Type of
									roads</p>
							</div>
							<div class="col s12 m4 video-play">
								<video width="320" height="240" controls preload="metadata">
									<source
										src="https://s3.ap-south-1.amazonaws.com/suvega/videos/016++OPEN+WELL+AND+WASTE+DISPOSAL+FACILITIES.mp4#t=0.5"
										type="video/mp4">
								</video>
								<p class="landingpage-card-icon-description">14.Open well
									and waste disposalfacilities</p>
								</p>
							</div>

							<div class="col s12 m4 video-play">
								<video width="320" height="240" controls preload="metadata">
									<source
										src="https://s3.ap-south-1.amazonaws.com/suvega/videos/017++PLAN+INFO.mp4#t=0.5"
										type="video/mp4">
								</video>
								<p class="landingpage-card-icon-description">15.Plan Info</p>
								</p>
							</div>
						</div>

						<div class="videos-container-element">
							<div class="col s12 m4 video-play">
								<video width="320" height="240" controls>
									<source
										src="https://s3.ap-south-1.amazonaws.com/suvega/videos/018++FILE+SAVING-+PREPARATION.mp4#t=0.5"
										type="video/mp4">
								</video>
								<p class="landingpage-card-icon-description">16.File saving
									and preparation</p>
							</div>
							<div class="col s12 m4 video-play">
								<video width="320" height="240" controls preload="metadata">
									<source
										src="https://s3.ap-south-1.amazonaws.com/suvega/videos/019++FILE+UPLOADING.mp4#t=0.5"
										type="video/mp4">
								</video>
								<p class="landingpage-card-icon-description">17.File
									uploading</p>
								</p>
							</div>

							<div class="col s12 m4 video-play">
								<video width="320" height="240" controls preload="metadata">
									<source
										src="https://s3.ap-south-1.amazonaws.com/suvega/videos/20+RESULTS.mp4#t=0.5"
										type="video/mp4">
								</video>
								<p class="landingpage-card-icon-description">18.Results</p>
								</p>
							</div>
						</div>
					</div>
				</li>
			</ul>

		</div>

	</div>

	</div>
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
   <!--  <ul class="contact-mode-container">
      <li class="contact-mode-item">
        <i class="fa fa-envelope fa-1x"></i>
        <a href="mailto:contact@egovernments.org">contact@egovernments.org</a>
      </li> 
      <li>
        <i class="fa fa-phone fa-1x"></i>
        <a href="tel:8041255708">8041255708</a>
      </li>
      <li>
        <i class="fa fa-map-marker fa-1x"></i>
        <a href="https://www.google.co.in/maps/@11.2547842,75.7710018,18.5z">Egovernment Foundation</a>
      </li>
    </ul> --> 
        <ul class="contact-mode-container" style="width: 245px;"> 
      <li class="contact-mode-item">
      
        <i class="fa fa-envelope fa-1x"></i>
      <!--   <a href="mailto:contact@egovernments.org">contact@egovernments.org</a> -->
       
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
						
<!--         <a href="https://www.google.co.in/maps/@11.2547842,75.7710018,18.5z">Egovernment Foundation</a>
 -->      </li>
    </ul>
  </div>
</footer> 
</body>

</html>
