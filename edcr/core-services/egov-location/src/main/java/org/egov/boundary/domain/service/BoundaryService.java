/*
 * eGov suite of products aim to improve the internal efficiency,transparency,
 * accountability and the service delivery of the government  organizations.
 *
 *  Copyright (C) 2016  eGovernments Foundation
 *
 *  The updated version of eGov suite of products as by eGovernments Foundation
 *  is available at http://www.egovernments.org
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program. If not, see http://www.gnu.org/licenses/ or
 *  http://www.gnu.org/licenses/gpl.html .
 *
 *  In addition to the terms of the GPL license to be adhered to in using this
 *  program, the following additional terms are to be complied with:
 *
 *      1) All versions of this program, verbatim or modified must carry this
 *         Legal Notice.
 *
 *      2) Any misrepresentation of the origin of the material is prohibited. It
 *         is required that all modified versions of this material be marked in
 *         reasonable ways as different from the original version.
 *
 *      3) This license does not grant any rights to any user of the program
 *         with regards to rights under trademark law for use of the trade names
 *         or trademarks of eGovernments Foundation.
 *
 *  In case of any queries, you can reach eGovernments Foundation at contact@egovernments.org.
 */

package org.egov.boundary.domain.service;

import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.egov.boundary.domain.model.Boundary;
import org.egov.boundary.domain.model.BoundarySearchRequest;
import org.egov.boundary.exception.CustomException;
import org.egov.boundary.persistence.repository.BoundaryRepository;
import org.egov.boundary.util.BoundaryConstants;
import org.egov.boundary.web.contract.BoundaryRequest;
import org.egov.boundary.web.contract.BoundaryType;
import org.egov.boundary.web.contract.MdmsTenantBoundary;
import org.egov.common.contract.request.RequestInfo;
import org.geotools.data.DataStore;
import org.geotools.data.DataStoreFinder;
import org.geotools.feature.FeatureCollection;
import org.geotools.geometry.jts.JTSFactoryFinder;
import org.opengis.feature.simple.SimpleFeature;
import org.opengis.feature.simple.SimpleFeatureType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.vividsolutions.jts.geom.Coordinate;
import com.vividsolutions.jts.geom.Geometry;
import com.vividsolutions.jts.geom.Point;

@Service
public class BoundaryService {

	private static final Logger LOG = LoggerFactory.getLogger(BoundaryService.class);

	private CrossHierarchyService crossHierarchyService;
	private BoundaryTypeService boundaryTypeService;
	private BoundaryRepository boundaryRepository;

	@Autowired
	public BoundaryService(BoundaryTypeService boundaryTypeService, CrossHierarchyService crossHierarchyService,
			BoundaryRepository boundaryRepository) {
		this.boundaryTypeService = boundaryTypeService;
		this.crossHierarchyService = crossHierarchyService;
		this.boundaryRepository = boundaryRepository;
	}

	public Boundary findByTenantIdAndId(Long id, String tenantId) {
		return boundaryRepository.findByTenantIdAndId(tenantId, id);
	}

	public Boundary findByTenantIdAndCode(String tenantId, String code) {
		return boundaryRepository.findByTenantIdAndCode(tenantId, code);
	}

	public List<Boundary> findByTenantIdAndCodes(String tenantId, List<String> codes) {
		return boundaryRepository.findByTenantIdAndCodes(tenantId, codes);
	}

