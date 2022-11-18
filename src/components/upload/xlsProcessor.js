//import xlsx from 'node-xlsx'
const xlsx = require('xlsx')
import { useBusStore } from '@/stores/bus';

const E_SHEETS = ["bus", "line", "bus_geodata"]

const E_COLORS = {
    RED: '#fe0000',
    YELLOW: '#fdfe02',
    GREEN: '#0bff01',
    BLUE: '#011efe',
    MAGENTA: '#fe00f6',
    REDICON: 'location-48-red-small.png',
    YELLOWICON: 'location-48-yellow-small.png',
    GREENICON: 'location-48-green-small.png',
    BLUEICON: 'location-48-blue-small.png',
    MAGENTAICON: 'location-48-magenta-small.png',
  }

export async function parseXLSX(file, conversion) {

    const promise = new Promise((resolve, reject) => {
        const fileReader = new FileReader()
        fileReader.readAsArrayBuffer(file)

        fileReader.onload = (e) => {
            processXLSX(e.target.result, conversion)
            return true
        }
    })
}

function checkLineOverlap(lineData, from_lat, from_lng, to_lat, to_lng) {
    const offset = 0.0002

    let newCoords = {
        from_lat: from_lat,
        from_lng: from_lng,
        to_lat: to_lat,
        to_lng: to_lng
    }

    for(let i = 0; i < lineData.length; i++) {
        if (lineData[i].from_latitude === from_lat &&
            lineData[i].from_longitude === from_lng &&
            lineData[i].to_latitude === to_lat &&
            lineData[i].to_longitude === to_lng
        ) {
            newCoords.from_lat = from_lat > to_lat ? from_lat - offset : from_lat + offset
            newCoords.from_lng = from_lng > to_lng ? from_lng - offset : from_lng + offset
            newCoords.to_lat = to_lat > from_lat ? to_lat + offset : to_lat - offset
            newCoords.to_lng = to_lng > from_lng ? to_lng + offset : to_lng - offset
        }
    }

    return newCoords
}

function degToRad(deg) {
    return deg * (Math.PI / 180.0);
}

function radToDeg(radians)
{
  return radians * (180 / Math.PI);
}

function eov2wgs84(EOVcoords) {
    let eov_northing = EOVcoords.y;
    let eov_easting = EOVcoords.x;

    // eov -> hd72
    let g = 47.1 * Math.PI / 180;
    let m = 2 * (Math.atan(Math.exp((eov_northing - 200000) / 6379296.419)) - Math.PI / 4);
    let n = (eov_easting - 650000) / 6379296.419;
    let p = Math.asin(Math.cos(g) * Math.sin(m) + Math.sin(g) * Math.cos(m) * Math.cos(n));
    let q = Math.asin(Math.sin(n) * Math.cos(m) / Math.cos(p));
    let s = (p - ((47 + 7.0 / 60 + 20.0578 / 3600) * Math.PI / 180)) * 180 * 3600 / Math.PI;
    let t = (47 + 1.0 / 6) * Math.PI / 180;
    let w = (Math.pow(6378160, 2) - Math.pow(6356774.516, 2)) * Math.pow(Math.cos(t), 2) / Math.pow(6356774.516, 2);
    let z = 1.5 * w * Math.tan(t) / (180 * 3600 / Math.PI);
    let aa = 0.5 * w * (-1 - w + (1 + 5 * w) * Math.pow(Math.tan(t), 2)) / (Math.sqrt(1 + w)) / Math.pow((180 * 3600 / Math.PI), 2);
    let ab = t + (s * Math.sqrt(1 + w) - Math.pow(s, 2) * z + Math.pow(s, 3) * aa) / (180 * 3600 / Math.PI);
    let ac = (19.048571778 * Math.PI / 180) + q / 1.0007197049;

    // hd72 -> wgs84
    let j = 2 * ((6378160 - 6356774.516) / 6378160) - Math.pow(((6378160 - 6356774.516) / 6378160), 2);
    m = 6378160.0 / Math.sqrt(1 - j * Math.pow(Math.sin(ab), 2));
    n = m * Math.cos(ab) * Math.cos(ac);
    let o = m * Math.cos(ab) * Math.sin(ac);
    p = m * (1 - j) * Math.sin(ab);
    let x = 52.684 + 1.0000010191 * (n + degToRad(0.3729 / 3600) * o - degToRad(0.1063 / 3600) * p);
    let y = -71.194 + 1.0000010191 * (-n * degToRad(0.3729 / 3600) + o + p * degToRad(0.312 / 3600));
    z = -13.975 + 1.0000010191 * (n * degToRad(0.1063 / 3600) - o * degToRad(0.312 / 3600) + p);
    ab = 2 * ((6378137 - 6356752.3142) / 6378137) - Math.pow(((6378137 - 6356752.3142) / 6378137), 2);
    ac = (Math.pow(6378137, 2) - Math.pow(6356752.3142, 2)) / Math.pow(6356752.3142, 2);
    let ae = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    let af = Math.atan2(z * 6378137, ae * 6356752.3142);
    let ag = Math.atan2(z + ac * 6356752.3142 * Math.pow(Math.sin(af), 3), ae - ab * 6378137 * Math.pow(Math.cos(af), 3));
    let ah = Math.atan2(y, x);

    return {
        x: radToDeg(ag),
        y: radToDeg(ah)
    }
}                             

