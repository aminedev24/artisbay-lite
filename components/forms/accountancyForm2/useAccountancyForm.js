import { useState, useEffect } from 'react';
import { apiBaseUrl } from '../../utilities/apiBase';

const useAccountancyForm = () => {
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');
  const [remitter, setRemitter] = useState('');
  const [country, setCountry] = useState('');
  const [consumptionType, setConsumptionType] = useState('car');
  const [consumptionValue, setConsumptionValue] = useState('');
  const [swiftDetails, setSwiftDetails] = useState('');
  const [note, setNote] = useState('');
  const [staff, setStaff] = useState('');
  const [currencies] = useState(['JPY', 'USD', 'EUR']);
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("alert");
  const [bankFees, setBankFees] = useState(0);
  const [editingCurrency, setEditingCurrency] = useState(null);
  const [conversionEdits, setConversionEdits] = useState({});
  const [cars, setCars] = useState([]);
  const [conversionRates, setConversionRates] = useState({
    JPY: 1,
    USD: 147.12,
    EUR: 159.83,
  });
  const [editingRate, setEditingRate] = useState(null);
  const [rateEdits, setRateEdits] = useState({});

  const apiUrl = apiBaseUrl;

  useEffect(() => {
    fetch(`${apiUrl}/inventory/cars/getSoldCars.php`, {
      credentials: "include",
    })
      .then(response => response.json())
      .then(data => setCars(data))
      .catch(error => console.error("Error fetching sold cars:", error));

    fetch(`${apiUrl}/users/getUsers.php`)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'success') {
          const combinedUsers = data.data.map((item) => ({
            id: item.id,
            full_name: item.full_name || item.customer_name,
          }));
          setUsers(combinedUsers);
          setSelectedUserId(combinedUsers[0]?.id.toString() || 'new');
        }
      })
      .catch((error) => console.error('Error fetching users:', error));
  }, [apiUrl]);

  const getConvertedAmount = (targetCurrency) => {
    if (!amount) return 0;
    return amount * (conversionRates[selectedCurrency] / conversionRates[targetCurrency]);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const showAlert = (message, type = "alert") => {
    setModalMessage(message);
    setModalType(type);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (consumptionType === 'car') {
      const stockId = consumptionValue;
      const matchedCar = cars.find(car =>
        car.stock_id?.toLowerCase() === stockId?.toLowerCase()
      );
      if (matchedCar && Number(amount) > Number(matchedCar.price)) {
        showAlert(`Amount exceeds car price (${Number(matchedCar.price).toLocaleString()})`);
        return;
      }
    }

    const conversions = {};
    const rates = {};
    currencies.forEach((currency) => {
      if (currency !== selectedCurrency) {
        conversions[currency] = conversionEdits[currency] !== undefined
          ? Number(conversionEdits[currency])
          : getConvertedAmount(currency);
        rates[currency] = conversionRates[currency];
      }
    });

    const formData = {
      date,
      amount: Number(amount),
      remitter,
      country,
      consumptionType,
      consumptionValue,
      selectedCurrency,
      conversions,
      rates,
      swiftDetails,
      note,
      bankFees: Number(bankFees),
      staff,
      user_id: selectedUserId !== 'new' ? selectedUserId : null,
      new_user: selectedUserId === 'new' ? newUserName : null
    };

    try {
      const response = await fetch(`${apiUrl}/finance/deposits/insertDeposit.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include',
      });
      const result = await response.json();
      showAlert(result.message);
      resetForm();
    } catch (error) {
      showAlert('Submission failed: ' + error.message);
    }
  };

  const resetForm = () => {
    setDate('');
    setAmount('');
    setRemitter('');
    setCountry('');
    setConsumptionType('car');
    setConsumptionValue('');
    setSwiftDetails('');
    setNote('');
    setStaff('');
    setSelectedCurrency(currencies[0]);
    setSelectedUserId(users[0]?.id || 'new');
    setNewUserName('');
    setBankFees(0);
    setConversionEdits({});
  };

  const formatDynamicNumber = (value) => {
    const numValue = Number(value);
    if (isNaN(numValue)) return '0';
    let fractionDigits = numValue < 1 ? 4 :
      numValue < 10 ? 3 :
        numValue < 100 ? 2 :
          numValue < 1000 ? 1 : 0;
    return new Intl.NumberFormat(undefined, {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    }).format(numValue);
  };

  return {
    date, setDate,
    amount, setAmount,
    remitter, setRemitter,
    country, setCountry,
    consumptionType, setConsumptionType,
    consumptionValue, setConsumptionValue,
    swiftDetails, setSwiftDetails,
    note, setNote,
    staff, setStaff,
    currencies,
    selectedCurrency, setSelectedCurrency,
    users,
    selectedUserId, setSelectedUserId,
    newUserName, setNewUserName,
    showModal, modalMessage, modalType,
    bankFees, setBankFees,
    editingCurrency, setEditingCurrency,
    conversionEdits, setConversionEdits,
    cars,
    conversionRates, setConversionRates,
    editingRate, setEditingRate,
    rateEdits, setRateEdits,
    apiUrl,
    getConvertedAmount,
    handleCloseModal,
    showAlert,
    handleSubmit,
    resetForm,
    formatDynamicNumber,
  };
};

export default useAccountancyForm;
