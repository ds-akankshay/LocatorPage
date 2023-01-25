import { Wrapper } from '@googlemaps/react-wrapper';
// import { Result, useAnswersState } from '@yext/answers-headless-react';
import { useSearchState, Result } from "@yext/search-headless-react";
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { twMerge, useComposedCssClasses } from '..//../hooks/useComposedCssClasses';
import Mapicon from "..//../images/map-pin.svg";
import MapiconHover from "..//../images/map-pin-hover.svg";
import UserMarker from "..//../images/map-center.png";
import Hours from '..//../components/commons/hours';
import {renderToString} from "react-dom/server";
import { MarkerClusterer } from "@googlemaps/markerclusterer";

/**
 * CSS class interface for the {@link GoogleMaps} component
 *
 * @public
 */
export interface GoogleMapsCssClasses {
  googleMapsContainer?: string
}

/**
 * Props for the {@link GoogleMaps} component
 *
 * @public
 */
export interface GoogleMapsProps {
  apiKey: string,
  centerLatitude: number,
  centerLongitude: number,
  defaultZoom: number,
  showEmptyMap: boolean,
  providerOptions?: google.maps.MapOptions,
  customCssClasses?: GoogleMapsCssClasses
}

type UnwrappedGoogleMapsProps = Omit<GoogleMapsProps, 'apiKey'|'locale'>;
let mapMarkerClusterer: { clearMarkers: () => void; } | null = null;

const builtInCssClasses: Readonly<GoogleMapsCssClasses> = {
  googleMapsContainer: 'w-full  h-48 md:h-96 lg:h-[calc(100vh_-_0px)] xl:h-[calc(100vh_-_0px)]  top-0   2xl:h-[calc(100vh_-_0px)] order-1 lg:order-none z-[99]'
};

/**
 * A component that renders a map with markers to show result locations.
 *
 * @param props - {@link GoogleMapsProps}
 * @returns A React element conatining a Google Map
 *
 * @public
 */
export function GoogleMaps(props: GoogleMapsProps) {
  
  return (
    <div>
      <Wrapper apiKey={props.apiKey} >
        <UnwrappedGoogleMaps {...props} />
      </Wrapper>
    </div>
  );
}

