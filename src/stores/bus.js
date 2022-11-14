import { defineStore } from 'pinia'

export const useBusStore = defineStore({
    id: 'bus',
    state: () => ({
        buses: [
            {
                "id": 18,
                "name": "BANH B      120.00",
                "latitude": 47.5715121,
                "longitude": 18.3903412,
                "p_nw": -0.00187801385638384,
                "q_mvar": 4.35337180662255,
                "P_mes": 16.8462,
                "Q_mes": -2.2995,
                "U_mes": 1.010659
            },
            {
                "id": 19,
                "name": "BICS GY1    120.00",
                "latitude": 47.4907066,
                "longitude": 18.6358046,
                "p_nw": -0.00187801385638384,
                "q_mvar": 4.35337180662255,
                "P_mes": 8.9119,
                "Q_mes": -2.1863,
                "U_mes": 1.004326
            },
            {
                "id": 20,
                "name": "DORG B1     120.00",
                "latitude": 47.7223782,
                "longitude": 18.731435,
                "p_nw": -0.00187801385638384,
                "q_mvar": 4.35337180662255,
                "P_mes": 21.4992,
                "Q_mes": 0.1843,
                "U_mes": 0.991341
            }
        ],
        lines: [
            {
                "id": 20,
                "name": "BANH B      120.00_BICS GY1      120.00_1",
                "from_bus": 18,
                "to_bus": 19,
                "from_latitude": 47.5715121,
                "from_longitude": 18.3903412,
                "to_latitude": 47.4907066,
                "to_longitude": 18.6358046,
                "from_P": 3.66768002510071,
                "to_P": -3.76791000366211,
                "from_Q": -13.8576002120972,
                "to_Q": 15.2601003646851
            },
            {
                "id": 21,
                "name": "BANH B      120.00_DORG B1     120.00_1",
                "from_bus": 18,
                "to_bus": 20,
                "from_latitude": 47.5715121,
                "from_longitude": 18.3903412,
                "to_latitude": 47.7223782,
                "to_longitude": 18.731435,
                "from_P": 13.108099937439,
                "to_P": -13.0696001052856,
                "from_Q": -16.260799407959,
                "to_Q": 16.0620994567871
            },
            {
                "id": 22,
                "name": "BICS GY1      120.00_1_DORG B1     120.00_1",
                "from_bus": 19,
                "to_bus": 20,
                "from_latitude": 47.4907066,
                "from_longitude": 18.6358046,
                "to_latitude": 47.7223782,
                "to_longitude": 18.731435,
                "from_P": 35.3810005187988,
                "to_P": -35.5873985290527,
                "from_Q": -7.22066020965576,
                "to_Q": 7.39633989334106
            }
        ]
    }),
    actions: {
        setBusData(input) {
            this.buses = input
        },
        setLineData(input) {
            this.lines = input
        }
    },
    getters: {
        getBusById: (state) => {
          return (busId) => state.buses.find((bus) => bus.id === busId)
        },
      },
})