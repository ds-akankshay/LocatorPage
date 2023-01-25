import * as React from "react";
import Address from "../commons/Address";
import hours from "../commons/hours";
import OpenCloseStatus from "../commons/OpenCloseStatus";
import GetDirection from "../commons/GetDirection";
import { formatPhoneNumber, formatPhoneNumberIntl } from 'react-phone-number-input';

type Banner = {
  text?: string;
  address?: any;
  hours?: any;
  timezone?: any;
  mainPhone?: any;
  latitude?: any;
  longitude?: any;
  children?: React.ReactNode;
};

const Banner = (props: Banner) => {
  const { 
    text,
    address,
    hours,
    timezone,
    mainPhone,
    latitude,
    longitude ,
    children 
  } = props;

  const formattedPhone = formatPhoneNumber(mainPhone);

  return (
    <>
      <div className="bg-green text-5xl font-bold text-white p-10 flex items-center justify-center flex-col gap-x-14 gap-y-10 md:flex-row">
        <div>{text}</div>
        <div><OpenCloseStatus timezone={timezone} hours={hours}></OpenCloseStatus></div>
        <div>{formattedPhone}</div>
        <div>
          <Address address={address}></Address>
        </div>
        <div>
          <GetDirection  buttonText={"View on google maps"} latitude={latitude}
                  longitude={longitude} ></GetDirection>
        </div>
        {children}
      </div>
    </>
  );
};

export default Banner;
