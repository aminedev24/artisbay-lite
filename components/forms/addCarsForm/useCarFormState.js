import { useEffect, useMemo, useState } from 'react';

import {
  DEFAULT_COSTS,
  DEFAULT_FORM_DATA,
  SAMPLE_COSTS,
  SAMPLE_FORM_DATA,
  USER_PREFILLS,
} from './constants';
import {
  buildApiUrl,
  calculateFob,
  calculatePayloadTax,
  calculateTaxDisplay,
  numeric,
} from './helpers';

export const useCarFormState = () => {
  const apiUrl = buildApiUrl();

  const [images, setImages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('');
  const [carType, setCarType] = useState('stock');
  const [costs, setCosts] = useState(() => ({ ...DEFAULT_COSTS }));
  const [freight, setFreight] = useState('');
  const [discount, setDiscount] = useState('');
  const [mainCurrency, setMainCurrency] = useState('USD');
  const [userOptions, setUserOptions] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState(() => ({ ...DEFAULT_FORM_DATA }));

  const taxDisplay = useMemo(() => calculateTaxDisplay(costs), [costs]);
  const fob = useMemo(() => calculateFob(costs), [costs]);

  const baseValue =
    carType === 'stock' && formData.price !== '' ? numeric(formData.price) : fob;

  const finalValue = useMemo(
    () => baseValue + numeric(freight) - numeric(discount),
    [baseValue, freight, discount]
  );

  useEffect(() => {
    fetch(`${apiUrl}/users/getUsers.php`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          setUserOptions(
            data.data.map((user) => ({
              value: user.id,
              label: user.label || user.full_name || user.customer_name,
              type: user.type,
              ...user,
            }))
          );
        }
      })
      .catch(() => {
        /* silently ignore for now */
      });
  }, [apiUrl]);

  useEffect(() => {
    if (!selectedUser) return;

    const resolvedLabel =
      (selectedUser.label || selectedUser.full_name || selectedUser.customer_name || '').trim();

    if (!resolvedLabel) return;

    const prefill = USER_PREFILLS[resolvedLabel.toLowerCase()];

    setFormData((prev) => {
      const phoneFromUser =
        selectedUser.phone ??
        selectedUser.customer_phone ??
        selectedUser.contact ??
        selectedUser.contact_number ??
        null;

      const addressFromUser =
        selectedUser.address ?? selectedUser.customer_address ?? selectedUser.location ?? null;

      const companyFromUser =
        selectedUser.company ?? selectedUser.customer_company ?? selectedUser.business_name ?? null;

      const baseUpdates = {
        user_name: resolvedLabel || prev.user_name,
        phone: phoneFromUser ?? prev.phone,
        address: addressFromUser ?? prev.address,
        company: companyFromUser ?? prev.company,
      };

      if (prefill?.formData) {
        return { ...prev, ...baseUpdates, ...prefill.formData };
      }

      return { ...prev, ...baseUpdates };
    });

    if (prefill?.freight !== undefined) setFreight(prefill.freight);
    if (prefill?.discount !== undefined) setDiscount(prefill.discount);
  }, [selectedUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onCostChange = (key) => (val) =>
    setCosts((prev) => ({
      ...prev,
      [key]: val,
    }));

  const populateForm = () => {
    setFormData({ ...SAMPLE_FORM_DATA });
    setCosts({ ...SAMPLE_COSTS });
    setFreight('');
    setDiscount('');
  };

  const handleImagesChange = (e) => setImages([...e.target.files]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrlsArray = [];

    if (images.length > 0) {
      const fd = new FormData();
      images.forEach((img) => fd.append('images[]', img));
      fd.append('refNo', formData.refNo);
      fd.append('make', formData.make);
      fd.append('model', formData.model);

      const imgRes = await fetch(`${apiUrl}/inventory/cars/upload_car_images.php`, { method: 'POST', body: fd });
      const imgData = await imgRes.json();
      if (imgRes.ok && imgData.image_urls) {
        imageUrlsArray = imgData.image_urls;
      } else {
        alert('Failed to upload images: ' + (imgData.messages || ''));
        return;
      }
    }

    const userNameFromSelection = selectedUser
      ? selectedUser.label ||
        selectedUser.full_name ||
        selectedUser.customer_name ||
        formData.user_name
      : formData.user_name;

    const userIdFromSelection = selectedUser
      ? selectedUser.id ?? selectedUser.value ?? null
      : null;

    const payload = {
      ...formData,
      image_urls: JSON.stringify(imageUrlsArray),
      freight,
      discount,
      final_value: finalValue,
      fob,
      mainCurrency,
      targetTable: carType === 'sold' ? 'cars_inventory' : 'cars_stock',
      user_name: userNameFromSelection || formData.user_name,
      user_id: userIdFromSelection,
      ...costs,
      tax: calculatePayloadTax(costs),
    };

    try {
      const res = await fetch(`${apiUrl}/inventory/cars/submit_car.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include',
      });
      const text = await res.text();
      if (!res.ok) {
        alert('Failed to save car data: ' + text);
        return;
      }
      alert('Car data and images submitted successfully!');
    } catch (err) {
      console.error(err);
      alert('Network error. Please try again later.');
    }
  };

  return {
    images,
    showModal,
    modalMessage,
    modalType,
    carType,
    setCarType,
    costs,
    freight,
    discount,
    mainCurrency,
    setMainCurrency,
    userOptions,
    selectedUser,
    setSelectedUser,
    formData,
    fob,
    finalValue,
    handleChange,
    handleSubmit,
    onCostChange,
    populateForm,
    handleImagesChange,
    setFreight,
    setDiscount,
    setFormData,
    setCosts,
    setImages,
    taxDisplay,
    setShowModal,
    setModalMessage,
    setModalType,
  };
};
