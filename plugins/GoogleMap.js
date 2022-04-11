/* eslint-disable no-undef */
export default class GoogleMap {
    map = null;
    polyLine = null;
    curPosMaker = null;
    polyMarkers = [];
  constructor($target, {zoom, center}){
    this.map = new google.maps.Map($target, {
      zoom,
      center
    });
  }
  setCenter(pos){
    this.map.setCenter(pos);
  }
  drawPolygon(){
    const coords = [];
    this.polyMarkers.forEach(marker =>  {
       coords.push({
        lat : marker.position.lat(),
        lng : marker.position.lng(),
        })
    })
    const polygon = new google.maps.Polygon({
      paths: coords,
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      value:'test'
    });
    polygon.setMap(this.map);
    polygon.addListener('mouseover', () => {
      console.log(polygon);
    })
    polygon.addListener('mouseout', () => {
    })
    return coords;
  }
  
  createPolyLine({strokeColor, strokeOpacity, strokeWeight}){
    this.polyLine = new google.maps.Polyline({
      strokeColor,
      strokeOpacity,
      strokeWeight
    })
    this.polyLine.setMap(this.map);
  }
  removePolyLine(){
    this.polyLine.setMap(null);
    this.polyMarkers.forEach(marker => marker.setMap(null));
    this.polyMarkers = [];
  }
  createPolyLineMarker(option){
    this.polyLine.getPath().push(option.position);
    const marker = this.createMarker(option);
    return marker;
  }
  createMarker(option){
    const marker = new google.maps.Marker(option);
    marker.setMap(this.map);
    return marker
  }
  removePolyLineMarker(marker){
    let start = this.polyMarkers.indexOf(marker);
    this.polyLine.getPath().removeAt(start);
    marker.setMap(null);
    this.polyMarkers.splice(start, 1)
  }
  addEventListner(type, cb){
    return this.map.addListener(type, cb);
  }
  removeListener(listner){
    google.maps.event.removeListener(listner);
  }
}
