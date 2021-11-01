class Truck {
  constructor(
    truck_number,
    vin_number,
    trailer_type,
    carry_limit,
    dispatcher,
    drivers
  ) {
    this.truck_number = truck_number;
    this.vin_number = vin_number;
    this.trailer_type = trailer_type;
    this.carry_limit = carry_limit;
    this.dispatcher = dispatcher;
    this.drivers = drivers;
  }
}

module.exports = Truck;