function UnwrappedGoogleMaps({
  centerLatitude,
  centerLongitude,
  defaultZoom: zoom,
  showEmptyMap,
  providerOptions,
  customCssClasses
}: UnwrappedGoogleMapsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();
  const [center] = useState<google.maps.LatLngLiteral>({
    lat: centerLatitude,
    lng: centerLongitude
  });
  
  // console.log([centerLatitude,centerLongitude]);
  const locationResults = useSearchState(s => s.vertical.results) || [];
  // const userlat = useSearchState(s => s.location.locationBias) || [];
//  console.log(userlat)

  const cssClasses = useComposedCssClasses(builtInCssClasses, customCssClasses);
  const noResults = !locationResults.length;
  let containerCssClass = cssClasses.googleMapsContainer;
  if (noResults && !showEmptyMap) {
    containerCssClass = twMerge(cssClasses.googleMapsContainer, 'hidden');
  }
  let  pinStyles = {
    fill: "#4e9c34", //default google red
    stroke: "#4e9c34",
    text: "white",
    fill_selected: "#2c702e",
    stroke_selected: "#4e9c34",
    text_selected: "white",
  };

 let marker_icon = {
    url:Mapicon,
    fillColor: pinStyles.fill,
    scale: 1.1,
    fillOpacity: 1,
    strokeColor: pinStyles.stroke,
    strokeWeight: 1,
    labelOrigin: new google.maps.Point(21,22),
  };

  let marker_hover_icon = {
    url:MapiconHover,
    fillColor: pinStyles.fill,
    scale: 1.1,
    fillOpacity: 1,
    strokeColor: pinStyles.stroke,
    strokeWeight: 1,
    labelOrigin: new google.maps.Point(21,22),
  };
 
  let openMapCenter = '';
  let openMapZoom = '';
  let openInfoWindow = false;
  let searchCenter = null;
  let searchZoom = null;
  let stopAnimation = false;
  let currentMapZoom = 0;
  let infoWindow = new google.maps.InfoWindow();
  function zoomMapTo(zoomTo, centerToSet = false) {
    currentMapZoom = map.getZoom();
    let newZoom = (currentMapZoom > zoomTo) ? (currentMapZoom - 1) : (currentMapZoom + 1);
    map.setZoom(newZoom);
    if (newZoom != zoomTo && !stopAnimation) sleep(100).then(() => {
        zoomMapTo(zoomTo, centerToSet);
    });
    if (newZoom == zoomTo) {
        stopAnimation = false;
        if (centerToSet) {
            if (typeof map.panTo != 'undefined') {
                map.panTo(centerToSet);
            } else {
                map.setCenter(centerToSet);
            }
        }
    }
  }

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

  const bounds = new google.maps.LatLngBounds();
  const markerPins = useRef<google.maps.Marker[]>([]);
  const usermarker = useRef<google.maps.Marker[]>([]);
  deleteMarkers();
  userdeleteMarkers();

  const userlat = useSearchState(s => s.location.locationBias) || [];
  const iplat=userlat.latitude;
  const iplong=userlat.longitude;
  const position={
    lat:iplat,
    lng:iplong
  }
  const Usermarker1 = new google.maps.Marker({
    position,
    map,
    icon:UserMarker
  });
  usermarker.current.push(Usermarker1);

  try{if(mapMarkerClusterer){mapMarkerClusterer.clearMarkers();}}catch(e){}
  let index = 0;
  for (const result of locationResults) {
    const position = getPosition(result);
    let markerLabel = Number(index + 1 );
    const marker = new google.maps.Marker({
      position,
      map,
      icon: marker_icon,
      label: {
        text: String(markerLabel),
        color: "#fff",
      },
    });
   
    const location = new google.maps.LatLng(position.lat, position.lng);
    bounds.extend(location);
    markerPins.current.push(marker);
    index++;
  }

  if(markerPins.current.length > 0){
    let markers= markerPins.current;
    mapMarkerClusterer = new MarkerClusterer( {map,markers} );
    //console.log(mapMarkerClusterer);
  }

  useEffect(() => {   
    if (ref.current && !map) { 
      setMap(new window.google.maps.Map(ref.current, {
        center,
        zoom,
        ...providerOptions
      }));
    }
  }, [center, map, providerOptions, zoom]);

  useEffect(() => {    
    if (markerPins.current.length > 0 && map){        
      map.fitBounds(bounds);
      map.panToBounds(bounds);
      /*const zoom = map.getZoom() ?? 0;
      if (zoom > 15) {
        map.setZoom(15);
      } */
      searchCenter = bounds.getCenter();
      searchZoom = map.getZoom(); 
            
    }
    gridHover(markerPins, marker_hover_icon, marker_icon);
    let elements = document.querySelectorAll(".result");  
      for (let index = 0; index < elements.length; index++) {   
        
        elements[index].addEventListener("click", () => {      
          infoWindow.close();
          if(!openInfoWindow){
            openMapZoom = map.getZoom();
            openMapCenter = map.getCenter();
          }          
          locationResults.map((result,r)=>{
            if(index==r){
              Infowindow(index,result);              
              addActiveGrid(index); 
              map.panTo(markerPins.current[index].getPosition()); 
              infoWindow.open(map, markerPins.current[index]); 
              openInfoWindow = true;
            }
            // map.setZoom(12);	           
          })

        });
      }
  });
  

for (let i = 0; i < markerPins.current.length; i++) {
  markerPins.current[i].addListener("click", () => {
    infoWindow.close();
    if(!openInfoWindow){
      openMapZoom = map.getZoom();
      openMapCenter = map.getCenter();
    }
    
    locationResults.map((result,index)=>{
      if(i==index){
        Infowindow(i,result);
        scrollToRow(index);
        addActiveGrid(index); 
      }
      // map.setZoom(12);	
			map.panTo(markerPins.current[i].getPosition()); 
      infoWindow.open(map, markerPins.current[i]); 
      openInfoWindow = true;
    })
    
   
  })

  markerPins.current[i].addListener("mouseover", () => { 
    markerPins.current[i].setIcon(marker_hover_icon);                
    addActiveGrid(i);
  })

  markerPins.current[i].addListener("mouseout", () => { 
    markerPins.current[i].setIcon(marker_icon);
    let markerLabel = Number(i + 1 );
    markerPins.current[i].setLabel({
      text: markerLabel,
      color: "#fff",
      });         
      // removeActiveGrid();
  })

}

const metersToMiles = (meters: number) => {
  const miles = meters * 0.000621371;
  return miles.toFixed(2);
}

infoWindow.addListener("closeclick", () => {  
  infoWindow.close();
  removeActiveGrid();  
  zoomMapTo(searchZoom, searchCenter);
	openInfoWindow = false;         
}); 

const hours=(result:any)=>{
  
  return(
    <Hours hours={result} />
  )
}


function Infowindow(i:Number,result:any):void{      
    const MarkerContent=         
        (
        <div className="markerContent w-48 md:w-[350px] font-universpro font-normal text-darkgrey text-xs md:text-sm leading-6">
        <div className="nameData font-bold text-sm md:text-base">{result.name}</div>
        </div>
        );
    let string=renderToString(MarkerContent);    
    infoWindow.setContent(string); 
}

  function deleteMarkers(): void {
    for (let i = 0; i < markerPins.current.length; i++) {
      markerPins.current[i].setMap(null);
    }
    markerPins.current = [];
  }

  function userdeleteMarkers(): void {
    for (let i = 0; i < usermarker.current.length; i++) {
      usermarker.current[i].setMap(null);
    }
    usermarker.current = [];
  }

  return (
    <div className={containerCssClass} ref={ref} />
  );
}

