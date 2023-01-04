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
// const CarrierView = lazy(() => import("../pages/admin/CarrierView"));
const CarrierView = lazy(() => import("../sharedPages/CarrierDetail"));
const DashboardAdmin = lazy(() => import("../pages/admin/DashboardAdmin"));
const AssignSales = lazy(() => import("../pages/admin/AssignSales"));
const Carriers = lazy(() => import("../pages/admin/Carriers"));
const SearchCarrier = lazy(() => import("../pages/admin/SearchCarrier"));
const Loads = lazy(() => import("../pages/admin/Loads"));
const TruckDetails = lazy(() => import("../pages/admin/TruckDetails"));
const Users = lazy(() => import("../sharedPages/Users"));
const PdfTest = lazy(() => import("../components/PdfTest"));
const UserDetail = lazy(() => import("../pages/admin/UserDetail"));
const AdminReport = lazy(() => import("../pages/admin/Report"));

// sales routes
const Dashboard = lazy(() => import("../pages/sales/Dashboard"));
const SpreadSheet = lazy(() => import("../pages/sales/SpreadSheet"));
const Appointments = lazy(() => import("../pages/sales/Appointments"));
const AppointmentDetail = lazy(() =>
  import("../pages/sales/AppointmentDetail")
);
const Dialer = lazy(() => import("../pages/sales/Dialer"));
const Profile = lazy(() => import("../pages/Profile"));

// sales manager routes
const SMDashboard = lazy(() => import("../pages/salesManager/Dashboard"));
const MCSeries = lazy(() => import("../pages/salesManager/MCSeries"));

// dispatchers
const TruckDetail = lazy(() => import("../pages/dispatch/TruckDetail"));
const MyTrucks = lazy(() => import("../pages/dispatch/MyTrucks"));
const CarrierReport = lazy(() => import("../pages/dispatch/CarrierReport"));
const Report = lazy(() => import("../pages/dispatch/Report"));
const DispatchInvoices = lazy(() => import("../pages/dispatch/Invoices"));

// HR
const HRDashboard = lazy(() => import("../pages/HR/Dashboard"));
const Interviews = lazy(() => import("../pages/HR/Interviews"));
const InterviewsDetail = lazy(() => import("../pages/HR/InterviewDetail"));

//Accounts
const AccountsDashboard = lazy(() => import("../pages/accounts/Dashboard"));
const Expenses = lazy(() => import("../pages/accounts/Expenses"));
const Salaries = lazy(() => import("../pages/admin/Salaries"));
const SalaryDetails = lazy(() => import("../pages/admin/SalaryDetails"));

const Routes = () => {
  const { department, designation } = useSelector((state) => state.user.user);
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
          url: `/getcarriers`,
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
    designation === "manager" ? (
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
          <Route path="/dashboard" exact component={SMDashboard} />
          <Route path="/carriers" exact component={Carriers} />
          <Route path="/searchcarrier" exact component={SearchCarrier} />
          <Route path="/addcarrier/:mc" component={AddCarrier} />
          <Route path="/carrierview/:mc" exact component={CarrierView} />
          <Route
            path="/carrierview/:mc/:truck"
            exact
            component={TruckDetails}
          />
          <Route path="/users" exact component={Users} />
          <Route path="/users/:id" exact component={UserDetail} />
          {/* <Route path="/spread_sheet" component={SpreadSheet} /> */}
          <Route path="/appointments" exact component={Appointments} />
          <Route path="/carrierview/:mc" component={CarrierView} />
          <Route path="/carrierdocument/:mc" exact component={CarrierView} />
          <Route path="/dialer" component={Dialer} />
          <Route path="/settings" component={MCSeries} />
          <Route path="/profile" component={Profile} />
          <Route path="*">
            <h1>Not found</h1>
          </Route>
        </Switch>
      </Suspense>
    ) : (
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
          <Route path="/appointments_old/:mc" component={AppointmentDetail} />
          <Route path="/carrierview/:mc" component={CarrierView} />
          <Route path="/carrierdocument/:mc" exact component={CarrierView} />
          <Route path="/dialer" component={Dialer} />
          <Route path="/profile" component={Profile} />
          <Route path="*">
            <h1>Not found</h1>
          </Route>
        </Switch>
      </Suspense>
    )
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
        <Route path="/carrierdocument/:mc" exact component={CarrierView} />
        <Route path="/carrierview/:mc/:truck" exact component={TruckDetails} />
        <Route path="/assignsales" exact component={AssignSales} />
        <Route path="/profile" component={Profile} />
        <Route path="/loads" component={Loads} />
        <Route path="/pdf" component={PdfTest} />
        <Route path="/invoices" component={Invoice} />
        <Route path="/users" exact component={Users} />
        <Route path="/users/:id" exact component={UserDetail} />
        <Route path="/reports" exact component={AdminReport} />
        <Route path="/reports/:id" component={Report} />
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
        <Route path="/reports" component={CarrierReport} />
        <Route path="/generate-report/:id?" component={Report} />
        <Route path="/invoices" component={DispatchInvoices} />

        <Route path="*">
          <h1>Not found</h1>
        </Route>
      </Switch>
    </Suspense>
  ) : department === "HR" ? (
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
        <Route path="/dashboard" exact component={HRDashboard} />
        <Route path="/users" exact component={Users} />
        <Route path="/users/:id" exact component={UserDetail} />
        <Route path="/profile" component={Profile} />
        <Route path="/interviews" component={Interviews} exact />
        <Route path="/interviews/create/:id?" component={InterviewsDetail} />
        <Route path="*">
          <h1>Not found</h1>
        </Route>
      </Switch>
    </Suspense>
  ) : department === "accounts" ? (
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
        <Route path="/dashboard" exact component={AccountsDashboard} />
        <Route path="/expenses" exact component={Expenses} />
        <Route path="/salaries" component={Salaries} />
        <Route path="/salary/:year/:month/:id" component={SalaryDetails} />
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
