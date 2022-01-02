const moment = require("moment");

const usStates = {
  eastern: [
    "ME",
    "VT",
    "NH",
    "MA",
    "RI",
    "CT",
    "NJ",
    "NY",
    "MD",
    "PA",
    "DE",
    "MI",
    "OH",
    "WV",
    "VA",
    "SC",
    "NC",
    "KY",
    "IN",
    "FL",
    "GA",
  ],
  central: [
    "ND",
    "SD",
    "NE",
    "KS",
    "OK",
    "TX",
    "LA",
    "AR",
    "MO",
    "IA",
    "MN",
    "WI",
    "IL",
    "TN",
    "MS",
    "AL",
  ],
  mountain: ["MT", "ID", "WY", "UT", "CO", "AZ", "NM"],
  pasific: ["WA", "OR", "NV", "CA"],
};

const callAbleStates = (pst) => {
  let availableStates = [];
  pst = parseInt(moment(pst).format("H"));
  const mst = pst + 1;
  const cst = pst + 2;
  const nineAm = 9;
  if (pst >= nineAm) {
    availableStates = [
      ...usStates.pasific,
      ...usStates.mountain,
      ...usStates.central,
      ...usStates.eastern,
    ];
  } else if (mst >= nineAm) {
    availableStates = [
      ...usStates.mountain,
      ...usStates.central,
      ...usStates.eastern,
    ];
  } else if (cst >= nineAm) {
    availableStates = [...usStates.central, ...usStates.eastern];
  } else {
    availableStates = [...usStates.eastern];
  }
  return availableStates.map((item) => `, ${item}`).join("|");
};

module.exports = { callAbleStates };
