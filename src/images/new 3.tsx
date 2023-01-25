import { Wrapper } from '@googlemaps/react-wrapper';
// import { Result, useAnswersState } from '@yext/answers-headless-react';
import { useSearchState, Result, useSearchActions } from "@yext/search-headless-react";
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { twMerge, useComposedCssClasses } from '../../hooks/useComposedCssClasses';
import Mapicon from "../../images/map-pin.svg"
import Hours from '../commons/hours';
import reactElementToJSXString from 'react-element-to-jsx-string';
import Nav from '../layouts/Nav';
import UserMarker from "../../images/map-center.svg";
import {renderToString} from "react-dom/server";
import LocationCard from './LocationCard';
import Opening from '../commons/openClose';
import GetDirection from '../commons/GetDirection';
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
  
  const locationResults = useSearchState(s => s.vertical.results) || [];
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
  const markers1 = useRef<google.maps.Marker[]>([]);
  const usermarker=useRef<google.maps.Marker[]>([]);
  deleteMarkers();
  userdeleteMarkers();
  // function getCoordinates(address:String){
 
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
    // console.log(usermarker)
  
  try{if(mapMarkerClusterer){mapMarkerClusterer.clearMarkers();}}catch(e){}
  for (const result of locationResults) {
    const position = getPosition(result);
    const marker = new google.maps.Marker({
      position,
      map,
      icon: marker_icon,
    });
   
    const location = new google.maps.LatLng(position.lat, position.lng);
    bounds.extend(location);
    markers1.current.push(marker);
   
  }
  if(markers1.current.length > 0){
  let markers= markers1.current;
  mapMarkerClusterer = new MarkerClusterer( {map,markers} );
  // console.log(mapMarkerClusterer);
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
    
    if (markers1.current.length > 0 && map){
      map.fitBounds(bounds);
      map.panToBounds(bounds);
      const zoom = map.getZoom() ?? 0;
      if (zoom > 15) {
        map.setZoom(15);
      }
    }
  },[]);
var infoWindow = new google.maps.InfoWindow();
for (let i = 0; i < markers1.current.length; i++) {
  markers1.current[i].addListener("click", () => {
    locationResults.map((result,index)=>{
      if(i==index){
        Infowindow(i,result);
      }
       map.setZoom(12);  
      infoWindow.open(map, markers1.current[i]); 
    })
    
   
  })
}
infoWindow.addListener("closeclick", () => {  
  map.setZoom(10);
    infoWindow.close(); 
  // bounds.extend(mapCenter);         
}); 

