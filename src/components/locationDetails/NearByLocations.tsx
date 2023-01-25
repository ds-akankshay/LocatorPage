import * as React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import GetDirection from "../../components/commons/GetDirection";
import OpenCloseStatus from "../../components/commons/OpenCloseStatus";
import {limit, radius, baseApiUrl, liveAPIKey, savedFilterId, entityTypes } from "../../config/globalConfig";
import { formatPhoneNumber, formatPhoneNumberIntl } from 'react-phone-number-input';
import Address from "../../components/commons/Address";
import phonePin from "..//../images/phone.svg";

type props = {
  latitude: any;
  longitude: any;
};
const NearByLocations = (props:any) => {
  const { latitude, longitude } = props;
  const [data, setData] = useState([]);
  useEffect(() => {
    getRestoData();
  }, []);
  function getRestoData() {
    let url = `${baseApiUrl}/entities/geosearch?radius=500&location=${latitude},${longitude}&api_key=${liveAPIKey}&v=20181201&resolvePlaceholders=true&entityTypes=${entityTypes}&limit=4`;
    return axios.get(url)
      .then((res) => {
        setData(res.data.response.entities);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  return (
  <>
          <h2 className="text-xl font-semibold mb-4">Near By Locations</h2>       
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data ? (
                <>
                  {data.map((i: any) => {
                    return (
                      <>
                        <div className="bg-gray-200 p-4 rounded-lg drop-shadow-md space-y-5">  
						<h3 className="text-lg font-semibold">
                              <a href="">{i.name}</a>
                            </h3>
                            <div className="store-address">
                                  <Address address={i.address} />
                            </div>
                            <div className="store-phone">                              
                              <p>
                              <img src={phonePin} />
                                <a href={i.mainPhone}>{formatPhoneNumber(i.mainPhone)}</a>
                              </p>
                            </div>
							<div className="store-link">
							<OpenCloseStatus timezone={i.timezone} hours={i.hours}></OpenCloseStatus>
							</div>
                            <div className="store-link">
                       <GetDirection buttonText="Get Direction" className={"button location primary-button"} latitude={i.yextDisplayCoordinate.latitude}
                  longitude={i.yextDisplayCoordinate.longitude} ></GetDirection>                  
                            </div>
                          </div>                       
                      </>
                    );
                  })}
                </>
              ) : ( "" )}           
          </div>
</>		  
  );
};
export default NearByLocations;
