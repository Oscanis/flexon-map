  /* eslint-disable no-undef */
import { computed } from '@vue/reactivity';

export function generateMarkers(map, busData) {
    for(let i = 0; i < busData.length; i++) {
        let pos = computed(() => ({
            lat: Number(busData[i].latitude),
            lng: Number(busData[i].longitude)
          }))
        createMarker(map, pos, busData[i])
    }
}

export function generateLines(map, lineData) {
  for(let i = 0; i < lineData.length; i++) {
    let lineFrom = computed(() => ({
        lat: Number(lineData[i].from_latitude),
        lng: Number(lineData[i].from_longitude)
      }))
      let lineTo = computed(() => ({
        lat: Number(lineData[i].to_latitude),
        lng: Number(lineData[i].to_longitude)
      }))

    createLine(map, lineFrom, lineTo, lineData[i])
}
}

function createMarker(map, pos, busData) {
    const details = '<h5>' + busData.name + '</h5>' +
                    '<p><b>P_mes:</b> ' + busData.P_mes + '</br>' +
                    '<b>Q_mes:</b> ' + busData.Q_mes + '</br>' +
                    '<b>U_mes:</b> ' + busData.U_mes + '</p>' +
                    '<p><b>p_nw:</b> ' + busData.p_mw + '</br>' +
                    '<b>q_mvar:</b> ' + busData.q_mvar + '</p>';

    const marker = new google.maps.Marker({
        position: pos.value,
        map: map,
        title: busData.name,
        icon: busData.color
    });

    const infoWindow = new google.maps.InfoWindow({
        content: details,
        ariaLabel: busData.name,
      });

      marker.addListener("click", () => {
        infoWindow.open({
          anchor: marker,
          map,
      });
    });
}

function createLine(map, lineFrom, lineTo, lineData) {
  const details = '<h5>' + lineData.name + '</h5>' +
                  '<p><b>from_P:</b> ' + lineData.from_P + '</br>' +
                  '<b>to_P:</b> ' + lineData.to_P + '</br>' +
                  '<b>from_Q:</b> ' + lineData.from_Q + '</br>' +
                  '<b>to_Q:</b> ' + lineData.to_Q + '</p>';

  const line = new google.maps.Polyline({
    path: [lineFrom.value, lineTo.value],
    map: map,
    strokeColor: lineData.color,
    strokeOpacity: 0.6,
    strokeWeight: 4,
  })

  const infoWindow = new google.maps.InfoWindow({
    content: details,
    ariaLabel: lineData.name,
  });

  line.addListener("click", (event) => {
    infoWindow.setPosition(event.latLng);
    infoWindow.open({
      anchor: line,
      map,
  });
});
}