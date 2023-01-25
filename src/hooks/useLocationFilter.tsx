import {
  useSearchActions,
  Matcher,
  useSearchState,
} from "@yext/search-headless-react";
import { useContext, useEffect } from "react";
import { LocationContext } from "../components/providers/LocationsProvider";

export const useLocationFilter = () => {
  const searchActions = useSearchActions();
  const filters = useSearchState((state) => state.filters.static);
  const { locationState } = useContext(LocationContext);

  const executeLocationFilterSearch = () => {
    const filteredFilters =
      filters?.filter(
        (f) =>
          f.filter.kind === "fieldValue" &&
          f.filter.fieldId !== "c_soldAt.address.line1"
      ) ?? [];

    const triggerSearch = () => {
      searchActions.setStaticFilters(filteredFilters);
      searchActions.executeVerticalQuery();
    };

    if (locationState?.checkedLocation) {
      if (locationState.checkedLocation?.addressLine1 !== "ALL") {
        filteredFilters.push(...filteredFilters, {
          selected: true,
          filter: {
            fieldId: "c_soldAt.address.line1",
            value: locationState.checkedLocation?.addressLine1,
            kind: "fieldValue",
            matcher: Matcher.Equals,
          },
        });
        triggerSearch();
      } else if (
        filters?.findIndex(
          (f) =>
            f.filter.kind === "fieldValue" &&
            f.filter.fieldId === "c_soldAt.address.line1"
        ) !== -1
      ) {
        triggerSearch();
      }
    }
  };

  useEffect(() => {
    executeLocationFilterSearch();
  }, [locationState.checkedLocation]);

  return;
};
