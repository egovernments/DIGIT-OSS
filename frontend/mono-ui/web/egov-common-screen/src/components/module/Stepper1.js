import React, { useState } from 'react';
//import './stepper-style.css';

function StepOneForm() {
  // ... other code remains the same ...
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    financialYear: '',
    applicationType: '',
    oldLicenseNumber: '',
    licenseType: '',
    nameOfTrade: '',
    structureType: '',
    structureSubtype: '',
    tradeCommencementDate: '',
    tradeGstNumber: '',
    operationalArea: '',
    numberOfEmployees: '',
    occupancyType: '',
  });
  const [errors, setErrors] = useState({});

  // Data for dropdown lists (replace with your actual data)
  const financialYears = ['2022-2023', '2023-2024', '2024-2025'];
  const applicationTypes = ['New Application', 'Renewal'];
  const licenseTypes = ['Shop Establishment License', 'Restaurant License'];
  const structureTypes = ['Individual Structure', 'Multiple Structures'];
  const structureSubtypes = ['Commercial Building', 'Residential Building'];
  const occupancyTypes = ['Owned', 'Rented', 'Leased'];

  const handleNext = () => {
    // Perform validation before proceeding
    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setActiveStep(activeStep + 1);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Add your specific validation logic here
    // Example: check required fields, email format, number ranges, etc.
    if (!formData.financialYear) {
      newErrors.financialYear = 'Please select a financial year.';
    }
    if (!formData.applicationType) {
      newErrors.applicationType = 'Please select an application type.';
    }
    if (!formData.nameOfTrade) {
      newErrors.nameOfTrade = 'Please enter the name of your trade.';
    }
    // Add validation for other fields as needed

    return newErrors;
  };

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Stepper header */}
      <h2>Step 1: Trade Details</h2>

      {/* Fields */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {/* ... existing fields for financialYear, applicationType, and oldLicenseNumber ... */}

        <label htmlFor="licenseType">License Type:</label>
        <select
          id="licenseType"
          name="licenseType"
          value={formData.licenseType}
          onChange={handleChange}
          style={{ border: '1px solid #ccc', padding: '0.5rem' }}
        >
          <option value="">Select</option>
          {licenseTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <label htmlFor="nameOfTrade">Name of Trade:</label>
        <input
          id="nameOfTrade"
          name="nameOfTrade"
          value={formData.nameOfTrade}
          onChange={handleChange}
          style={{ border: '1px solid #ccc', padding: '0.5rem' }}
        />

        <label htmlFor="structureType">Structure Type:</label>
        <select
          id="structureType"
          name="structureType"
          value={formData.structureType}
          onChange={handleChange}
          style={{ border: '1px solid #ccc', padding: '0.5rem' }}
        >
          <option value="">Select</option>
          {structureTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <label htmlFor="structureSubtype">Structure Subtype:</label>
        <select
          id="structureSubtype"
          name="structureSubtype"
          value={formData.structureSubtype}
          onChange={handleChange}
          style={{ border: '1px solid #ccc', padding: '0.5rem' }}
        >
          <option value="">Select</option>
          {structureSubtypes.map((subtype) => (
            <option key={subtype} value={subtype}>
              {subtype}
            </option>
          ))}
        </select>

        <label htmlFor="tradeCommencementDate">Trade Commencement Date:</label>
        <input
          type="date"
          id="tradeCommencementDate"
          name="tradeCommencementDate"
          value={formData.tradeCommencementDate}
          onChange={handleChange}
          style={{ border: '1px solid #ccc', padding: '0.5rem' }}
        />

        <label htmlFor="tradeGstNumber">Trade GST Number:</label>
        <input
          id="tradeGstNumber"
          name="tradeGstNumber"
          value={formData.tradeGstNumber}
          onChange={handleChange}
          style={{ border: '1px solid #ccc', padding: '0.5rem' }}
        />

        <label htmlFor="operationalArea">Operational Area:</label>
        <input
          id="operationalArea"
          name="operationalArea"
          value={formData.operationalArea}
          onChange={handleChange}
          style={{ border: '1px solid #ccc', padding: '0.5rem' }}
        />

        <label htmlFor="numberOfEmployees">Number of Employees:</label>
        <input
          type="number"
          id="numberOfEmployees"
          name="numberOfEmployees"
          value={formData.numberOfEmployees}
          onChange={handleChange}
          style={{ border: '1'}}/>
          </div>
          </div>)}

          export default StepOneForm;
