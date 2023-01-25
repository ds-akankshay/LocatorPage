import * as React from "react";
import Cta from "../../commons/cta";
import Address from "../../commons/Address";
import PhotoGallery from "../../locationDetails/PhotoGallery";
import Hours from "../../commons/hours";
import StaticMap from "../../locationDetails/StaticMap";
import { formatPhoneNumber, formatPhoneNumberIntl } from 'react-phone-number-input';
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import IframeMap from "../../locationDetails/IframeMap";
import NearByLocations from "../../locationDetails/NearByLocations";

type VisitTabDetails = {  
  document?: any; 
};

const VisitTabDetails = (props: VisitTabDetails) => {
  const { document } = props;
  const { name, address, hours, description, neighborhood, mainPhone, yextDisplayCoordinate } = document;

  let formattedPhone = formatPhoneNumber(mainPhone);

  return (
    <>
      <div className="section">
      <div className="flex flex-row w-full h-full overflow-y-auto">
                    <div className="address-phone space-y-5">
                      <h2 className="text-xl font-semibold mb-4">Address</h2>
                      <Address address={address}></Address>
                      <div className="space-x-3">
                        <span>&#128222;</span>
                        <span>{formattedPhone}</span>
                      </div>
                    </div>
                    <Hours title="Hours" hours={hours}></Hours>
                    <div className="description">
                      <div className="text-xl font-semibold mb-4">About {name} - {neighborhood}</div>
                      <p>{description}</p>
                    </div>
                  </div>
              </div>
              <div className="section">
                {/* <PhotoGallery 
                  photoGallery={photoGallery}
                  height="300"
                  width="450"
                  ></PhotoGallery> */}
              </div>
              <div className="section">
                {/* <Faqs faqs={c_featuredFAQs}></Faqs> */}
              </div>          
              <IframeMap address={address} ></IframeMap>
              <NearByLocations latitude={yextDisplayCoordinate.latitude}  longitude={yextDisplayCoordinate.longitude}></NearByLocations>
    </>
  );
};

export default VisitTabDetails;
