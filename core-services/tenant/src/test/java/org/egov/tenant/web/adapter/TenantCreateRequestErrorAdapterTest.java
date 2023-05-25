package org.egov.tenant.web.adapter;

import org.egov.common.contract.response.ErrorField;
import org.egov.common.contract.response.ErrorResponse;
import org.egov.tenant.domain.model.City;
import org.egov.tenant.domain.model.Tenant;
import org.egov.tenant.domain.model.TenantType;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class TenantCreateRequestErrorAdapterTest {

    @Mock
    private Tenant tenant;

    @Mock
    private City city;

    private TenantCreateRequestErrorAdapter errorAdapter;

    @Before
    public void setUp() {
        errorAdapter = new TenantCreateRequestErrorAdapter();
        when(tenant.getCity()).thenReturn(city);
    }

    @Test
    public void test_should_set_error_when_code_is_missing() {
        when(tenant.isCodeAbsent()).thenReturn(true);


        final ErrorResponse errorResponse = errorAdapter.adapt(tenant);

        final List<ErrorField> errorFields = errorResponse.getError().getFields();

        assertThat(errorFields.size()).isEqualTo(1);
        assertThat(errorFields.get(0).getCode()).isEqualTo("core-tenant.TENANT_CODE_MANDATORY");
        assertThat(errorFields.get(0).getField()).isEqualTo("code");
        assertThat(errorFields.get(0).getMessage()).isEqualTo("Tenant code is required");
    }

    @Test
    public void test_should_set_error_when_code_length_is_invalid() {
        when(tenant.isCodeAbsent()).thenReturn(false);
        when(tenant.isCodeOfInvalidLength()).thenReturn(true);

        final ErrorResponse errorResponse = errorAdapter.adapt(tenant);

        final List<ErrorField> errorFields = errorResponse.getError().getFields();

        assertThat(errorFields.size()).isEqualTo(1);
        assertThat(errorFields.get(0).getCode()).isEqualTo("core-tenant.TENANT_CODE_LENGTH");
        assertThat(errorFields.get(0).getField()).isEqualTo("code");
        assertThat(errorFields.get(0).getMessage()).isEqualTo("Tenant code should be less than 256 characters");
    }

    @Test
    public void test_should_set_error_when_image_id_is_absent() {
        when(tenant.isImageIdAbsent()).thenReturn(true);

        final ErrorResponse errorResponse = errorAdapter.adapt(tenant);

        final List<ErrorField> errorFields = errorResponse.getError().getFields();

        assertThat(errorFields.size()).isEqualTo(1);
        assertThat(errorFields.get(0).getCode()).isEqualTo("core-tenant.TENANT_MISSING_IMAGE_ID");
        assertThat(errorFields.get(0).getField()).isEqualTo("imageId");
        assertThat(errorFields.get(0).getMessage()).isEqualTo("imageId is required");
    }

    @Test
    public void test_should_set_error_when_logo_id_is_absent() {
        when(tenant.isLogoIdAbsent()).thenReturn(true);

        final ErrorResponse errorResponse = errorAdapter.adapt(tenant);

        final List<ErrorField> errorFields = errorResponse.getError().getFields();

        assertThat(errorFields.size()).isEqualTo(1);
        assertThat(errorFields.get(0).getCode()).isEqualTo("core-tenant.TENANT_MISSING_LOGO_ID");
        assertThat(errorFields.get(0).getField()).isEqualTo("logoId");
        assertThat(errorFields.get(0).getMessage()).isEqualTo("logoId is required");
    }

    @Test
    public void test_should_set_error_when_type_is_absent() {
        when(tenant.isTypeAbsent()).thenReturn(true);

        final ErrorResponse errorResponse = errorAdapter.adapt(tenant);

        final List<ErrorField> errorFields = errorResponse.getError().getFields();

        assertThat(errorFields.size()).isEqualTo(1);
        assertThat(errorFields.get(0).getCode()).isEqualTo("core-tenant.TENANT_MISSING_TYPE");
        assertThat(errorFields.get(0).getField()).isEqualTo("type");
        assertThat(errorFields.get(0).getMessage()).isEqualTo("type is required");
    }

    @Test
    public void test_should_set_error_when_type_is_invalid() {
        when(tenant.isTypeAbsent()).thenReturn(false);
        when(tenant.isTypeInvalid()).thenReturn(true);

        final ErrorResponse errorResponse = errorAdapter.adapt(tenant);

        final List<ErrorField> errorFields = errorResponse.getError().getFields();

        assertThat(errorFields.size()).isEqualTo(1);
        assertThat(errorFields.get(0).getCode()).isEqualTo("core-tenant.TENANT_INVALID_TYPE");
        assertThat(errorFields.get(0).getField()).isEqualTo("type");
        assertThat(errorFields.get(0).getMessage()).isEqualTo("type is invalid");
    }

    @Test
    public void test_should_set_error_when_city_is_absent() {
        when(tenant.isCityAbsent()).thenReturn(true);

        final ErrorResponse errorResponse = errorAdapter.adapt(tenant);

        final List<ErrorField> errorFields = errorResponse.getError().getFields();

        assertThat(errorFields.size()).isEqualTo(1);
        assertThat(errorFields.get(0).getCode()).isEqualTo("core-tenant.TENANT_MISSING_CITY");
        assertThat(errorFields.get(0).getField()).isEqualTo("city");
        assertThat(errorFields.get(0).getMessage()).isEqualTo("city is required");
    }

    @Test
    public void test_should_set_error_when_city_name_is_absent() {
        when(tenant.getType()).thenReturn(TenantType.CITY);
        when(tenant.getCity()).thenReturn(city);
        when(tenant.isCityAbsent()).thenReturn(false);
        when(city.isNameAbsent()).thenReturn(true);

        final ErrorResponse errorResponse = errorAdapter.adapt(tenant);

        final List<ErrorField> errorFields = errorResponse.getError().getFields();

        assertThat(errorFields.size()).isEqualTo(1);
        assertThat(errorFields.get(0).getCode()).isEqualTo("core-tenant.TENANT_MISSING_CITY_NAME");
        assertThat(errorFields.get(0).getField()).isEqualTo("city.name");
        assertThat(errorFields.get(0).getMessage()).isEqualTo("city.name is required");
    }

    @Test
    public void test_should_set_error_when_ulb_grade_is_absent() {
        when(tenant.getType()).thenReturn(TenantType.CITY);
        when(tenant.getCity()).thenReturn(city);
        when(tenant.isCityAbsent()).thenReturn(false);
        when(city.isULBGradeAbsent()).thenReturn(true);

        final ErrorResponse errorResponse = errorAdapter.adapt(tenant);

        final List<ErrorField> errorFields = errorResponse.getError().getFields();

        assertThat(errorFields.size()).isEqualTo(1);
        assertThat(errorFields.get(0).getCode()).isEqualTo("core-tenant.TENANT_MISSING_ULB_GRADE");
        assertThat(errorFields.get(0).getField()).isEqualTo("city.ulbGrade");
        assertThat(errorFields.get(0).getMessage()).isEqualTo("city.ulbGrade is required");
    }
}