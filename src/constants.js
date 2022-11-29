const backend_host = "api-" + window.location.host;

const backend_base_url = window.location.origin.replace(
  window.location.host,
  backend_host
);
const ENV = {
  backend_base_url,
};

export default ENV;
