var ips = {};

const setIp = (mac, ip) => {
  ips[mac] = ip;
};

const getIpList = () => {
  var ipList = [];
  for (var key in ips) {
    ipList.push(ips[key]);
  }
  return ipList;
};

module.exports = { setIp, getIpList };
