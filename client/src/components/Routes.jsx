import React, { useEffect, useState } from "react";

import { Route, Switch, Redirect } from "react-router-dom";

import Invoice from "../pages/admin/Invoice";
import AddCarrier from "../pages/admin/AddCarrier";
import CarrierView from "../pages/admin/CarrierView";
import DashboardAdmin from "../pages/admin/DashboardAdmin";
import AssignSales from "../pages/admin/AssignSales";
import Carriers from "../pages/admin/Carriers";
import SearchCarrier from "../pages/admin/SearchCarrier";

import Dashboard from "../pages/sales/Dashboard";
import SpreadSheet from "../pages/sales/SpreadSheet";
import Appointments from "../pages/sales/Appointments";
import AppointmentDetail from "../pages/sales/AppointmentDetail";
import Dialer from "../pages/sales/Dialer";
import Profile from "../pages/Profile";

import TruckDetail from "../pages/dispatch/TruckDetail";
import MyTrucks from "../pages/dispatch/MyTrucks";

import { useSelector } from "react-redux";
import Users from "../pages/admin/Users";
import { useDispatch } from "react-redux";
import { salesActions } from "../store/sales";
import useHttp from "../hooks/use-https";
import { socket } from "..";
import Loads from "../pages/admin/Loads";
import TruckDetails from "../pages/admin/TruckDetails";
const Routes = () => {
  const { department } = useSelector((state) => state.user.user);
  const [refresh, setRefresh] = useState(true);
  const dispatch = useDispatch();
  const { sendRequest: fetchCarriers } = useHttp();

  const { company: selectedCompany } = useSelector((state) => state.user);

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
            company: selectedCompany.value,
          },
        },
        transformData
      );
    }
  }, [dispatch, department, fetchCarriers, refresh, selectedCompany]);
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
      <Route path="/searchcarrier" exact component={SearchCarrier} />
      <Route path="/addcarrier/:mc" component={AddCarrier} />
      <Route path="/carrierview/:mc" exact component={CarrierView} />
      <Route path="/carrierview/:mc/:truck" exact component={TruckDetails} />
      <Route path="/assignsales" exact component={AssignSales} />
      <Route path="/profile" component={Profile} />
      <Route path="/loads" component={Loads} />
      <Route path="/invoices" component={Invoice} />
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