	public Boundary createBoundary(final Boundary boundary) {
		boundary.setHistory(false);
		boundary.setMaterializedPath(getMaterializedPath(null, boundary.getParent()));
		if (boundary.getBoundaryType() != null && boundary.getBoundaryType().getCode() != null)
			boundary.setBoundaryType(boundaryTypeService.findByTenantIdAndCode(boundary.getTenantId(),
					boundary.getBoundaryType().getCode()));
		if (boundary.getParent() != null && boundary.getParent().getCode() != null)
			boundary.setParent(findByTenantIdAndCode(boundary.getTenantId(), boundary.getParent().getCode()));
         Boundary bndry = null;
		try{
			bndry = boundaryRepository.save(boundary);
		}catch(Exception e){
			
			LOG.error("Exception while creating Boundary: ", e);
			throw new CustomException(
					Long.valueOf(HttpStatus.INTERNAL_SERVER_ERROR
							.toString()),
					BoundaryConstants.BOUNDARY_CREATE_EXCEPTION_MSG,
					BoundaryConstants.BOUNDARY_CREATE_EXCEPTION_DESC);
		}
		return bndry;
	}

	public Boundary updateBoundary(final Boundary boundary) {
		boundary.setHistory(false);
		boundary.setMaterializedPath(getMaterializedPath(boundary, boundary.getParent()));
		if (boundary.getBoundaryType() != null && boundary.getBoundaryType().getCode() != null)
			boundary.setBoundaryType(boundaryTypeService.findByTenantIdAndCode(boundary.getTenantId(),
					boundary.getBoundaryType().getCode()));
		if (boundary.getParent() != null && boundary.getParent().getCode() != null)
			boundary.setParent(findByTenantIdAndCode(boundary.getTenantId(), boundary.getParent().getCode()));
		Boundary bndry = null;
		try{
			bndry = boundaryRepository.update(boundary);
		}catch(Exception e){
			LOG.error("Exception while updating Boundary: ", e);
			throw new CustomException(
					Long.valueOf(HttpStatus.INTERNAL_SERVER_ERROR
							.toString()),
					BoundaryConstants.BOUNDARY_UPDATE_EXCEPTION_MSG,
					BoundaryConstants.BOUNDARY_UPDATE_EXCEPTION_DESC);
		}
		return bndry;
	}

	public boolean checkBoundaryExistByTypeAndNumber(Long boundaryNumber, Long boundaryTypeId) {
		List<Boundary> bndryList = boundaryRepository.getBoundaryByTypeAndNumber(boundaryNumber, boundaryTypeId);
		if (bndryList != null && !bndryList.isEmpty()) {
			return true;
		}
		return false;
	}

	public List<Boundary> getAllBoundariesByBoundaryTypeIdAndTenantId(final Long boundaryTypeId,
			final String tenantId) {
		return boundaryRepository.getAllBoundariesByBoundaryTypeIdAndTenantId(boundaryTypeId, tenantId);
	}

	public Boundary getBoundaryByTypeAndNo(final Long boundaryTypeId, final Long boundaryNum, final String tenantId) {
		return boundaryRepository.findBoundarieByBoundaryTypeAndBoundaryNum(boundaryTypeId, boundaryNum, tenantId);
	}

	public List<Boundary> getBoundariesByBndryTypeNameAndHierarchyTypeNameAndTenantId(final String boundaryTypeName,
			final String hierarchyTypeName, final String tenantId) {
		return boundaryRepository.getBoundariesByBndryTypeNameAndHierarchyTypeNameAndTenantId(boundaryTypeName,
				hierarchyTypeName, tenantId);
	}

	public List<Map<String, Object>> getBoundaryDataByTenantIdAndNameLike(final String tenantId, final String name) {
		final List<Map<String, Object>> list = new ArrayList<>();
		crossHierarchyService.getChildBoundaryNameAndBndryTypeAndHierarchyTypeAndTenantId("Locality", "Location",
				"Administration", '%' + name + '%', tenantId).stream().forEach(location -> {
					final Map<String, Object> res = new HashMap<>();
					res.put("id", location.getId());
					res.put("name", location.getChild().getName() + " - " + location.getParent().getName() + " - "
							+ location.getChild().getParent().getName());

					list.add(res);
				});
		return list;
	}

