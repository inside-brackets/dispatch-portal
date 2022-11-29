import React from "react";
import { Table } from "react-bootstrap";
import moment from "moment";

function IncentiveDispatchInvoices({ invoices }) {
  return (
    <Table>
      <thead>
        <tr>
          <th>No.</th>
          <th className="text-center">MC</th>
          <th className="text-center">Company</th>
          <th className="text-center">Truck</th>
          <th className="text-center">Date</th>
          <th className="text-center">Gross</th>
          <th className="text-center">Dispatcher Fee</th>
          <th className="text-center">Status</th>
        </tr>
      </thead>
      <tbody>
        {invoices && invoices.length > 0 ? (
          invoices.map((invoice, index) => {
            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td className="text-center">{invoice.mc_number}</td>
                <td className="text-center">{invoice.carrierCompany}</td>
                <td className="text-center">{invoice.truckNumber}</td>
                <td className="text-center">
                  {moment(invoice.paymentDate).format("ll")}
                </td>
                <td className="text-center">{"$ " + invoice.totalGross}</td>
                <td className="text-center">{"$ " + invoice.dispatcherFee}</td>
                <td className="text-center">{invoice.invoiceStatus}</td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan={8} className="text-center">
              No Invoices closed!
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
}

export default IncentiveDispatchInvoices;
