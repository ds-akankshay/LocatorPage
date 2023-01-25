import * as React from "react";
import {  googleMapsConfig, AnswerExperienceConfig  } from "../../config/globalConfig";

type Address = {
  address: any;
};

const IframeMap = (props: Address) => {
  const { address } = props; console.log(address);
  return (
    <>	
    <iframe className="h-[600px] w-full md:h-[500px] xl:h-full"
      src={`https://www.google.com/maps/embed/v1/place?q=${address.line1}&language=${AnswerExperienceConfig.locale}&key=${googleMapsConfig.googleMapsApiKey}`}>
    </iframe>      
    </>
  );
};

export default IframeMap;
