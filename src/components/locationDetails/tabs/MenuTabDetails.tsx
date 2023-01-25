import * as React from "react";
import { useEffect, useState } from "react";

type MenuTabDetails = {  
  menuItems?: any; 
};

const MenuTabDetails = (props: MenuTabDetails) => {
  const { menuItems } = props;

  const [selected, setSelected] = useState("KIDS_MENU");

  const [kidsMenu, setKidsMenu] = useState("active");
  const [mainMenu, setMainMenu] = useState("hidden");
  const [drinkMenu, setDrinkMenu] = useState("hidden");

  const [ allergens, setAllergens] = useState("hidden");
  

  const hideAllergens = (name:any) => { 
    setAllergens("hidden");  
  }  

  const handleChange = (event:any) => {
    console.log(event.target.value);
    setDrinkMenu("hidden");
    setKidsMenu("hidden");
    setMainMenu("hidden");
    if(event.target.value = "DRINKS"){
      setDrinkMenu("active");
    }else if(event.target.value = "KIDS_MENU"){
      setKidsMenu("active");
    }else if(event.target.value = "MAIN_MENU"){
      setMainMenu("active");
    }
    setSelected(event.target.value);
  };

  /*const menuCategories:any = {
    mainMenu:[],
    kidsMenu:[],
    drinksMenu:[]
  };*/


  const menuCategories:any = [];
  menuCategories["MAIN_MENU"] = [];
  menuCategories["KIDS_MENU"] = [];
  menuCategories["DRINKS"] =[];

  const  myMAinMenu:any = [];
  const  myKidsMenu:any = [];
  const  myDrinkMenu:any = [];
  
  useEffect(() => {
   CategoriesMenuItems();
  }, [CategoriesMenuItems]);

  
  function CategoriesMenuItems(): void {
      
    for (var i=0; i < menuItems.length; i++) {
      
      if(menuItems[i].c_itemCategory !== undefined && menuItems[i].c_itemCategory !== null ){
          
          let itemCat = menuItems[i].c_itemCategory;
                       
          if (itemCat.includes("MAIN_MENU")) {                         
            let foodType = menuItems[i].c_foodType.toLowerCase().replace(/ /g, '_').replace(/[^\w-]+/g, ''); 
            if(menuCategories["MAIN_MENU"][foodType] === undefined){
              menuCategories["MAIN_MENU"][foodType] = [];
            }            
            menuCategories["MAIN_MENU"][foodType].push(menuItems[i]);
                          
          }
          if (itemCat.includes("KIDS_MENU")) {
            let foodType = menuItems[i].c_foodType.toLowerCase().replace(/ /g, '_').replace(/[^\w-]+/g, ''); 
            
            if(menuCategories["KIDS_MENU"][foodType] === undefined){
              menuCategories["KIDS_MENU"][foodType] = [];
            }            
            menuCategories["KIDS_MENU"][foodType].push(menuItems[i]);   
          } 
          if (itemCat.includes("DRINKS")) {             
            let foodType = menuItems[i].c_foodType.toLowerCase().replace(/ /g, '_').replace(/[^\w-]+/g, ''); 
            if(menuCategories["DRINKS"][foodType] === undefined){
              menuCategories["DRINKS"][foodType] = [];
            }            
            menuCategories["DRINKS"][foodType].push(menuItems[i]);      
          }          
        
      }

    }


    
     
  }

  

for (var i=0; i < menuItems.length; i++) {
  let foodType = menuItems[i].c_foodType.toLowerCase().replace(/ /g, '_').replace(/[^\w-]+/g, ''); 
  
  let ff = [];
  for (var f=0; f < menuItems.length; f++) {
    let ft = menuItems[f].c_foodType.toLowerCase().replace(/ /g, '_').replace(/[^\w-]+/g, ''); 
    if(foodType == ft){
      ff.push(menuItems[f]); 
    }
  }
  
  let newItem =  {
    "foodType":foodType,
    "items":ff
  };

  if(menuItems[i].c_itemCategory !== undefined && menuItems[i].c_itemCategory !== null ){          
    let itemCat = menuItems[i].c_itemCategory;

    if (itemCat.includes("DRINKS")) {
      myDrinkMenu.push(newItem);
    }
    if (itemCat.includes("KIDS_MENU")) {
      myKidsMenu.push(newItem);
    }
    if (itemCat.includes("MAIN_MENU")) {
      myMAinMenu.push(newItem);
    }
     
      
  }


}

const mainMenuRows=myMAinMenu.map(
  (element: { foodType: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; items: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; })=>{
      return(
        <> 
        <div className="columns features">
            <div className="column is-12">
                <div className="content menu-title has-text-left px-0">
                    <a className="anchor" id="Starters"></a>
                    <h1 className="has-handwritten-font mb-0 pb-4 title">{element.foodType} </h1>
                    <hr className="mt-0" />
                </div>
            </div>
        </div>
        {element.items.map((menuItem:any)=>{
          return(
            <><div className="column is-4 menu-item autohide-item">
            <div className="columns is-mobile  " data-type="menuitem" data-allergens="v,vg">
                <div className="column is-4 p-0 is-one-thirds-tablet is-half-mobile">           
                    <figure className="image is-1by1">
                        <img className="has-ratio fadein imgFinal" src={menuItem.photoGallery[0].image.url} data-src="" loading="lazy" />
                    </figure>
                </div>
                    <div className="content column py-0 pr-0 is-8 is-two-thirds-tablet is-half-mobile">
                     <div className="has-text-left">
                <h5>
                    {menuItem.name}
                    {
                      menuItem.c_allergence?.map((item:any,key:any) => (
                        <span className={"allergen "+item}><p>{item}</p></span>
                        ))
                    }
                        
                       
                </h5>
                <p>{menuItem.shortDescription}</p>
                <div className="grids is-10-col">
                    <div className="has-text-left instructions is-span-6 ie-col-start-1 ie-col-span-6">
                        <small></small>
                    </div>
                    <div className="has-text-right price is-span-4 ie-col-start-7 ie-col-span-3">
                                <small>{menuItem.price.value+" "+ menuItem.price.currencyCode}</small>            </div>
                </div>
            </div></div>
            </div>
        </div></>        
          )
  }
)}
        </>        
      )
  }
);


const kidsMenuRows=myKidsMenu.map(
  (element: { foodType: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; items: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; })=>{
      return(
        <> 
        <div className="columns features">
            <div className="column is-12">
                <div className="content menu-title has-text-left px-0">
                    <a className="anchor" id="Starters"></a>
                    <h1 className="has-handwritten-font mb-0 pb-4 title">{element.foodType} </h1>
                    <hr className="mt-0" />
                </div>
            </div>
        </div>
        {element.items.map((menuItem:any)=>{
          return(
            <><div className="column is-4 menu-item autohide-item">
            <div className="columns is-mobile  " data-type="menuitem" data-allergens="v,vg">
                <div className="column is-4 p-0 is-one-thirds-tablet is-half-mobile">           
                    <figure className="image is-1by1">
                        <img className="has-ratio fadein imgFinal" src={menuItem.photoGallery[0].image.url} data-src="" loading="lazy" />
                    </figure>
                </div>
                    <div className="content column py-0 pr-0 is-8 is-two-thirds-tablet is-half-mobile">
                     <div className="has-text-left">
                <h5>
                    {menuItem.name}
                    {
                      menuItem.c_allergence?.map((item:any,key:any) => (
                        <span className={"allergen "+item}><p>{item}</p></span>
                        ))
                    }
                </h5>
                <p>{menuItem.shortDescription}</p>
                <div className="grids is-10-col">
                    <div className="has-text-left instructions is-span-6 ie-col-start-1 ie-col-span-6">
                        <small></small>
                    </div>
                    <div className="has-text-right price is-span-4 ie-col-start-7 ie-col-span-3">
                                <small>{menuItem.price.value+" "+ menuItem.price.currencyCode}</small>            </div>
                </div>
            </div></div>
            </div>
        </div></>        
          )
  }
)}
        </>        
      )
  }
);


const drinkMenuRows=myDrinkMenu.map(
  (element: { foodType: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; items: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; })=>{
      return(
        <> 
        <div className="columns features">
            <div className="column is-12">
                <div className="content menu-title has-text-left px-0">
                    <a className="anchor" id="Starters"></a>
                    <h1 className="has-handwritten-font mb-0 pb-4 title">{element.foodType} </h1>
                    <hr className="mt-0" />
                </div>
            </div>
        </div>
        {element.items.map((menuItem:any)=>{
          return(
            <><div className="column is-4 menu-item autohide-item">
            <div className="columns is-mobile  " data-type="menuitem" data-allergens="v,vg">
                <div className="column is-4 p-0 is-one-thirds-tablet is-half-mobile">           
                    <figure className="image is-1by1">
                        <img className="has-ratio fadein imgFinal" src={menuItem.photoGallery[0].image.url} data-src="" loading="lazy" />
                    </figure>
                </div>
                    <div className="content column py-0 pr-0 is-8 is-two-thirds-tablet is-half-mobile">
                     <div className="has-text-left">
                <h5>
                    {menuItem.name}
                    {
                      menuItem.c_allergence?.map((item:any,key:any) => (
                        <span className={"allergen "+item}><p>{item}</p></span>
                        ))
                    }
                </h5>
                <p>{menuItem.shortDescription}</p>
                <div className="grids is-10-col">
                    <div className="has-text-left instructions is-span-6 ie-col-start-1 ie-col-span-6">
                        <small></small>
                    </div>
                    <div className="has-text-right price is-span-4 ie-col-start-7 ie-col-span-3">
                                <small>{menuItem.price.value+" "+ menuItem.price.currencyCode}</small>            </div>
                </div>
            </div></div>
            </div>
        </div></>        
          )
  }
)}
        </>        
      )
  }
);

const myMAinMenuTabs = myMAinMenu.map((item:any) => ( 
              <a className="navbar-item has-text-centered scroll-item" href={"#"+item.foodType}>
                  <span className="is-ma">{item.foodType}</span>
              </a>  
));


const myKidsMenuTabs = myKidsMenu.map((item:any) => (
  <a className="navbar-item has-text-centered scroll-item" href={"#"+item.foodType}>
                  <span className="is-ma">{item.foodType}</span>
              </a> 
));

const myDrinkMenuTabs = myDrinkMenu.map((item:any) => (  
              <a className="navbar-item has-text-centered scroll-item" href="#Starters">
                  <span className="is-ma">{item.foodType}</span>
              </a> 
));
  
   console.log(menuItems);   
  return (
    <><div className="menu-sections">
     <div className="ordered-header-left">
            <div className="select">
          <select className="menu-selector" value={selected} onChange={handleChange} >
          {Object.keys(menuCategories).map((key, item) => (
              <option value={key}>{key}</option>
          ))}
          </select>
        </div> 
        </div>        
        <div className={mainMenu}>
          <div className="overflow-x-auto overflow-y-hidden w-full">
          <button className="btn btn-info" onClick={() => hideAllergens("showHideComp1")}> Allergens</button> 
          <nav className="sub-menu-scroll">
          {myMAinMenuTabs}
          </nav>
          </div>  
          {mainMenuRows}
        </div>
        <div className={drinkMenu}>
        <div className="overflow-x-auto overflow-y-hidden w-full">
          <nav className="sub-menu-scroll">
          {myDrinkMenuTabs}
          </nav>
          </div> 
          {drinkMenuRows}
          </div>
        <div className={kidsMenu}>
        <div className="overflow-x-auto overflow-y-hidden w-full">
          <nav className="sub-menu-scroll">
          {myKidsMenuTabs}
          </nav>
          </div> 
          {kidsMenuRows}
        </div> 
        </div>      
    </>
  );
};

export default MenuTabDetails;
