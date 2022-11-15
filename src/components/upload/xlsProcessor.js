//import xlsx from 'node-xlsx'
const xlsx = require('xlsx')
import { useBusStore } from '@/stores/bus';

const E_SHEETS = ["bus", "line", "bus_geodata", "res_bus_est"]

const E_COLORS = {
    RED: '#bb2200',
    YELLOW: '#ddaa00',
    GREEN: '#33aa00',
    REDICON: 'location-48-red-small.png',
    YELLOWICON: 'location-48-yellow-small.png',
    GREENICON: 'location-48-green-small.png'
  }

export async function parseXLSX(file) {

    const promise = new Promise((resolve, reject) => {
        const fileReader = new FileReader()
        fileReader.readAsArrayBuffer(file)

        fileReader.onload = (e) => {
            processXLSX(e.target.result)
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

function processXLSX(buffer) {
    const workbook = xlsx.read(buffer)
    const busStore = useBusStore()

    let workSheets = {}
    let busData = []
    let lineData = []

    for (const sheetName of workbook.SheetNames) {
        if(E_SHEETS.includes(sheetName))
        workSheets[sheetName] = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    }

    for(let i = 0; i < workSheets['bus'].length; i++) {
        let newBus = {
            id: workSheets['bus'][i].ID,
            name: workSheets['bus'][i].name,
            latitude: workSheets['bus_geodata'][i].x,
            longitude: workSheets['bus_geodata'][i].y,
            P_mes: workSheets['bus'][i].P_mes,
            Q_mes: workSheets['bus'][i].Q_mes,
            U_mes: workSheets['bus'][i].U_mes,
            p_mw: workSheets['res_bus_est'][i].p_mw,
            q_mvar: workSheets['res_bus_est'][i].q_mvar,
            color: workSheets['bus'][i].Color == 1 ?  E_COLORS.REDICON: (workSheets['line'][i].Color == 2 ? E_COLORS.YELLOWICON : E_COLORS.GREENICON)
        }

        busData.push(newBus)
    }
    
    busStore.setBusData(busData)

    for(let i=0; i < workSheets['line'].length; i++) {
        const coords = checkLineOverlap(lineData,
            busStore.getBusById(workSheets['line'][i].from_bus).latitude,
            busStore.getBusById(workSheets['line'][i].from_bus).longitude,
            busStore.getBusById(workSheets['line'][i].to_bus).latitude,
            busStore.getBusById(workSheets['line'][i].to_bus).longitude
            )

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
            color: workSheets['line'][i].Color == 1 ?  E_COLORS.RED: (workSheets['line'][i].Color == 2 ? E_COLORS.YELLOW : E_COLORS.GREEN)
        }

        lineData.push(newLine)
    }
    busStore.setLineData(lineData)
}