// TEMPORARY FIX
/* eslint-disable @typescript-eslint/no-explicit-any */
function getPosition(result: Result){
  const lat = (result.rawData as any).yextDisplayCoordinate.latitude;
  const lng = (result.rawData as any).yextDisplayCoordinate.longitude;
  return { lat, lng };
}

function removeActiveGrid(){
  let elements = document.querySelectorAll(".result");  
  for (let index = 0; index < elements.length; index++) {    
    elements[index].classList.remove('active')
  } 
}

function gridHover(markerPins:any, marker_hover_icon:any, marker_icon:any){
  let elements = document.querySelectorAll(".result");  
  for (let index = 0; index < elements.length; index++) {    
    elements[index].addEventListener("mouseover", () => { 
      markerPins.current[index].setIcon(marker_hover_icon);                
      addActiveGrid(index);
    });
    elements[index].addEventListener("mouseout", () => { 
      markerPins.current[index].setIcon(marker_icon); 
    });

  }
} 

function addActiveGrid(index){
  let elements = document.querySelectorAll(".result");  
  for (let index = 0; index < elements.length; index++) {    
    elements[index].classList.remove('active')
  }
  document.querySelectorAll(".result")[index].classList.add("active"); 
}

export function scrollToRow(index) {
  let result = [].slice.call(document.querySelectorAll(".result") || [])[0];
  let offset = 0;
  if(typeof [].slice.call(document.querySelectorAll(".result") || [])[index] != 'undefined'){
    offset = [].slice.call(document.querySelectorAll(".result") || [])[index].offsetTop - result.offsetTop; 
    [].slice.call(document.querySelectorAll(".result-list") || []).forEach(function (el) { el.scrollTop = offset; });    
  }
}
