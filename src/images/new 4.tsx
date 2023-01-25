import { Wrapper } from '@googlemaps/react-wrapper';
// import { Result, useAnswersState } from '@yext/answers-headless-react';
import { useSearchState, Result } from "@yext/search-headless-react";
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { twMerge, useComposedCssClasses } from '..//../hooks/useComposedCssClasses';
import Mapicon from "..//../images/map-pin.svg";
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
  
  let mapMarkerClusterer = null;

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
    // default google pin path
    /*path: "M18.942,56.14C2.965,32.568,0,30.149,0,21.486A21.3,21.3,0,0,1,21.111,0,21.3,21.3,0,0,1,42.222,21.486c0,8.663-2.965,11.082-18.942,34.654a2.614,2.614,0,0,1-4.339,0Zm2.17-25.7a8.954,8.954,0,1,0-8.8-8.953A8.875,8.875,0,0,0,21.111,30.439Z",*/
    url:Mapicon,
    fillColor: pinStyles.fill,
    scale: 1.1,
    fillOpacity: 1,
    strokeColor: pinStyles.stroke,
    strokeWeight: 1,
    labelOrigin: new google.maps.Point(21,22),
  };
 

  const bounds = new google.maps.LatLngBounds();
  const markerPins = useRef<google.maps.Marker[]>([]);
  deleteMarkers();
  // const position={
  //   lat:userlat.latitude,
  //   lng:userlat.longitude
  // }
  // const Usermarker = new google.maps.Marker({
  //   position,
  //   map,
  //   icon:"https://developers.google.com/maps/documentation/javascript/examples/full/images/parking_lot_maps.png",
  // });
  // markers.current.push(Usermarker);
  // console.log(markers);
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
    console.log(mapMarkerClusterer);
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
      const zoom = map.getZoom() ?? 0;
      if (zoom > 15) {
        map.setZoom(15);
      }        
    }
  });



  
var infoWindow = new google.maps.InfoWindow();
for (let i = 0; i < markerPins.current.length; i++) {
  markerPins.current[i].addListener("click", () => {
    locationResults.map((result,index)=>{
      if(i==index){
        Infowindow(i,result);
      }
      map.setZoom(12);  
      infoWindow.open(map, markerPins.current[i]); 
    })
    
   
  })
}
infoWindow.addListener("closeclick", () => {  
  map.setZoom(8);
  infoWindow.close(); 
  // bounds.extend(mapCenter);         
}); 

const hours=(result:any)=>{
  
  return(
    <Hours hours={result} />
  )
}


function Infowindow(i:Number,result:any):void{      
    const MarkerContent=         
        (<div className="markerContent w-48 md:w-[350px] font-universpro font-normal text-darkgrey text-xs md:text-sm leading-6">
        <div className="nameData font-bold text-sm md:text-base">{result.name}</div>
        <div className="addressData">{result.rawData.address.line1},{result.rawData.address.city}</div>
        <div>{hours(result.rawData.hours)} </div>
        </div>
        );
    let string=renderToString(MarkerContent);
    console.log(['string',string]);
    infoWindow.setContent(string);            

}

  function deleteMarkers(): void {
    for (let i = 0; i < markerPins.current.length; i++) {
      markerPins.current[i].setMap(null);
    }
    markerPins.current = [];
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

