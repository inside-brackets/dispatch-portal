class Company {
  constructor(name, address, phone_number, agent_name, agent_email) {
    this.phone_number = phone_number;
    this.address = address;
    this.name = name;
    this.agent_name = agent_name;
    this.agent_email = agent_email;
  }
}

module.exports = Company;
