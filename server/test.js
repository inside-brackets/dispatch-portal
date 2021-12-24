const moment = require("moment");
const id = "ID";
const reg = ",s*";
const str = "h, ID";
var regexp = new RegExp(reg, "i");
console.log(str.match(regexp));
console.log("regular expression: ", regexp);
