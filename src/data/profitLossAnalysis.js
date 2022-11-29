const invoices = [
  {
    _id: { $oid: "61e94edb7ba5474100ada33b" },
    loads: [{ $oid: "61e94d427ba5474100ada31f" }],
    carrierCompany: "ML TRUCKING INC",
    truckNumber: 312,
    comment: "",
    trailerType: "dryvan",
    dispatcher: { $oid: "61af570177c6a532c0bd7cb3" },
    sales: { $oid: "61af5137fcd4345924e26f0f" },
    startingDate: { $date: "2021-12-31T19:00:00.000Z" },
    endingDate: { $date: "2022-01-30T19:00:00.000Z" },
    dispatcherFee: 2500,
    totalLoadedMiles: 12,
    totalGross: 12,
    invoiceStatus: "cleared",
    mc_number: 4,
    driver: {
      name: "jamal",
      email_address: "ahmedkhalid9199@gmail.com",
      phone_number: "03174858384",
    },
    createdAt: { $date: "2022-01-20T12:00:27.684Z" },
    updatedAt: { $date: "2022-01-20T13:46:29.353Z" },
    __v: 0,
  },
];

const salary = [
  {
    _id: { $oid: "623df3d6d1623a2df8ced8ab" },
    invoices: [
      { $oid: "620ba30004d1fe0910b5a272" },
      { $oid: "6208f42f731e765048739c22" },
      { $oid: "61f909a2203f5e102476e143" },
    ],
    leaves: [],
    adjustment: [{ description: "", amount: 0 }],
    month: { $date: "2022-01-01T00:00:00.000Z" },
    user: { $oid: "61af5a0a77c6a532c0bd7d5f" },
    total: 25000,
    incentive: -20825,
    createdAt: { $date: "2022-03-25T16:54:46.646Z" },
    updatedAt: { $date: "2022-03-25T16:54:46.646Z" },
    __v: 0,
  },
  {
    _id: { $oid: "623df3d6d1623a2df8ced8ab" },
    invoices: [
      { $oid: "620ba30004d1fe0910b5a272" },
      { $oid: "6208f42f731e765048739c22" },
      { $oid: "61f909a2203f5e102476e143" },
    ],
    leaves: [],
    adjustment: [{ description: "", amount: 0 }],
    month: { $date: "2022-02-01T00:00:00.000Z" },
    user: { $oid: "61af5a0a77c6a532c0bd7d5f" },
    total: 30000,
    incentive: -20825,
    createdAt: { $date: "2022-03-25T16:54:46.646Z" },
    updatedAt: { $date: "2022-03-25T16:54:46.646Z" },
    __v: 0,
  },
  {
    _id: { $oid: "623df3d6d1623a2df8ced8ab" },
    invoices: [
      { $oid: "620ba30004d1fe0910b5a272" },
      { $oid: "6208f42f731e765048739c22" },
      { $oid: "61f909a2203f5e102476e143" },
    ],
    leaves: [],
    adjustment: [{ description: "", amount: 0 }],
    month: { $date: "2022-03-01T00:00:00.000Z" },
    user: { $oid: "61af5a0a77c6a532c0bd7d5f" },
    total: 35000,
    incentive: -20825,
    createdAt: { $date: "2022-03-25T16:54:46.646Z" },
    updatedAt: { $date: "2022-03-25T16:54:46.646Z" },
    __v: 0,
  },
  {
    _id: { $oid: "623df3d6d1623a2df8ced8ab" },
    invoices: [
      { $oid: "620ba30004d1fe0910b5a272" },
      { $oid: "6208f42f731e765048739c22" },
      { $oid: "61f909a2203f5e102476e143" },
    ],
    leaves: [],
    adjustment: [{ description: "", amount: 0 }],
    month: { $date: "2022-04-01T00:00:00.000Z" },
    user: { $oid: "61af5a0a77c6a532c0bd7d5f" },
    total: 20000,
    incentive: -20825,
    createdAt: { $date: "2022-03-25T16:54:46.646Z" },
    updatedAt: { $date: "2022-03-25T16:54:46.646Z" },
    __v: 0,
  },
  {
    _id: { $oid: "623df3d6d1623a2df8ced8ab" },
    invoices: [
      { $oid: "620ba30004d1fe0910b5a272" },
      { $oid: "6208f42f731e765048739c22" },
      { $oid: "61f909a2203f5e102476e143" },
    ],
    leaves: [],
    adjustment: [{ description: "", amount: 0 }],
    month: { $date: "2022-05-01T00:00:00.000Z" },
    user: { $oid: "61af5a0a77c6a532c0bd7d5f" },
    total: 20000,
    incentive: -20825,
    createdAt: { $date: "2022-03-25T16:54:46.646Z" },
    updatedAt: { $date: "2022-03-25T16:54:46.646Z" },
    __v: 0,
  },
];



salary.map((userSalary)=> {
const filteredInvoices =  invoices.filter((invoice)=>{
invoice.sales.$oid === userSalary.user,
invoice.endingDate === userSalary.month,
})


})