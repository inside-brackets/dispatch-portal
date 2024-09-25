// import React, { useEffect, useState, useRef } from "react";
// import MySelect from "../../components/UI/MySelect";
// import useHttp from "../../hooks/use-https";

// const Tickets = () => {
//   const { isLoading, error: httpError, sendRequest: fetchCarriers } = useHttp();

//   useEffect(() => {
//     const transformData = (data) => {
//       setCarriers(data);
//     };
//     fetchCarriers(
//       {
//         url: `/getusers`,
//         method: "POST",
//         headers: { "Content-Type": "application/json" },

//         body: {
//           // c_status: "closed",
//         },
//       },
//       transformData
//     );
//   }, [fetchCarriers]);

//   return (
//     <div>
//       <MySelect
//         isMulti={true}
//         // value={selectedFilter}
//         // onChange={searchByFilter}
//         icon="bx bx-filter-alt"
//         options={[
//           { label: "Closed ", value: "closed" },
//           { label: "Appointment ", value: "appointment" },
//           { label: "Active ", value: "active" },
//           { label: "Rejected ", value: "rejected" },
//           { label: "Non-active ", value: "non-active" },
//           { label: "Deactivated ", value: "deactivated" },
//         ]}
//       />
//     </div>
//   );
// };

// export default Tickets;
