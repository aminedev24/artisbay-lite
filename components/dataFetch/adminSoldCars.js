 import React from "react";
import EditSoldCarModal from "./adminSoldCars/components/EditSoldCarModal";
import ImagePreviewModal from "./adminSoldCars/components/ImagePreviewModal";
import MobileDetailsModal from "./adminSoldCars/components/MobileDetailsModal";
import SoldCarFilters from "./adminSoldCars/components/SoldCarFilters";
import SoldCarsMobileCards from "./adminSoldCars/components/SoldCarsMobileCards";
import SoldCarsTable from "./adminSoldCars/components/SoldCarsTable";
import { useSoldCarsData } from "./adminSoldCars/hooks/useSoldCarsData";

const AdminSoldCars = () => {
  const {
    loading,
    error,
    successMessage,
    filteredCars,
    searchTerm,
    setSearchTerm,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    clearFilters,
    expandedCar,
    toggleExpand,
    handleEditClick,
    handleCancelEdit,
    handleInputChange,
    handleImageUpload,
    handleRemoveImage,
    handleSaveChanges,
    editFormData,
    editingCar,
    fileInputRef,
    selectedImage,
    setSelectedImage,
    mobileDetailsCar,
    setMobileDetailsCar,
  } = useSoldCarsData();

  const hasCars = filteredCars.length > 0;

  const handlePreviewImage = ({ images = [], index = 0 } = {}) => {
    if (!images.length) return;
    setSelectedImage({ images, index });
  };

  return (
    <div className="px-4 py-8 sm:px-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
            Dashboard
          </p>
          <h1 className="text-3xl font-semibold text-slate-900">
            Sold Cars Management
          </h1>
        </div>
      </div>

      {successMessage && (
        <div className="mb-4 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700 shadow-sm shadow-emerald-100">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-xl bg-rose-50 p-4 text-sm text-rose-700 shadow-sm shadow-rose-100">
          {error}
        </div>
      )}

      <SoldCarFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        startDate={startDate}
        onStartDateChange={setStartDate}
        endDate={endDate}
        onEndDateChange={setEndDate}
        onClear={clearFilters}
      />

      {loading ? (
        <p className="text-center text-slate-500">Loading cars...</p>
      ) : !hasCars ? (
        <p className="text-center text-slate-500">No sold cars found.</p>
      ) : (
        <>
          <div className="hidden md:block">
            <SoldCarsTable
              cars={filteredCars}
              expandedCar={expandedCar}
              onToggleExpand={toggleExpand}
              onEdit={handleEditClick}
              onSelectImage={handlePreviewImage}
            />
          </div>
          <div className="md:hidden">
            <SoldCarsMobileCards
              cars={filteredCars}
              expandedCar={expandedCar}
              onToggleExpand={toggleExpand}
              onEdit={handleEditClick}
              onSelectImage={handlePreviewImage}
            />
          </div>
        </>
      )}

      <EditSoldCarModal
        editFormData={editFormData}
        editingCar={editingCar}
        fileInputRef={fileInputRef}
        onClose={handleCancelEdit}
        onInputChange={handleInputChange}
        onImageUpload={handleImageUpload}
        onRemoveImage={handleRemoveImage}
        onSubmit={handleSaveChanges}
      />

      <ImagePreviewModal
        selection={selectedImage}
        onClose={() => setSelectedImage(null)}
      />

      <MobileDetailsModal
        car={mobileDetailsCar}
        onClose={() => setMobileDetailsCar(null)}
      />
    </div>
  );
};

export default AdminSoldCars;
