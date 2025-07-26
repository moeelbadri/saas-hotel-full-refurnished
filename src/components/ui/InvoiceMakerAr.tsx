// InvoiceComponent.js
import React, { useRef ,forwardRef} from 'react';
import { useReactToPrint } from 'react-to-print';
import { useSettingsStore } from "@/components/WizardForm/useStore";

import '../Invoice.css';
import '../index.css';
import { getDaysDiff } from '@/utils/helpers';
import {useSettings} from '@/hooks/settings'
// const targetRef:any = useRef();

//  const handlePrint = useReactToPrint({
//     content: () => targetRef.current,
//     documentTitle: 'page.pdf',
//   });
// const InvoiceComponent = () => {

const InvoiceComponent = forwardRef((props:any, ref:any) => {
  const {direction}=props;
  const {settings} = useSettings();
  const TempObj = useSettingsStore(state => state.TempObj);
  const VAT=settings!.data!.settings.vat/100;
  const bookingsdays=getDaysDiff(TempObj.end_date,TempObj.start_date);
  const rows:any[] = [];
  TempObj.bookingCabins.forEach((element:any) => {
    rows.push(
      <tr key={`cabin-${element.id}`}>
        <td className="Col-date">{TempObj.created_at.split("T")[0]}</td>
        <td className="Col-description">
          غرفة {element.CabinName} {element.breakfast ? " + الفطور - " : " - "} {TempObj.bookingGuests.length+1} نزلاء
        </td>
        <td className="Col-qty">{bookingsdays}</td>
        <td className="Col-rate">£{element.price}/يوم</td>
        <td className="Col-total">£{bookingsdays * element.price}</td>
      </tr>
    );
  
    element.amenities?.forEach((amenity:any) => {
      rows.push(
        <tr key={`amenity-${element.id}-${amenity.id}`}>
          <td className="Col-date">{TempObj.created_at.split("T")[0]}</td>
          <td className="Col-description">{amenity.name}</td>
          <td className="Col-qty">{bookingsdays}</td>
          <td className="Col-rate">£{amenity.price.split(" - ")[0] / bookingsdays}/يوم</td>
          <td className="Col-total">£{amenity.price.split(" - ")[0]}</td>
        </tr>
      );
    });
  });
     const dir = direction??"ltr";
  return (
    <div style={{direction:dir}}>
        {/* <button onClick={handlePrint}>PDFs</button> */}
    <div className="App-invoice-preview light-theme" ref={ref}>
      <div className="Invoice">
        <header className="Invoice-header">
          <h1 className="Logo">
            <span className="Logo-part-1">{settings!.data!.settings.hotel_name.toUpperCase()} </span>
            <span className="Logo-part-2"> فندق</span>
          </h1>
          <div className="Header-meta">
            <span>فندق {settings!.data!.settings.hotel_name}</span><br />
            {/* <span>
              Company reg. no.: <strong>098765432</strong>
            </span> */}
            <br />
            <span>
              VAT reg. no.: <strong>GB98765432</strong>
            </span>
          </div>
          <hr />
        </header>
        <div className="Invoice-body">
          <div className="Invoice-subjects">
            <div className="Invoice-subject Subject-provider">
              <small>Provider</small>
              <p>
            {settings!.data!.settings.hotel_name} Hotel<br />
            Hotel reg. no.: 098765432<br />
            {/* VAT reg. no.: GB98765432<br /> */}
            Basem Elbadri - Director<br />
             {settings!.data!.settings.address1}<br />
            {settings!.data!.settings.address2}<br />
            مصر
           </p>
           <small><br /></small>

              {/* <small>
                <br />Billing information
              </small>
              <p>
                BIC: ABCDGB21<br />
                IBAN: GB39 ABCD 0011 0011 0011 00<br />
              </p>
              <p>
                Account number: 01234567<br />
                Sort code: 01-00-01<br />
              </p> */}
            </div>
            <div className="Invoice-subject Subject-customer">
              <small>Customer(S)</small>
              <p>
                {TempObj.bookingGuests.map((element:any) => {
                  return <>{element.guests.fullName}{" - "}{element.guests.nationalID?(" ID No. : " + element.guests.nationalID):" : Under 16"}{" - "}{"Police Case Id : "+element?.police_case_id}<br /></>;
                })}
                <br />
                <br />
                <br />
                <br />
              </p>
            </div>
          </div>
          <div className="Invoice-the-invoice">
            <h2>Invoice</h2>
            <div className="Invoice-meta">
              <table className="Invoice-table">
                <thead>
                  <tr>
                    <th>Invoice Date</th>
                    <th>Invoice Number</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{TempObj.created_at.split("T")[0]}</td>
                    <td>INV-{TempObj.id}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>&nbsp;</p>
          </div>
          <div className="Invoice-details">
            <h3>Services provided</h3>
            <table className="Invoice-table Table-wide">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Day(s)</th>
                  <th>Rate</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                  {rows}
                <tr>
                  <td className="Col-date">{TempObj.created_at.split("T")[0]}</td>
                  <td className="Col-description">{TempObj.start_date}{" - "}{TempObj.end_date}</td>
                  <td className="Col-qty">${bookingsdays}days</td>
                  <td className="Col-rate">£${TempObj.total_price/bookingsdays}/day</td>
                  <td className="Col-total">£{TempObj.total_price}</td>
                </tr>
              </tbody>
            </table>
            <p>&nbsp;</p>
            <table className="Invoice-table Table-wide">
              <tbody>
                <tr>
                  <th>VAT Basis</th>
                  <th>VAT rate</th>
                  <th>VAT Amount</th>
                  <td rowSpan={2} className="Table-totals">
                    <table className="Totals-table">
                      <tbody>
                        <tr>
                          <th>Total</th>
                          <td>£{TempObj.total_price}</td>
                        </tr>
                        <tr>
                          <th>VAT</th>
                          <td>£{TempObj.total_price*VAT}</td>
                        </tr>
                        <tr>
                          <th>Total Payable</th>
                          <td>£{TempObj.total_price +(TempObj.total_price*VAT)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td>£{TempObj.total_price}</td>
                  <td>{Math.round(VAT*100)}%</td>
                  <td>£{TempObj.total_price*VAT}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <footer className="Invoice-footer">
          <hr />
          <small>
          Crown Emad el-deen Hotel &nbsp;Company reg. no.:&nbsp;098765432,
            &nbsp;VAT reg. no.:&nbsp;GB98765432, &nbsp;9 شارع عماد الدين,
            &nbsp;وسط البلد ، القاهرة &nbsp;مصر
          </small>
        </footer>
      </div>
    </div>
    </div>
)
})


export default InvoiceComponent;
