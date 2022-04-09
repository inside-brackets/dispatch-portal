import React, { useEffect, useState, Suspense, lazy } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { salesActions } from "../store/sales";
import { socket } from "..";
import useHttp from "../hooks/use-https";
import Loader from "react-loader-spinner";

// admin routes
const Invoice = lazy(() => import("../pages/admin/Invoice"));
const AddCarrier = lazy(() => import("../pages/admin/AddCarrier"));
const CarrierView = lazy(() => import("../pages/admin/CarrierView"));
const DashboardAdmin = lazy(() => import("../pages/admin/DashboardAdmin"));
const AssignSales = lazy(() => import("../pages/admin/AssignSales"));
const Carriers = lazy(() => import("../pages/admin/Carriers"));
const SearchCarrier = lazy(() => import("../pages/admin/SearchCarrier"));
const Loads = lazy(() => import("../pages/admin/Loads"));
const TruckDetails = lazy(() => import("../pages/admin/TruckDetails"));
const Users = lazy(() => import("../pages/admin/Users"));
const PdfTest = lazy(() => import("../components/PdfTest"));
const UserDetail = lazy(() => import("../pages/admin/UserDetail"));

// sales routes
const Dashboard = lazy(() => import("../pages/sales/Dashboard"));
const SpreadSheet = lazy(() => import("../pages/sales/SpreadSheet"));
const Appointments = lazy(() => import("../pages/sales/Appointments"));
const AppointmentDetail = lazy(() =>
  import("../pages/sales/AppointmentDetail")
);
const Dialer = lazy(() => import("../pages/sales/Dialer"));
const Profile = lazy(() => import("../pages/Profile"));

// dispatchers
const TruckDetail = lazy(() => import("../pages/dispatch/TruckDetail"));
const MyTrucks = lazy(() => import("../pages/dispatch/MyTrucks"));

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
    <Suspense
      fallback={
        <div className="spreadsheet__loader">
          <Loader
            type="MutatingDots"
            color="#349eff"
            height={100}
            width={100}
          />
        </div>
      }
    >
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
    </Suspense>
  ) : department === "admin" ? (
    <Suspense
      fallback={
        <div className="spreadsheet__loader">
          <Loader
            type="MutatingDots"
            color="#349eff"
            height={100}
            width={100}
          />
        </div>
      }
    >
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
        <Route path="/pdf" component={PdfTest} />
        <Route path="/invoices" component={Invoice} />
        <Route path="/users" exact component={Users} />
        <Route path="/user/:id" exact component={UserDetail} />
        
        <Route path="*">
          <h1>Not found</h1>
        </Route>
      </Switch>
    </Suspense>
  ) : department === "dispatch" ? (
    <Suspense
      fallback={
        <div className="spreadsheet__loader">
          <Loader
            type="MutatingDots"
            color="#349eff"
            height={100}
            width={100}
          />
        </div>
      }
    >
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
    </Suspense>
  ) : (
    ""
  );
};

export default Routes;
