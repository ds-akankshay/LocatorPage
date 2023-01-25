import * as React from "react";
import Mapicon from "../../images/pin.svg"; 

const Address = (props: any) => {  
    const { address } = props; 
  return (
    <>
      <div className="icon-row location-address"><span className="icon"><img src={Mapicon} /></span> 
        <div>{address.line1}</div>
            {address.line2 && (<div>{address.line2}</div>)}
            <div>{address.region}, {address.city},  </div>
            <div>{address.countryCode}, {address.postalCode}</div>       
      </div>
    </>
  );
};

export default Address;