function processXLSX(buffer, conversion) {
    const workbook = xlsx.read(buffer)
    const busStore = useBusStore()

    let workSheets = {}
    let coordsData = []
    let busData = []
    let lineData = []

    //reading specified XLS sheets to json
    for (const sheetName of workbook.SheetNames) {
        if(E_SHEETS.includes(sheetName))
        workSheets[sheetName] = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    }

    //filling in coordsData
    for(let i = 0; i < workSheets['bus_geodata'].length; i++) {
        coordsData.push({
            id: workSheets['bus_geodata'][i].ID,
            x: workSheets['bus_geodata'][i].x,
            y: workSheets['bus_geodata'][i].y
        })
    }
    busStore.setCoordsData(coordsData)


    //filling in busData
    for(let i = 0; i < workSheets['bus'].length; i++) {
        let busColor = E_COLORS.BLUEICON

        switch (workSheets['bus'][i].Color) {
            case 1:
                busColor = E_COLORS.REDICON
                break
            case 2:
                busColor = E_COLORS.YELLOWICON
                break
            case 3:
                busColor = E_COLORS.GREENICON
                break
            case 4:
                busColor = E_COLORS.MAGENTAICON
                break
            default:
                busColor = E_COLORS.BLUEICON
        }

        let coords = {
            x: busStore.getCoordsById(workSheets['bus'][i].ID).x,
            y: busStore.getCoordsById(workSheets['bus'][i].ID).y
        }

        if (conversion) coords = eov2wgs84(coords)

        let newBus = {
            id: workSheets['bus'][i].ID,
            name: workSheets['bus'][i].name,
            latitude: coords.x,
            longitude: coords.y,
            P_mes: workSheets['bus'][i].P_mes,
            Q_mes: workSheets['bus'][i].Q_mes,
            U_mes: workSheets['bus'][i].U_mes,
            color: busColor
        }

        busData.push(newBus)
    }
    
    busStore.setBusData(busData)

    //filling in lineData
    for(let i=0; i < workSheets['line'].length; i++) {
        const coords = checkLineOverlap(lineData,
            busStore.getBusById(workSheets['line'][i].from_bus).latitude,
            busStore.getBusById(workSheets['line'][i].from_bus).longitude,
            busStore.getBusById(workSheets['line'][i].to_bus).latitude,
            busStore.getBusById(workSheets['line'][i].to_bus).longitude
        )

        let lineColor = E_COLORS.BLUE

        switch (workSheets['line'][i].Color) {
            case 1:
                lineColor = E_COLORS.RED
                break
            case 2:
                lineColor = E_COLORS.YELLOW
                break
            case 3:
                lineColor = E_COLORS.GREEN
                break
            case 4:
                lineColor = E_COLORS.MAGENTA
                break
            default:
                lineColor = E_COLORS.BLUE
        }

        let newLine = {
            id: workSheets['line'][i].ID,
            name: workSheets['line'][i].name,
            from_bus: workSheets['line'][i].from_bus,
            to_bus: workSheets['line'][i].to_bus,
            from_latitude: coords.from_lat,
            from_longitude: coords.from_lng,
            to_latitude: coords.to_lat,
            to_longitude: coords.to_lng,
            from_P: workSheets['line'][i].from_P,
            to_P: workSheets['line'][i].to_P,
            from_Q: workSheets['line'][i].from_Q,
            to_Q: workSheets['line'][i].to_Q,
            color: lineColor
        }

        lineData.push(newLine)
    }
    busStore.setLineData(lineData)

    console.log(busStore.getBusById(58))
    console.log(busStore.getBusById(459))
}