	public String getMaterializedPath(final Boundary child, final Boundary parent) {
		String mpath = "";
		int childSize = 0;
		if (null == parent)
			mpath = String.valueOf(boundaryRepository.findAllParents().size() + 1);
		else
			childSize = boundaryRepository.findActiveImmediateChildrenWithOutParent(parent.getId()).size();
		if (mpath.isEmpty())
			if (null != child) {
				if (child.getMaterializedPath() == null) {
					mpath = parent.getMaterializedPath() + "." + childSize;
				} else if (parent != null && !child.getMaterializedPath()
						.equalsIgnoreCase(parent.getMaterializedPath() + "." + childSize)) {
					childSize += 1;
					mpath = parent.getMaterializedPath() + "." + childSize;
				} else
					mpath = child.getMaterializedPath();
			} else if (parent != null) {
				childSize += 1;
				mpath = parent.getMaterializedPath() + "." + childSize;
			}

		return mpath;
	}

	public Long getBoundaryIdFromShapefile(final Double latitude, final Double longitude, String tenantId) {
		Optional<Boundary> boundary = getBoundary(latitude, longitude, tenantId);
		return boundary.isPresent() ? boundary.get().getId() : 0;
	}

	public Optional<Boundary> getBoundary(final Double latitude, final Double longitude, String tenantId) {
		try {
			if (latitude != null && longitude != null) {
				final Map<String, URL> map = new HashMap<>();
				map.put("url", new ClassPathResource("/gis/" + tenantId.replace(".", "/") + "/wards.shp").getURL());
				final DataStore dataStore = DataStoreFinder.getDataStore(map);
				final FeatureCollection<SimpleFeatureType, SimpleFeature> collection = dataStore
						.getFeatureSource(dataStore.getTypeNames()[0]).getFeatures();
				final Iterator<SimpleFeature> iterator = collection.iterator();
				final Point point = JTSFactoryFinder.getGeometryFactory(null)
						.createPoint(new Coordinate(longitude, latitude));
				LOG.debug("Fetching boundary data for coordinates lng {}, lat {}", longitude, latitude);
				try {
					while (iterator.hasNext()) {
						final SimpleFeature feature = iterator.next();
						final Geometry geom = (Geometry) feature.getDefaultGeometry();
						if (geom.contains(point)) {
							LOG.debug("Found coordinates in shape file");
							return getBoundaryByNumberAndType((Long) feature.getAttribute("bndrynum"),
									(String) feature.getAttribute("bndrytype"), tenantId);
						}
					}
				} finally {
					collection.close(iterator);
				}
			}
			return Optional.empty();
		} catch (final Exception e) {
			throw new RuntimeException("Error occurred while fetching boundary from GIS data", e);
		}
	}

	public Optional<Boundary> getBoundaryByNumberAndType(Long boundaryNum, String boundaryTypeName, String tenantId) {
		if (boundaryNum != null && !StringUtils.isEmpty(boundaryTypeName)) {
			final BoundaryType boundaryType = boundaryTypeService
					.getBoundaryTypeByNameAndHierarchyTypeName(boundaryTypeName, "ADMINISTRATION", tenantId);
			final Boundary boundary = this.getBoundaryByTypeAndNo(Long.valueOf(boundaryType.getId()), boundaryNum,
					tenantId);
			if (boundary == null) {
				final BoundaryType cityBoundaryType = boundaryTypeService
						.getBoundaryTypeByNameAndHierarchyTypeName("City", "ADMINISTRATION", tenantId);
				return Optional.ofNullable(this
						.getAllBoundariesByBoundaryTypeIdAndTenantId(Long.valueOf(cityBoundaryType.getId()), tenantId)
						.get(0));
			}
			return Optional.of(boundary);
		}
		return Optional.empty();
	}

	public Boundary getBoundariesByIdAndTenantId(Long id, String tenantId) {
		return boundaryRepository.findByTenantIdAndId(tenantId, id);
	}

