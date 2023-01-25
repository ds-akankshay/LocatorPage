import {limit, radius, baseApiUrl, liveAPIKey, savedFilterId, entityTypes } from "../config/globalConfig";

 const ApiCall = {
    
    fetch: (url: string, method = 'get', body = null, headers = null) => {
      
        const apiUrl = url;
        const allHeaders = ApiCall.getAllHeaders(headers, method);
    
        let options = {
          method: method,
        };
        
        let bodyData = {};
        
        if(body) {
          bodyData =  {
            body: JSON.stringify(body)
          };  
        }
        
        const allOptions = { ...options, ...allHeaders, ...bodyData};
        if (method ==='post' || method ==='put' || method ==='delete' ) {
            return fetch(apiUrl, allOptions).then(res => res.json());
        }else{
            const mode = 'no-cors';
            const headers = {'Access-Control-Allow-Credentials': 'true','Access-Control-Allow-Origin': '*'};
            const allOptions = JSON.stringify({mode, headers});
            // console.log(allOptions);	
            return fetch(apiUrl).then(res => res.json());
        }
      
    },

    getAllHeaders: (headers:string, method:any) => {
        
        let allHeaders = {	  
          'Access-Control-Allow-Credentials': 'true',	 
          'Access-Control-Allow-Origin': '*'
        };        
        const newHeaders = {  headers: allHeaders };
        return newHeaders;
      
    },
    
    getLocations: (params:any) => {
    
        let baseURL = baseApiUrl+"/entities?";   
        let vparam = "20181017";        
        let offset=params.offset;   

        let fields = "name,hours,neighborhood,address,mainPhone,slug,timeZoneUtcOffset,displayCoordinate,yextDisplayCoordinate";
        
        let fullURL = baseURL
            + "api_key=" + liveAPIKey 
            + "&v=" +  vparam       
            + "&limit=" + limit
            + "&entityTypes=" + entityTypes
            + "&fields=" + fields
            + "&resolvePlaceholders=true"
            + "&savedFilterIds=" + savedFilterId
            +"&offset="+offset; 
          
          return ApiCall.fetch(fullURL , 'get');	
      
    },
    getNearbyLocations: (params:any) => {
      
      let baseURL = baseApiUrl+"/entities/geosearch?radius="+radius;       
      let vparam = "20181017";
      let location=params.location;
      let limit = params.limit;
      let offset=params.offset;       
      let fields = "name,hours,neighborhood,address,mainPhone,slug,timeZoneUtcOffset,displayCoordinate,yextDisplayCoordinate";
          
      let fullURL = baseURL
      + "&api_key=" + liveAPIKey 
      + "&v=" +  vparam
      + "&location=" + location
      + "&limit=" + limit
      + "&entityTypes=" + entityTypes
      + "&fields=" + fields
      + "&resolvePlaceholders=true"
      + "&savedFilterIds=" + savedFilterId
      +"&offset="+offset; 

      return ApiCall.fetch(fullURL , 'get');	

       },
       getAlphabet: (params:any) => {

          let baseURL = baseApiUrl+"/entities?";      
          let vparam = "20181017";
          let limit =  params.limit;
          let offset=  params.offset;  
          let fields = "name,hours,neighborhood,address,mainPhone,slug,timeZoneUtcOffset,displayCoordinate,yextDisplayCoordinate";
          
          let fullURL = baseURL
              + "api_key=" + liveAPIKey 
              + "&v=" +  vparam       
              + "&limit=" + limit
              + "&entityTypes=" + entityTypes
              + "&fields=" + fields
              + "&resolvePlaceholders=true"
              + "&savedFilterIds=" + savedFilterId
              +"&offset="+offset; 
              
            return ApiCall.fetch(fullURL , 'get');	
         
       },  
       getopenclose:(param:any)=>{
        
          let baseURL =  baseApiUrl+"/entities/"+`${param.entityId}`+'?';     
          let vparam = "20181017";      
          let limit=3;

          let fullURL = baseURL
              + "api_key=" + liveAPIKey 
              + "&v=" +  vparam  
              + "&limit=" + limit     
              + "&entityTypes=" + entityTypes
              + "&resolvePlaceholders=true"
              + "&savedFilterIds=" + savedFilterId
              
              return ApiCall.fetch(fullURL , 'get');	
          } 
  };

  export default ApiCall
  