import { useSearchActions } from "@yext/search-headless-react";
import { useEffect, useState } from 'react';
import * as React from "react";
import { FilterSearch, VerticalResults, ResultsCount, Pagination, LocationBias, NumericalFacets, NumericalFacetsProps, StandardFacets, StandardFacetsProps } from "@yext/search-ui-react";
import { Location } from "..//../types/search/locations";
import LocationCard from "./LocationCard";
import { GoogleMaps } from "./GoogleMaps";
import { useSearchState, Result } from "@yext/search-headless-react";
import Modal from 'react-modal';
import { AnswerExperienceConfig, googleMapsConfig, limit } from "..//../config/globalConfig";
import Geocode from "react-geocode"; 
import useFetchResults from "../../hooks/useFetchResults";
import FilterAwesome from "./FilterAwesome";
import PerfectScrollbar from 'react-perfect-scrollbar'; 
import 'react-perfect-scrollbar/dist/css/styles.css';

const SearchLayout = (): JSX.Element => {

  const searchActions = useSearchActions();

  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [centerLatitude, setCenterLatitude] = useState(googleMapsConfig.centerLatitude);
  const [centerLongitude, setCenterLongitude] = useState(googleMapsConfig.centerLongitude);
  const [inputvalue,setInputValue]= useState('');
  const [optiontext,setOptiontext]=useState('');
  const[check,setCheck]=useState(false);  
  const[userShareLocation,setUserShareLocation]=useState(false);  
  const[offset,setOffset]=React.useState(0);    
  const [optionclick,setOptionClick] = useState(true);
  var searchKey:any;
  var target;

  let onLoad = true;

  useEffect(()=>{
    if(onLoad){      
      onLoadData();
      onLoad=false;
    }   
    // bindInputKeyup();
    // handleEnterPress();
    // optionClickHandler(); 
  },[]);

  const onLoadData = () =>{
        
      // if (navigator.geolocation) {
      //   navigator.geolocation.getCurrentPosition(function (position) {                
      //     searchActions.setUserLocation({
      //       latitude:position.coords.latitude,
      //       longitude:position.coords.longitude
      //     });
      //     setCenterLatitude(position.coords.latitude);
      //     setCenterLongitude(position.coords.longitude);
      //     searchActions.setVerticalLimit(limit);
      //     searchActions.executeVerticalQuery();
      //     }, function(error) {
      //       if (error.code == error.PERMISSION_DENIED){
      //       searchActions.setUserLocation({
      //         latitude:centerLatitude,
      //         longitude:centerLongitude
      //       });
      //       searchActions.setVerticalLimit(limit);
      //       searchActions.executeVerticalQuery();
      //     }

      //     });            
      // }

      searchActions.setUserLocation({
        latitude:centerLatitude,
        longitude:centerLongitude
      });
      searchActions.setVerticalLimit(limit);
      searchActions.executeVerticalQuery();
}

const bindInputKeyup = () =>{
  searchKey = document.getElementsByClassName('FilterSearchInput');
  if(searchKey.length){
     searchKey[0].addEventListener("keyup", function (e:any) {      
       if(searchKey[0].value.trim()==""){ 
         setOptionClick(true);
          searchActions.setUserLocation({
            latitude:centerLatitude,
            longitude:centerLongitude
          });
         searchActions.setVertical("locations")
         searchActions.setQuery("");
         searchActions.setVerticalLimit(limit);
         searchActions.executeVerticalQuery();
       }
     })
  }
}
const handleEnterPress = () =>{
  let searchKey = document.getElementsByClassName('FilterSearchInput'); 
  searchKey[0].addEventListener("keydown", function (e:any) {    
    if(e.key=="Enter"){
      console.log('Press enter')
      setOptionClick(false);
      setCheck(true);    
      mapzoom=16;
      getCoordinates(searchKey[0].value); 
      document.querySelector('.z-10').classList.add('hidden');
    }
  })
}

const optionClickHandler = () =>{

  document.body.addEventListener('click',function (e:any) {
    const isOptionClick = getParents(e.target) 
    if(isOptionClick){
      var text = "";
      if(e.target.children.length){         
        for (let index = 0; index < e.target.children.length; index++) {
          text += e.target.children[index].innerText;
        }
        if(text.trim() != ""){
          searchActions.setQuery("");
          searchActions.executeVerticalQuery();
          getCoordinates(text); 
        }
      }else{
        text += e.target.innerText;
        if(text.trim() != ""){
          searchActions.setQuery("");
          searchActions.executeVerticalQuery();
          getCoordinates(text); 
        }
      }
    }
  });
}


  const openModal = () => {
    setIsOpen(true);
  }

  const closeModal = () => {
    setIsOpen(false);
  }


  const Findinput = () => {
    let searchKey = document.getElementsByClassName('FilterSearchInput');
    setInputValue('');
    getCoordinates(searchKey[0].value);       
  }


  function getCoordinates(address:String){
    fetch("https://maps.googleapis.com/maps/api/geocode/json?address="+address+'&key=AIzaSyDZNQlSlEIkFAct5VzUtsP4dSbvOr2bE18')
      .then(response => response.json())
      .then(data => {
       if(data.status == "OK"){
            data.results.map((res:any)=>{
              const userlatitude = res.geometry.location.lat;
              const userlongitude = res.geometry.location.lng;
              let params={latitude:userlatitude,longitude:userlongitude};              
              setCenterLatitude(userlatitude);
              setCenterLongitude(userlongitude);
              searchActions.setUserLocation(params);
              searchActions.setQuery(address);
              searchActions.executeVerticalQuery();            
        })
       }else{ console.log('OK');
          searchActions.setUserLocation({latitude:centerLatitude,longitude:centerLongitude});
          searchActions.setQuery(address);
          searchActions.executeVerticalQuery();
       } 
   
    })     
  }

  const locationResults = useFetchResults() || [];

  const locationBias = useSearchState(s => s.location.locationBias);
  // console.log(locationBias);     
  const displayName = locationBias?.displayName;
   

 
  const getParents = (elem:any) => {
    while(elem.parentNode && elem.parentNode.nodeName.toLowerCase() != 'body') {
      elem = elem.parentNode;
      if(elem.classList.contains('options')){
        return true;
      }
    }
    return false;
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
    <>
      <div className="locator-full-width">
        <div className="locator-container">
          <div className="result-listing">
            <div className="search-block">

              <h3 className="title">
                Find Restaurants
              </h3>
              {/* <LocationBias />  */}
              <div className="search-form">
                <FilterSearch
                  customCssClasses={{
                    filterSearchContainer: "",
                    inputElement: "FilterSearchInput",
                  }}
                  searchOnSelect={true}
                  searchFields={[
                    {
                      entityType: "location",
                      fieldApiName: "name",

                    },
                    {
                      entityType: "location",
                      fieldApiName: "address.line1",

                    },
                    {
                      entityType: "location",
                      fieldApiName: "address.line2",

                    },
                    {
                      entityType: "location",
                      fieldApiName: "address.city",

                    },
                    {
                      entityType: "location",
                      fieldApiName: "address.postalCode",

                    },
                    // {
                    //   entityType: "location",
                    //   fieldApiName: "builtin.location",                        
                    // },
                  ]}
                  
                />
                <button
                  className="button"
                  aria-label="Search bar icon"
                  id="search-location-button" onClick={Findinput}><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="search" className="w-4" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path fill="currentColor" d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"></path>
                  </svg></button>
              </div>

              <span className="text-[#eb0000]  text-lg">{inputvalue}</span>
              <ResultsCount
                customCssClasses={{ resultsCountContainer: "result-count" }}
              />
            </div>
            
             
            {locationResults && locationResults.length > 0 ? (
              <VerticalResults<Location>
                displayAllOnNoResults={false}
                customCssClasses={{
                  verticalResultsContainer:
                    "resultList mb-5 result-list-inner",
                }}
                CardComponent={LocationCard}
              />        
            ) : (
              <div className="no-data">
                <p>No Restaurants found.</p>
              </div>
            )}

            <Pagination />
           
           
          </div>
          <div className="map-section">
            {/* <MapboxMap<Location>
                    mapboxAccessToken="pk.eyJ1IjoicmFodWxyYXRob3JlIiwiYSI6ImNsOGVoM2NycjFsMDYzbnFrdGlpbGE4djEifQ.IWRyhB7OIqpBdtUtj0ki_w"
                    getCoordinate={(location) =>
                    location.rawData.yextDisplayCoordinate}
                    PinComponent={MapPin}
                /> */}

            <GoogleMaps
              apiKey={googleMapsConfig.googleMapsApiKey}
              centerLatitude={centerLatitude}
              centerLongitude={centerLongitude}
              defaultZoom={6}
              showEmptyMap={true}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchLayout;
