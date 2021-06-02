//Results
let ipText = document.getElementById("ip");
let locationText = document.getElementById("location");
let ispText = document.getElementById("isp");
let timeZoneText = document.getElementById("timezone");

//Input ip
let ipInput = document.getElementById("input-IP");
let buttonSearch = document.getElementById("button-IP");

let loader = document.querySelector(".loader-container");

const putDates = (ip, city, regionName, isp, timeZone)=>{
    ipText.textContent = ip;
    locationText.textContent = `${city}, ${regionName}`;
    ispText.textContent = isp;
    timeZoneText.textContent = `UTC${timeZone}`;
}
const getApi = async (ip)=>{
    try{
        //Get APIS
        let datesApi = await axios(`https://geo.ipify.org/api/v1?apiKey=at_qweVP6uO7S5XjsItf4u6GJ2PkqJkG&domain=${ip}`);
        loader.style.opacity = "0";
        setTimeout(()=>loader.style.visibility = "hidden", 1000);
        
        //API DATES Show
        let city = datesApi.data.location.city;
        let region = datesApi.data.location.region;
        let timeZone = datesApi.data.location.timezone;
        let isp = datesApi.data.isp;
        let ipAddress = datesApi.data.ip;
        //API DATES map
        let lat = datesApi.data.location.lat; let lon = datesApi.data.location.lng;
        putDates(ipAddress, city, region, isp, timeZone);

        return [lat, lon];
        
    }catch(e){
        console.warn("La api Falló");
        alert("unexpected error");
        console.error(e);
    }
}

let map = L.map('map');
const mapCoords = async(ip)=>{
    let lon = undefined;
    let lat = undefined;
    let coords = await getApi(ip).then(result => {
        lon = result[1];
        lat = result[0];
    })
    map.setView([lat, lon], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        
    }).addTo(map);
    let iconMarker = L.icon({
        iconUrl: 'img/icon-location.svg',
        iconSize: [20,30]
    });
    let marker = L.marker([lat, lon], {icon: iconMarker}).addTo(map);
    
    
    
}
window.addEventListener("load", async ()=>{
    // let ipApi = await axios("https://worldtimeapi.org/api/ip");
    // let ip = ipApi.data.client_ip;
    mapCoords('');
});

buttonSearch.addEventListener("click", ()=>{
    if(ipInput.value.length == 0){
        alert("The direction is empty!")
    }else{
        mapCoords(ipInput.value);
    }
})


