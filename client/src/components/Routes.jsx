import React, { useEffect, useState } from "react";

import { Route, Switch, Redirect } from "react-router-dom";

import Dashboard from "../pages/sales/Dashboard";
import DashboardAdmin from "../pages/admin/DashboardAdmin";
import AssignSales from "../pages/admin/AssignSales";
// import BusinessStats from "../pages/admin/BusinessStats";
// import Salary from "../pages/admin/Salary";
import Carriers from "../pages/admin/Carriers";
// import SettingsAdmin from "../pages/admin/Settings";
// import SpreadSheetAdmin from "../pages/admin/SpreadSheet";
// import TicketsAdmin from "../pages/admin/Tickets";
import SpreadSheet from "../pages/sales/SpreadSheet";
import Appointments from "../pages/sales/Appointments";
import AppointmentDetail from "../pages/sales/AppointmentDetail";
import TruckDetail from "../pages/dispatch/TruckDetail";
import Invoice from "../pages/admin/Invoice";
import Dialer from "../pages/sales/Dialer";
// import Tickets from "../pages/sales/Tickets";
import Profile from "../pages/Profile";
import MyTrucks from "../pages/dispatch/MyTrucks";
import { useSelector } from "react-redux";
import Users from "../pages/admin/Users";
import { useDispatch } from "react-redux";
import { salesActions } from "../store/sales";
import useHttp from "../hooks/use-https";
import { socket } from "..";
import Loads from "../pages/admin/Loads";
const Routes = () => {
  const { department } = useSelector((state) => state.user.user);
  const [refresh, setRefresh] = useState(true);
  const dispatch = useDispatch();
  const { sendRequest: fetchCarriers } = useHttp();

  const { company:selectedCompany } = useSelector((state)=>state.user);

  socket.on("sale-closed", (msg) => {
    if (department === "admin") {
      setRefresh((prev) => !prev);
    }
  });

  useEffect(() => {
    if (department === "admin") {
      const transformData = (data) => {
        dispatch(salesActions.setAndPrepare(data));
      };

      fetchCarriers(
        {
          url: `${process.env.REACT_APP_BACKEND_URL}/getcarriers`,
          method: "POST",
          headers: { "Content-Type": "application/json" },

          body: {
            c_status: "registered",
            "trucks.t_status": "new",
            company:selectedCompany.value,
          },
        },
        transformData
      );
    }
  }, [dispatch, department, fetchCarriers, refresh, selectedCompany ]);
  return department === "sales" ? (
    <Switch>
      <Route path="/" exact>
        <Redirect to="/dashboard" />
      </Route>
      <Route path="/dashboard" exact component={Dashboard} />
      <Route path="/spread_sheet" component={SpreadSheet} />
      <Route path="/appointments" exact component={Appointments} />
      <Route path="/appointments/:mc" component={AppointmentDetail} />
      <Route path="/dialer" component={Dialer} />
      {/* <Route path="/tickets" component={Tickets} /> */}
      <Route path="/profile" component={Profile} />
      <Route path="*">
        <h1>Not found</h1>
      </Route>
    </Switch>
  ) : department === "admin" ? (
    <Switch>
      <Route path="/" exact>
        <Redirect to="/dashboard" />
      </Route>
      <Route path="/dashboard" exact component={DashboardAdmin} />
      <Route path="/carriers" exact component={Carriers} />
      <Route path="/assignsales" exact component={AssignSales} />
      <Route path="/profile" component={Profile} />
      <Route path="/loads" component={Loads} />
      <Route path="/invoices" component={Invoice} />
      {/* <Route path="/businessstats" exact component={BusinessStats} />
      <Route path="/salary" exact component={Salary} />
      <Route path="/settings" exact component={SettingsAdmin} />
      <Route path="/spreadSheet" exact component={SpreadSheetAdmin} />
      <Route path="/tickets" exact component={TicketsAdmin} />
      <Route path="/tickets" exact component={TicketsAdmin} /> */}
      <Route path="/users" exact component={Users} />
      <Route path="*">
        <h1>Not found</h1>
      </Route>
    </Switch>
  ) : department === "dispatch" ? (
    <Switch>
      <Route path="/" exact>
        <Redirect to="/dashboard" />
      </Route>
      <Route path="/dashboard" exact component={Dashboard} />
      <Route path="/mytrucks" exact component={MyTrucks} />
      <Route path="/trucks/:mc/:truck?" component={TruckDetail} />
      <Route path="/profile" component={Profile} />

      <Route path="*">
        <h1>Not found</h1>
      </Route>
    </Switch>
  ) : (
    ""
  );
};

export default Routes;