	public List<Boundary> getAllBoundary(BoundaryRequest boundaryRequest) {
		List<Boundary> boundaries = new ArrayList<Boundary>();
		if (boundaryRequest.getBoundary().getTenantId() != null
				&& !boundaryRequest.getBoundary().getTenantId().isEmpty()) {
			if (boundaryRequest.getBoundary().getId() != null) {
				boundaries.add(getBoundariesByIdAndTenantId(boundaryRequest.getBoundary().getId(),
						boundaryRequest.getBoundary().getTenantId()));
			} else if (boundaryRequest.getBoundary().getCode() != null) {
				boundaries.add(findByTenantIdAndCode(boundaryRequest.getBoundary().getTenantId(),
						boundaryRequest.getBoundary().getCode()));
			} else if (boundaryRequest.getBoundary().getCodes() != null && !boundaryRequest.getBoundary().getCodes().isEmpty()) {
                            boundaries.addAll(findByTenantIdAndCodes(boundaryRequest.getBoundary().getTenantId(),
                                    new ArrayList<>(Arrays.asList( boundaryRequest.getBoundary().getCodes().split(",")))));
			} else {
				if (!StringUtils.isEmpty(boundaryRequest.getBoundary().getLatitude())
						&& !StringUtils.isEmpty(boundaryRequest.getBoundary().getLongitude())) {
					Optional<Boundary> boundary = getBoundary(boundaryRequest.getBoundary().getLatitude().doubleValue(),
							boundaryRequest.getBoundary().getLongitude().doubleValue(),
							boundaryRequest.getBoundary().getTenantId());
					if (boundary.isPresent())
						boundaries.add(boundary.get());
					else
						boundaries = new ArrayList<Boundary>();
				} else {
					boundaries.addAll(boundaryRepository.findAllByTenantId(boundaryRequest.getBoundary().getTenantId()));
				}
			}
		}
		return boundaries;
	}

	// TODO: The internal logic of this API returns whether the shape file
	// exists or not will be based on the resource exists in a directory
	// structure <clientId>/<tenant>/wards.shp.
	// Later we need to rewrite the internal logic of this API to consider the
	// meta-data after uploading the Shape file as a filestore (After
	// implementing the uploading of shape file as file store).
	public Boolean checkTenantShapeFileExistOrNot(String tenantId) {
		String path = tenantId.replace(".", "/");
		ClassPathResource file = new ClassPathResource("/gis/" + path + "/wards.shp");
		if (file.exists()) {
			return true;
		}
		return false;
	}

	public Resource fetchShapeFile(String tenantId) throws IOException {
		String path = tenantId.replace(".", "/");
		Resource resource = new ClassPathResource("/gis/" + path + "/wards.kml");

		if(resource.exists())
			return resource;

		return null;
	}

	public List<Boundary> getAllBoundariesByIdsAndTypeAndNumberAndCodeAndTenant(
			BoundarySearchRequest boundarySearchRequest) {

		return boundaryRepository.getAllBoundariesByIdsAndTypeAndNumberAndCodeAndTenant(boundarySearchRequest);
	}
	
	public List<MdmsTenantBoundary> getBoundariesByTenantAndHierarchyType(BoundarySearchRequest boundarySearchRequest,RequestInfo requestInfo){
		Long startTime = null;
		Long endTime = null;
		startTime = new Date().getTime();
		List<MdmsTenantBoundary> list= boundaryRepository.getBoundariesByTenantAndHierarchyType(boundarySearchRequest,requestInfo);
		List<MdmsTenantBoundary> list2 = new ArrayList<MdmsTenantBoundary>();
		if(boundarySearchRequest.getHierarchyTypeName() == null || boundarySearchRequest.getHierarchyTypeName().isEmpty()){
			for(MdmsTenantBoundary mdmsBndry: list){
				if(!mdmsBndry.getBoundary().isEmpty()){
					list2.add(mdmsBndry);
				}
			}
			return list2;
		}
		endTime = new Date().getTime();
		LOG.info("TOTAL TIME TAKEN to fetch boundary = "+(endTime - startTime)+"ms");
		return list;
	}
}