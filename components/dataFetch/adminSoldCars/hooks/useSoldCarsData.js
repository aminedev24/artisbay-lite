import { useEffect, useMemo, useRef, useState } from "react";
import { API_BASE } from "../constants";

export const useSoldCarsData = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [expandedCar, setExpandedCar] = useState(null);
  const [mobileDetailsCar, setMobileDetailsCar] = useState(null);
  const [editingCar, setEditingCar] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [removedImages, setRemovedImages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE}/cars/fetchAllSoldCars.php`, {
          credentials: "include",
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || "Failed to fetch cars");
        }

        const result = await response.json();
        if (!result.success) throw new Error(result.error || "Invalid data");

        if (!isMounted) return;

        setCars(
          result.data.map((car) => ({
            ...car,
            image_urls: Array.isArray(car.image_urls) ? car.image_urls : [],
          })) || [],
        );
        setError(null);
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      (editFormData.image_urls || []).forEach((img) => {
        if (img?.preview) URL.revokeObjectURL(img.preview);
      });
    };
  }, [editFormData]);

  const clearFilters = () => {
    setSearchTerm("");
    setStartDate("");
    setEndDate("");
  };

  const filteredCars = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return cars.filter((car) => {
      const invoiceDate = car.invoice_date || "";
      const afterStart = startDate ? invoiceDate >= startDate : true;
      const beforeEnd = endDate ? invoiceDate <= endDate : true;
      const matchesTerm = searchTerm
        ? [
            car.ref_no,
            car.make,
            car.model,
            car.user_name,
            car.customer_name,
          ]
            .filter(Boolean)
            .some((field) => field.toLowerCase().includes(term))
        : true;
      return afterStart && beforeEnd && matchesTerm;
    });
  }, [cars, startDate, endDate, searchTerm]);

  const toggleExpand = (car) => {
    if (typeof window !== "undefined" && window.innerWidth < 800) {
      setMobileDetailsCar(car);
    } else {
      setExpandedCar((prev) => (prev === car.id ? null : car.id));
    }
  };

  const handleEditClick = (car) => {
    setEditingCar(car.id);
    setEditFormData({
      ...car,
      image_urls: Array.isArray(car.image_urls) ? [...car.image_urls] : [],
    });
  };

  const handleCancelEdit = () => {
    setEditingCar(null);
    setRemovedImages([]);
    setSuccessMessage("");
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    (editFormData.image_urls || []).forEach((img) => {
      if (img?.preview) URL.revokeObjectURL(img.preview);
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const newImages = files
      .map((file) => {
        if (!file.type.match("image.*")) {
          setError("Only image files are allowed");
          return null;
        }
        return {
          name: file.name,
          file,
          preview: URL.createObjectURL(file),
        };
      })
      .filter(Boolean);

    setEditFormData((prev) => ({
      ...prev,
      image_urls: [...(prev.image_urls || []), ...newImages],
    }));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (index) => {
    setEditFormData((prev) => {
      const updatedImages = [...(prev.image_urls || [])];
      const removed = updatedImages[index];

      if (typeof removed === "string") {
        setRemovedImages((prevRemoved) => [...prevRemoved, removed]);
      }

      if (removed?.preview) {
        URL.revokeObjectURL(removed.preview);
      }

      updatedImages.splice(index, 1);
      return {
        ...prev,
        image_urls: updatedImages,
      };
    });
  };

  const handleSaveChanges = async () => {
    setError(null);

    try {
      const formData = new FormData();

      Object.entries(editFormData).forEach(([key, value]) => {
        if (key !== "image_urls" && key !== "preview" && value !== undefined) {
          formData.append(key, value);
        }
      });

      const existingImagesToSend = (editFormData.image_urls || [])
        .filter((img) => typeof img === "string")
        .map((img) => (img.startsWith("/uploads/") ? img.substring(1) : img));

      formData.append(
        "existing_images",
        JSON.stringify(existingImagesToSend),
      );
      formData.append("removed_images", JSON.stringify(removedImages));

      const originalCar = cars.find((c) => c.id === editingCar);
      const originalImagesToSend = (originalCar?.image_urls || []).map((img) =>
        img.startsWith("/uploads/") ? img.substring(1) : img,
      );
      formData.append(
        "original_images",
        JSON.stringify(originalImagesToSend),
      );

      (editFormData.image_urls || [])
        .filter((img) => img.file)
        .forEach((img) => {
          formData.append("new_images[]", img.file, img.name);
        });

      const response = await fetch(`${API_BASE}/inventory/cars/updateSoldCar.php`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Update failed");
      }

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setCars((prev) =>
        prev.map((car) =>
          car.id === editingCar
            ? {
                ...editFormData,
                image_urls: data.image_urls || [],
              }
            : car,
        ),
      );

      setEditingCar(null);
      setRemovedImages([]);
      setSuccessMessage("Car updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err.message);
      console.error("Update error:", err);
    }
  };

  return {
    apiBase: API_BASE,
    cars,
    loading,
    error,
    selectedImage,
    setSelectedImage,
    expandedCar,
    toggleExpand,
    mobileDetailsCar,
    setMobileDetailsCar,
    editingCar,
    editFormData,
    handleEditClick,
    handleCancelEdit,
    handleInputChange,
    handleImageUpload,
    handleRemoveImage,
    handleSaveChanges,
    fileInputRef,
    successMessage,
    filteredCars,
    searchTerm,
    setSearchTerm,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    clearFilters,
  };
};
