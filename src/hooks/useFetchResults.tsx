import { useState, useEffect } from "react";
import { useSearchActions, useSearchState, Result } from "@yext/search-headless-react";

const useFetchResults = () => {
  const [data, setData] = useState(null);
  const locationResults = useSearchState(s => s.vertical.results) || [];
  return locationResults;
};

export default useFetchResults;
