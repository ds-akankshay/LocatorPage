import * as React from "react";
import { createContext, useEffect, useReducer, Dispatch } from "react";
import { getRuntime } from "@yext/pages/util";
import { LatLong } from "@yext/search-headless-react";
import { deepEqual } from "./util";
import { ProviderProps } from "./AppProvider";

export interface LocationState {
  userLocation?: {
    displayName: string;
    latLong: LatLong;
  };
  checkedLocation?: {
    addressLine1: string;
  };
}

export enum LocationActionType {
  SetLocationState,
  SetUserLocation,
  SetAddressLine1,
  ClearCheckedLocation,
}

export interface SetLocationState {
  type: LocationActionType.SetLocationState;
  payload: LocationState;
}

export interface SetUserLocation {
  type: LocationActionType.SetUserLocation;
  payload: {
    userLocation?: {
      displayName: string;
      latLong: LatLong;
    };
  };
}

export interface SetAddressLine1 {
  type: LocationActionType.SetAddressLine1;
  payload: {
    checkedLocation?: {
      addressLine1: string;
    };
  };
}

export interface ClearCheckedLocation {
  type: LocationActionType.ClearCheckedLocation;
}

export type LocationActions =
  | SetUserLocation
  | SetAddressLine1
  | ClearCheckedLocation
  | SetLocationState;

export const locationReducer = (
  state: LocationState,
  action: LocationActions
): LocationState => {
  switch (action.type) {
    case LocationActionType.SetLocationState:
      return action.payload;
    case LocationActionType.SetUserLocation:
      return { ...state, userLocation: action.payload.userLocation };
    case LocationActionType.SetAddressLine1:
      return { ...state, checkedLocation: action.payload.checkedLocation };
    case LocationActionType.ClearCheckedLocation:
      return { ...state, checkedLocation: undefined };
    default:
      return state;
  }
};

export const LocationContext = createContext<{
  locationState: LocationState;
  dispatch: Dispatch<LocationActions>;
}>({
  locationState: {
    checkedLocation: {
      addressLine1: "ALL",
    },
  },
  dispatch: () => null,
});

const LocationsProvider = ({ children }: ProviderProps) => {
  const [locationState, dispatch] = useReducer(locationReducer, {});

  useEffect(() => {
    if (!getRuntime().isServerSide) {
      const storageState: {
        userLocation?: { displayName: string; latLong: LatLong };
      } = JSON.parse(localStorage.getItem("locationState") || "{}");
      if (storageState) {
        dispatch({
          type: LocationActionType.SetLocationState,
          payload: storageState,
        });
      }
    }
  }, [getRuntime().isServerSide]);

  useEffect(() => {
    if (!getRuntime().isServerSide) {
      if (
        !deepEqual(
          locationState,
          JSON.parse(localStorage.getItem("locationState") || "{}")
        )
      ) {
        localStorage.setItem("locationState", JSON.stringify(locationState));
      }
    }
  }, [locationState]);

  return (
    <LocationContext.Provider value={{ locationState, dispatch }}>
      {children}
    </LocationContext.Provider>
  );
};

export default LocationsProvider;