const hours=(result:any)=>{
  
  return(
    <Hours hours={result} />
  )
}
const metersToMiles = (meters: number) => {
  const miles = meters * 0.000621371;
  return miles.toFixed(2);
}


  function Infowindow(i:Number,result:any):void{
  
              
     const MarkerContent= 
   
    
          (<>   <div className="flex flex-row items-center">
        
          <svg className="pr-1" xmlns="http://www.w3.org/2000/svg" width="22" height="30" viewBox="0 0 32.396 43.195">
          <g id="Group_102" data-name="Group 102" transform="translate(-1106.871 -1030.805)">
            <path id="Icon_awesome-map-marker-alt" data-name="Icon awesome-map-marker-alt" d="M14.534,42.324C2.275,24.553,0,22.729,0,16.2a16.2,16.2,0,0,1,32.4,0c0,6.531-2.275,8.355-14.534,26.126a2.026,2.026,0,0,1-3.329,0ZM16.2,22.947A6.749,6.749,0,1,0,9.449,16.2,6.749,6.749,0,0,0,16.2,22.947Z" transform="translate(1106.871 1030.805)" fill="#eb0000"/>
            <g id="Group_27" data-name="Group 27" transform="translate(154 186.171)">
              <path id="Path_51" data-name="Path 51" d="M12,0A12,12,0,1,1,0,12,12,12,0,0,1,12,0Z" transform="translate(957 849.829)" fill="#fff"/>
              <text id="M" transform="translate(961.267 867.509)" fill="#eb0000" font-size="16" font-family="SofiaProLight, Sofia Pro"><tspan x="0" y="0">M</tspan></text>
            </g>
          </g>
        </svg>
      <h1 className="text-[#eb0000] text-lg">MATALAN</h1>
      {result.distance?
                             <div className="float-right right-column ml-auto">
                              
                              <div className="flex distance items-center">
                              {metersToMiles(result.distance ?? 0)} <span className="text-[#eb0000] pl-1.5  text-lg">miles</span>
                              </div>
                              </div>:''}
      </div>
      <div className="ml-[22px] storelocation-name hover:underline  font-evogriaregular hover:font-semibold   ">                           
          <a 
            className="inline-block "
            href={`${result.rawData.slug}`}
          >
            {result.rawData.name}
          </a>
        </div>
        <div className=" lp-param-results lp-subparam-hours">
                            <div className=" ml-[22px] address">
                              {result.rawData.address.line1},
                              {result.rawData.address.line2 ? result.rawData.address.line2 : ""}{" "}
                              {result.rawData.address.city}, {result.rawData.address.postalCode}
                              <br />
                            </div>
    
      <Opening hours={result.rawData.hours} timezone={result.rawData.timezone} class="ml-[22px] mt-1 open-now-string  justify-center text-[#eb0000]"/>
      <div className={`storelocation-openCloseTime  capitalize`}>
        
      {typeof result.rawData.hours === "undefined" ? ("") : (
      <Hours key={result.rawData.name} hours={result.rawData.hours} />
      )}              
      </div>
      <div className="flex mb-3  ">
        <a type="button"  href={`${result.rawData.slug}`} className="px-2 mr-2  text-base font-bold text-white rounded-lg drop-shadow-md bg-[#eb0000]">View Store Detail</a>
        {result.rawData.displayCoordinate?
        <a  data-listener="false" data-latitude={result.rawData.displayCoordinate.latitude} data-longitude={result.rawData.displayCoordinate.longitude}  className=" getdirection px-6 text-base font-bold text-white rounded-lg drop-shadow-md bg-[#eb0000]" rel="noopener noreferrer" data-city={result.rawData.address.city}
        data-country={result.rawData.address.country} data-region={result.rawData.address.region} >
        Direction
          </a>:
           <a data-listener="false"  data-latitude={result.rawData.displayCoordinate.latitude} data-longitude={result.rawData.displayCoordinate.longitude} data-city={result.rawData.address.city}
           data-country={result.rawData.address.country} data-region={result.rawData.address.region}  className=" getdirection1px-6 text-base font-bold text-white rounded-lg drop-shadow-md bg-[#eb0000]" rel="noopener noreferrer" >
           Direction
             </a>
        }
       
        {/* <GetDirection buttonText="Direction" latitude={result.rawData.displayCoordinate?.latitude} longitude={result.rawData.displayCoordinate?.longitude}/> */}
        </div>
   
                              </div>
        </>);
     
  
        
      let string=renderToString(MarkerContent);
      infoWindow.setContent(string);
    
  }


  google.maps.event.addListener(infoWindow, 'domready', function() {
   
    
     var inputs = document.getElementsByClassName('getdirection');
     for( var i=0; i<inputs.length; i++){     
      inputs[i].addEventListener("click", function(e) { GetDirection(e);
           })
          }
        })

  //         //or
  //       //var inputs = document.querySelectorAll('.myClass');
  //       for( var i=0; i<inputs.length; i++){     
  //         if (inputs[i].getAttribute('data-listener') !== 'true') {
  //           inputs[i].addEventListener('click', function (e) {
  //               const elementClicked = e.target;
  //               elementClicked?.setAttribute('listener', 'true');
  //               console.log('event has been attached');
  //          });
  //      }
     
      
  //   }
          // console.log(google.maps.event.hasListeners(inputs[i],'click'));
            // console.log(inputs[i].hasListeners("click"));
            // inputs[i].addEventListener("click", function(e) { console.log('hello');
            // console.log(e);
            // e.removeEventListener("click", function() { console.log('remove'); });
          //  });
        //    var inputs = document.getElementsByClassName('getdirection');
        //    for( var i=0; i<inputs.length; i++){     
        //    if (inputs[i].getAttribute('data-listener') == 'true') {
        //     console.log('event has been removed');
        //   }
        // }
        
    // google.maps.event.addDomListener(document.getElementsByClassName('getdirection'), 'click', function (){
    //   console.log('hello') 
    // });
      


function GetDirection(e:any){
  console.log(e.target.dataset)
  var origin: any = null;
  
    if (e.target.dataset.city) {
      origin = e.target.dataset.city;
    } else if (e.target.dataset.region) {
      origin = e.target.dataset.region;
    }  else {
      origin = e.target.dataset.country;
    }
    if (navigator.geolocation) {
      const error = (error: any) => {
        var getDirectionUrl =
        "https://www.google.com/maps/dir/?api=1&destination=" +
        e.target.dataset.latitude +
        "," +
        e.target.dataset.longitude +
        "&origin=" +
        origin;
        window.open(getDirectionUrl, "_blank");
        // var message_string =
        //   "Unable to determine your location. please share your location";
        // if (confirm(message_string) != true) {
         
        //   var getDirectionUrl =
        //     "https://www.google.com/maps/dir/?api=1&destination=" +
        //     e.target.dataset.latitude +
        //     "," +
        //     e.target.dataset.longitude +
        //     "&origin=" +
        //     origin;

        //   window.open(getDirectionUrl, "_blank");
        // } else {
        //   return false;
        // }
      };
      navigator.geolocation.getCurrentPosition(
        function (position) {
          console.log("current lat lang");
          let currentLatitude = position.coords.latitude;
          let currentLongitude = position.coords.longitude;
          let getDirectionUrl =
            "https://www.google.com/maps/dir/?api=1&destination=" +
            e.target.dataset.latitude +
            "," +
            e.target.dataset.longitude +
            "&origin=" +
            currentLatitude +
            "," +
            currentLongitude;
          window.open(getDirectionUrl, "_blank");
        },
        error,
        {
          timeout: 10000,
        }
      );
    }
}    
  

  function deleteMarkers(): void {
    for (let i = 0; i < markers1.current.length; i++) {
      markers1.current[i].setMap(null);
    }
    markers1.current = [];
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
 
  const lat = result.rawData.yextDisplayCoordinate?(result.rawData as any).yextDisplayCoordinate.latitude:
  (result.rawData as any).displayCoordinate.latitude;
  const lng = result.rawData.yextDisplayCoordinate?(result.rawData as any).yextDisplayCoordinate.longitude
  :
  (result.rawData as any).displayCoordinate.longitude;
  return { lat, lng };
}
