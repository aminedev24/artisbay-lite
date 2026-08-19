"use client";

import React from "react";
import useStockList from "./useStockList";
import {
  Sidebar, FilterForm, ActiveFilterTags,
  SortControls, CarGrid, Pagination,
} from "./stockSections";

const Stocklist = () => {
  const {
    allCars, loading, viewLoading, searchTerm, setSearchTerm, page,
    sortBy, sortedCars, paginatedCars, totalPages, visiblePageNumbers,
    availableMakes, availableBodyTypes, heroStats, hasActiveFilters,
    numberFormatter, imgBasePath, carsPerPage, skeletonCount,
    renderSkeletonCard, filters, activeFilterTags,
    handleViewDetails, handleCarClick, handleRequestInvoice,
    handleSearchSubmit, handleResetFilters, handleFilterChange,
    clearFilter, clearAllFilters, handleQuickFilter,
    goToPage, handlePageSizeChange, handleSortChange, setSortBy,
  } = useStockList();

  return (
    <div className="stock-room flex-1 bg-gray-50 min-h-screen">
      <div className="max-w-[1440px] mx-auto px-5 py-5 flex gap-5 items-start">
        <Sidebar
          filters={filters}
          onFilterChange={handleFilterChange}
          onQuickFilter={handleQuickFilter}
          availableMakes={availableMakes}
          availableBodyTypes={availableBodyTypes}
          allCars={allCars}
        />
        <main className="flex-1 min-w-0">

          {/* Filter Form */}
          <FilterForm
            filters={filters}
            onFilterChange={handleFilterChange}
            onSearchSubmit={handleSearchSubmit}
            onReset={handleResetFilters}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            dynamicOptions={{
              makes: ['All Makes', ...availableMakes],
              models: ['All Models'],
              bodyTypes: ['All Types', ...availableBodyTypes],
              fuels: ['All', 'Gasoline', 'Diesel', 'Hybrid', 'Electric'],
              years: ['Any', ...Array.from({ length: 27 }, (_, i) => String(2026 - i))],
            }}
          />

          {/* Active Filter Tags */}
          <ActiveFilterTags
            tags={activeFilterTags}
            onClearFilter={clearFilter}
            onClearAll={clearAllFilters}
            hasFilters={hasActiveFilters}
          />

          {/* Sort + Page Size Controls */}
          <SortControls
            sortBy={sortBy}
            onSortChange={handleSortChange}
            carsPerPage={carsPerPage}
            onPageSizeChange={handlePageSizeChange}
            totalPages={totalPages}
            page={page}
            totalCars={sortedCars.length}
          />

          {/* Car Grid */}
          <CarGrid
            viewLoading={viewLoading}
            paginatedCars={paginatedCars}
            allCars={allCars}
            skeletonCount={skeletonCount}
            renderSkeletonCard={renderSkeletonCard}
            onCarClick={handleCarClick}
            onRequestInvoice={handleRequestInvoice}
          />

          {/* Pagination */}
          <Pagination
            page={page}
            totalPages={totalPages}
            visiblePageNumbers={visiblePageNumbers}
            onGoToPage={goToPage}
          />
        </main>
      </div>
    </div>
  );
};

export default Stocklist;
