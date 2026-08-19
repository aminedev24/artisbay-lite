// useFavorites.js — shared favorites store (module-level singleton).
// One fetch of auth/getFavorites.php serves every card / details page that
// subscribes, so the stock grid doesn't fire a request per vehicle. Hearts
// update instantly via optimistic toggles.

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { useUser } from "../user/userContext";
import { apiBaseUrl } from "../utilities/apiBase";
import { csrfFetch } from "../utilities/csrfToken";

const EMPTY = { loaded: false, loading: false, error: null, refs: new Set(), vehicles: [] };

let state = { ...EMPTY };
let userKey = null;

const listeners = new Set();
const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
const emit = () => listeners.forEach((listener) => listener());
const getSnapshot = () => state;

const reset = () => {
  state = { ...EMPTY };
  userKey = null;
  emit();
};

async function loadFavorites() {
  if (state.loading) return;
  state = { ...state, loading: true, error: null };
  emit();
  try {
    const response = await fetch(`${apiBaseUrl}/auth/getFavorites.php`, { credentials: "include" });
    const data = await response.json();
    const vehicles = Array.isArray(data.vehicles) ? data.vehicles : [];
    state = {
      ...state,
      loaded: true,
      loading: false,
      vehicles,
      refs: new Set(vehicles.map((v) => String(v.ref_no || "").trim()).filter(Boolean)),
    };
  } catch (err) {
    state = { ...state, loaded: true, loading: false, error: err };
  }
  emit();
}

const snapshotOf = (vehicle) => {
  let image = "";
  const rawImage = vehicle?.image_urls || vehicle?.images;
  if (Array.isArray(rawImage)) {
    image = rawImage[0] || "";
  } else if (typeof rawImage === "string") {
    try {
      const parsed = JSON.parse(rawImage);
      image = Array.isArray(parsed) && parsed.length ? parsed[0] : rawImage;
    } catch (err) {
      image = rawImage;
    }
  }
  return {
    make: vehicle?.make || "",
    model: vehicle?.model || "",
    year: vehicle?.year || "",
    price: Number(vehicle?.price) > 0 ? Number(vehicle?.price) : 0,
    currency: vehicle?.currency || "USD",
    image,
  };
};

// Toggles a vehicle in the favorites list. Resolves true on success.
// Returns { redirect } = true when the user must log in first.
export function toggleFavorite(vehicle, currentRefs = state.refs) {
  const ref = String(vehicle?.ref_no || vehicle?.ref || "").trim();
  if (!ref) return Promise.resolve({ ok: false });

  const isFavorite = currentRefs.has(ref);
  const prevRefs = state.refs;
  const nextRefs = new Set(prevRefs);
  if (isFavorite) {
    nextRefs.delete(ref);
  } else {
    nextRefs.add(ref);
  }
  state = { ...state, refs: nextRefs };
  emit();

  const endpoint = isFavorite ? "removeFavorite.php" : "addFavorite.php";
  const body = JSON.stringify(isFavorite ? { ref } : { ref, ...snapshotOf(vehicle) });

  return csrfFetch(`${apiBaseUrl}/auth/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data?.status !== "success") {
        state = { ...state, refs: prevRefs };
        emit();
        return { ok: false };
      }
      return { ok: true, added: !isFavorite };
    })
    .catch(() => {
      state = { ...state, refs: prevRefs };
      emit();
      return { ok: false };
    });
}

// Removes a saved vehicle by ref (used by the Saved Vehicles profile tab).
export function removeFavorite(ref) {
  const prevRefs = state.refs;
  const nextRefs = new Set(prevRefs);
  nextRefs.delete(String(ref).trim());
  state = { ...state, refs: nextRefs, vehicles: state.vehicles.filter((v) => String(v.ref_no) !== String(ref)) };
  emit();

  return csrfFetch(`${apiBaseUrl}/auth/removeFavorite.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ref }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data?.status !== "success") {
        state = { ...state, refs: prevRefs };
        emit();
        return false;
      }
      return true;
    })
    .catch(() => {
      state = { ...state, refs: prevRefs };
      emit();
      return false;
    });
}

// Clears the store on logout / user switch.
export function useFavorites() {
  const { user } = useUser();
  const key = user?.id ? `u${user.id}` : "";

  useEffect(() => {
    if (!user) {
      reset();
      return;
    }
    if (key !== userKey) {
      reset();
      userKey = key;
    }
    if (!state.loaded && !state.loading) {
      loadFavorites();
    }
  }, [user, key]);

  const isFavorite = useCallback(
    (ref) => state.refs.has(String(ref || "").trim()),
    []
  );

  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return { ...snapshot, isFavorite };
}
