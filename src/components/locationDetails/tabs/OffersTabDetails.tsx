import * as React from "react";


type OffersTabDetails = {  
  offersToRestaurants?: any; 
};

const OffersTabDetails = (props: OffersTabDetails) => {

  const { offersToRestaurants } = props;

  const offersDivs = offersToRestaurants.map((item:any) => (    
      <div className="card p-5 border-2 rounded-xl space-y-3 bg-gray-100 drop-shadow-md">       
        <div className="name pt-2 text-2xl text-center font-bold">{item.name}</div>
          {item.photoGallery != undefined ? item.photoGallery.map((element:any) => (
            <div>
              <img
                height="200px"
                src={element.image.url} // use normal <img> attributes as props
                width="100px"
                className="image"
              >
              </img>
            </div>
          )) : "" }
        <ul className="list-disc">
          {item.c_prezzoOffersPoints.map((points:any) => (
            <li>{points}</li> 
          ))}          
        </ul>
      </div>    
  ));
  
  return (
    <>
      <div className="">
        {offersDivs}
      </div>
    </>
  );
};

export default OffersTabDetails;
