/* eslint-disable no-undef */
export default class GoogleMap {
    map = null;
    polyLine = null;
    curPosMarker = null;
    polyMarkers = [];
    drawPolygon = null;
    polyLineIconPath = google.maps.SymbolPath.CIRCLE;
  constructor($target, {zoom, center}){
    this.map = new google.maps.Map($target, {
      zoom,
      center
    });
  }
  setCenter(pos){
    this.map.setCenter(pos);
  }
  createLatLng(position){
    return new google.maps.LatLng(position.lat, position.lng)
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
  createPolygon(){
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
    this.drawPolygon = polygon;
    return coords;
  }
  removePolygon(){
    this.drawPolygon.setMap(null);
    this.drawPolygon = null;
  }
  createMarker(option){
    const marker = new google.maps.Marker(option);
    marker.setMap(this.map);
    return marker
  }
  createPolyLineMarker(option,event, isFirst){
    this.polyLine.getPath().push(option.position);
    const marker = this.createMarker(option);
    Object.entries(event).forEach(([key, func]) => {
      marker.addListener(key, func);
    })
    this.polyMarkers.push(marker);
    if(isFirst)this.curPosMarker = marker;
    return marker;
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
