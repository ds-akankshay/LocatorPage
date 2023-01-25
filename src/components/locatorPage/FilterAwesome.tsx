import * as React from "react";
import Modal from 'react-modal';
import { useEffect, useState } from 'react';
import { FilterSearch, VerticalResults, ResultsCount, Pagination, LocationBias, NumericalFacets, NumericalFacetsProps, StandardFacets, StandardFacetsProps } from "@yext/search-ui-react";



const FilterAwesome = (props:any) => {

const [modalIsOpen, setIsOpen] = useState(false);

const openModal = () => {
  setIsOpen(true);
}

const closeModal = () => {
  setIsOpen(false);
}

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};
 
  return (
    <div className="filterButton">
      <button className="ghost-button before-icon" onClick={openModal}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 17.005">
  <path d="M19.056,4.889h-1.1a2.834,2.834,0,0,0-5.346,0H3.944a.944.944,0,0,0,0,1.889h8.661a2.834,2.834,0,0,0,5.346,0h1.1a.944.944,0,0,0,0-1.889ZM15.278,6.778a.944.944,0,1,0-.944-.944A.944.944,0,0,0,15.278,6.778ZM3,11.5a.944.944,0,0,1,.944-.944H5.049a2.834,2.834,0,0,1,5.346,0h8.661a.944.944,0,1,1,0,1.889H10.4a2.834,2.834,0,0,1-5.346,0H3.944A.944.944,0,0,1,3,11.5Zm4.722.944a.944.944,0,1,0-.944-.944A.944.944,0,0,0,7.722,12.444ZM3.944,16.222a.944.944,0,0,0,0,1.889h8.661a2.834,2.834,0,0,0,5.346,0h1.1a.944.944,0,0,0,0-1.889h-1.1a2.834,2.834,0,0,0-5.346,0Zm12.278.944a.944.944,0,1,1-.944-.944A.944.944,0,0,1,16.222,17.167Z" transform="translate(-3 -2.998)" fill-rule="evenodd"/>
</svg> Filters</button>
    <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={customStyles} >
        <StandardFacets />
      </Modal>
    </div>
  );
};

export default FilterAwesome;
