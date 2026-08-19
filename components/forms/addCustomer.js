import React, { useState } from 'react';
import Modal from '../common/alertModal';
import { apiBaseUrl } from '../utilities/apiBase';
//import { useUser } from "../user/userContext";

const CustomerRegistrationForm = () => {
  //const { user } = useUser();
  //const [notifyUser, setNotifyUser] = useState(false);

  const [formData, setFormData] = useState({
    customerId: '',
    registrationDate: '',
    customerCategory: '',
    country: '',
    defaultDestination: '',
    customerName: '',
    person1: '',
    person2: '',
    tel1: '',
    tel2: '',
    fax: '',
    hp: '',
    mobile: '',
    income: '',
    autoMail: false,
    kent: false,
    automet: false,
    email1: '',
    email2: '',
    skype: '',
    consignee: '', // new field
    consigneeTel: '', // new field
    consigneeAddress: '', // new field
    consigneePost: '',
    consigneeEmail: '',
    consigneeRut: '',
    notify: '', // new field
    notifyAddress: '' , // new field
    notifyTel : '', //ne field
    notifyPost: '',
    notifyEmail: '',
    notifyRut: '',
    notifyEoriNo: '',
    myaDescription: '',
    comment: '',
    salesStaff: '',
    pod: '',
    registrationStaff: '',
    registrationSource: '',
    leadSource: '',
    other: '',
    notifyUser: false
  });

 const [showModal, setShowModal] = useState(false);
 const [modalMessage, setModalMessage] = useState("");
 const [modalType, setModalType] = useState("");  // e.g., 'alert', 'confirmation', etc.


    const handleCloseModal = () => {
        setShowModal(false);
    };

    const showAlert = (message, type = "alert") => {
        setTimeout(() => {
        setModalMessage(message);
        setModalType(type);
        setShowModal(true);
        }, 1000);

    };
  const apiUrl = apiBaseUrl;

  // Example: fields for the left column (you can create another array for right column if needed)
  const leftFields = [
    { label: "Customer ID", name: "customerId", type: "text" , disabled: true },
    { label: "Registration Date", name: "registrationDate", type: "date", disabled: true },
    { label: "Customer Category", name: "customerCategory", type: "text" },
    { label: "Country", name: "country", type: "text" },
    { label: "Default Destination", name: "defaultDestination", type: "text", disabled: true },
    { label: "Customer Name", name: "customerName", type: "text" },
    { label: "Person 1", name: "person1", type: "text" },
    { label: "Person 2", name: "person2", type: "text" },
    { label: "Tel1", name: "tel1", type: "tel" },
    { label: "Tel2", name: "tel2", type: "tel" },
    { label: "Fax", name: "fax", type: "text" },
    { label: "HP", name: "hp", type: "text" },
    { label: "Mobile", name: "mobile", type: "tel" },
    { label: "Income (other)", name: "Income", type: "text",  disabled: true},
    { label: "Consignee", name: "consignee", type: "text" },
    { label: "Consignee Address", name: "consigneeAddress", type: "text" },
    { label: "Consignee Post", name: "consigneePost", type: "text" },
    { label: "Consignee Email", name: "consigneeEmail", type: "email" },
    { label: "Consignee Tel", name: "consigneeTel", type: "text" },
    { label: "Consignee RUT", name: "consigneeRut", type: "text" },
  ];

  // For checkboxes, you can handle separately or include a flag in your field object.
  const checkboxFields = [
    { label: "Auto Mail", name: "autoMail" },
    { label: "Kent", name: "kent" },
    { label: "Automet", name: "automet" }
  ];

  const rightFields = [
    { label: "E-Mail", name: "email1", type: "email" },
    { label: "E-Mail2", name: "email2", type: "email" },
    { label: "Skype", name: "skype", type: "text" },
    { label: "Notify", name: "notify", type: "text" },
    { label: "Notify Adress", name: "notifyAddress", type: "text" },
    { label: "Notify Post", name: "notifyPost", type: "text" },
    { label: "Notify Tel", name: "notifyTel", type: "text" },
    { label: "Notify Email", name: "notifyEmail", type: "email" },
    { label: "Notify RUT", name: "notifyRut", type: "text" },
    { label: "Notify EORI No", name: "notifyEoriNo", type: "text" },
    { label: "MYA Description", name: "myaDescription", type: "text" },
    { label: "Comment", name: "comment", type: "textarea" },
    { label: "Sales Staff", name: "salesStaff", type: "text" },
    { label: "POD", name: "pod", type: "text", disabled: true },
    { label: "Registration Source", name: "registrationSource", type: "text" },
    { label: "Registration staff", name: "registrationStaff", type: "text" },
    { label: "Lead Source", name: "leadSource", type: "text" },
    { label: "Lead Source Other", name: "leadSourceOther", type: "text" ,disabled: true },
    { label: "Other", name: "other", type: "text" }
  ];

//console.log(rightFields.length);
//console.log(leftFields.length);  

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
  
    try {
      const response = await fetch(`${apiUrl}/customers/addCustomer.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (result.status === 'success') {
        // Handle success (for example, show a success message or reset the form)
        //console.log(result.message);
        setModalType('success');
        showAlert(result.message);
        // Optionally, clear the form:
        handleCancel();
      } else {
        // Handle error response from PHP
        console.error(result.error);
        showAlert(result.error);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      showAlert('An error occurred while adding the customer.');
    }
  };

  const handleCancel = () => {
    // Reset formData to initial state
    setFormData({
      customerId: '',
      registrationDate: '',
      customerCategory: '',
      country: '',
      defaultDestination: '',
      customerName: '',
      person1: '',
      person2: '',
      tel1: '',
      tel2: '',
      fax: '',
      hp: '',
      mobile: '',
      income: '',
      autoMail: false,
      kent: false,
      automet: false,
      email1: '',
      email2: '',
      skype: '',
      consigneePost: '',
      consigneeEmail: '',
      consigneeRut: '',
      notifyPost: '',
      notifyEmail: '',
      notifyRut: '',
      notifyEoriNo: '',
      myaDescription: '',
      comment: '',
      salesStaff: '',
      pod: '',
      registrationSource: '',
      leadSource: '',
      other: '',
      consignee: '',
      notify: '',
      notifyAddress: '',
      notifyTel: '',
      consigneeAddress: '',
      consigneeTel: '',
      registrationStaff: ''
    });
  };


  const populateDummyData = () => {
    const dummyData = {
      customerId: 'CUST123',
      registrationDate: new Date().toISOString().split('T')[0],
      customerCategory: 'Category A',
      country: 'Testland',
      defaultDestination: 'Test Destination',
      customerName: 'Test Customer',
      person1: 'John Doe',
      person2: 'Jane Doe',
      tel1: '1234567890',
      tel2: '0987654321',
      fax: '123-456-789',
      hp: 'HP12345',
      mobile: '9876543210',
      income: 'FOB',
      autoMail: true,
      kent: false,
      automet: true,
      email1: 'test.email1@example.com',
      email2: 'test.email2@example.com',
      skype: 'test.skype',
      consigneePost: '12345',
      consigneeAddress: '123 Consignee St',   // New field
      consigneeEmail: 'consignee@example.com',
      consigneeRut: 'RUT12345',
      notifyPost: '54321',
      notifyAddress: '456 Notify Ave',         // New field
      notifyEmail: 'notify@example.com',
      notifyRut: 'RUT54321',
      notifyEoriNo: 'EORI12345',
      myaDescription: 'This is a test MYA description',
      comment: 'This is a test comment',
      salesStaff: 'Sales Test',
      pod: 'Test POD',
      registrationSource: 'Website',
      leadSource: 'Online Ad',
      other: 'Test Other',
      consignee: 'test.consignee',
      notify: 'test.notify',
      notifyTel: 'test.notifyTel',
      consigneeTel:'test.consigneeTel',
      registrationStaff : 'test.registratioStaff'
    };
  
    setFormData(dummyData);
   
  };
  
  

  return (
    <form onSubmit={handleSubmit} className="formContainer">
        {showModal && (
            <Modal
            message={modalMessage}
            onClose={handleCloseModal}
            type={modalType}
            />
        )}
      <h2 className="heading">Customer Registration</h2>
      
      <div className="columns">
        {/* Left Column */}
        <div className="column">
          {leftFields.map((field, index) => (
            <div className="formRow" key={index}>
                {console.log(field.name)}
              <label className="formLabel" htmlFor={field.name}>{field.label}:</label>
              {field.type === 'textarea' ? (
                <textarea
                  className="formInput"
                  id={field.name}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  disabled = {field.disabled}
                />
              ) : (
                <input
                  className="formInput"
                  id={field.name}
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  disabled = {field.disabled}
                  
                  
                />
              )}
            </div>
          ))}
          
          {/* Render checkboxes on the left column 
          <div className="checkboxRow">
            {checkboxFields.map((field, index) => (
            
              <label className="checkboxLabel" key={index}>
                <input
                  className="checkbox"
                  type="checkbox"
                  name={field.name}
                  checked={formData[field.name]}
                  onChange={handleChange}
                />
                {field.label}
              </label>
              
            ))}
          </div>
          */}
        </div>

        {/* Right Column */}
        <div className="column">
          {rightFields.map((field, index) => (
        
            <div className="formRow" key={index}>
              <label className="formLabel" htmlFor={field.name}>{field.label}:</label>
              
              {field.type === 'textarea' ? (
                <textarea
                  className="formInput"
                  id={field.name}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  disabled = {field.disabled}
                />
              ) : (
                <input
                  className="formInput"
                  id={field.name}
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  disabled = {field.disabled}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="form-group">
      <label>
        <input
          name='notifyUser'
          type="checkbox"
          checked={formData.notifyUser}
          onChange={handleChange}
          />
        &nbsp; Notify customer by email
      </label>
    </div>


      <div className="buttonContainer">
        <button type="submit" className="button">Update</button>
        <button type="button" className="cancelButton" onClick={handleCancel}>Cancel</button>
        <button type="button" onClick={populateDummyData}>Fill with Dummy Data</button>

        {/*{user && user?.role == 'admin' && (user?.name == 'jacob' || 'abdennour') &&
         <button type="button" onClick={populateDummyData}>Fill with Dummy Data</button>
         }*/}
        
      </div>
    </form>
  );
};

export default CustomerRegistrationForm;