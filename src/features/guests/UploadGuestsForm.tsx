"use client";
import { FileInput } from "@/components/form";
import * as XLSX from "xlsx";
import { useEffect, useState } from "react";
import {usePostGuests} from "@/hooks/guests";
const excelDateToJSDate = (excelDate: number): Date => {
    // Excel's epoch starts on January 1, 1900
    const excelEpoch = new Date(1900, 0, 1);
    // Subtract 1 because Excel dates include the fake date February 29, 1900
    const jsDate = new Date(
        excelEpoch.getTime() + (excelDate - 1) * 24 * 60 * 60 * 1000
    );
    return jsDate;
};
const excelTimeToJSDate = (seconds: number): Date => {
    // Convert seconds since midnight to hours, minutes, and seconds
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const jsDate = new Date();
    jsDate.setHours(hours, minutes, secs, 0); // Set hours, minutes, seconds, and milliseconds
    return jsDate;
};
function readerXsl(e: any, setData: any) {
    const reader = new FileReader();
    reader.readAsBinaryString(e.target.files[0]);
    reader.onload = function (x) {
        const data = x?.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);
        let found = false;
        let header: any;
        let headerI = 0;
        json.forEach((item: any, index: number) => {
            if (index > 100) return;
            if (found) return;
            const allKeysAreStrings = Object.keys(item).every(
                (key) =>
                    typeof item[key] === "string" &&
                    Object.keys(item).length > 8
            );
            header = item;
            if (allKeysAreStrings) {
                Object.keys(item).forEach((key: any,index) => {
                    let value = item[key];
                    if(value[value.length-1]==="ة"){
                        value = value.slice(0, -1) + "ه";
                        item[key] = value;
                    }
                })
                headerI = index;
                found = true;
            }
        });
        const renamedArray: any[] = json.map((obj: any, index: number) => {
            if (index <= headerI) return;
            if(Object.keys(obj).length<4) return;
            const renamedObject: any = {};
            Object.keys(obj).forEach((key: string) => {
                const newKey = header[key] || key; // Use the corresponding name if available, otherwise keep the original key
                renamedObject[newKey] = obj[key];
                Object.keys(renamedObject).forEach((key: string) => {
                    if (key.includes("تاريخ")) {
                        if (typeof renamedObject[key] === "number") {
                            const date = excelDateToJSDate(
                                renamedObject[key]
                            )?.toISOString();
                            renamedObject[key] = date.toString();
                        }
                    }else if(key.includes("وقت")){
                        if (typeof renamedObject[key] === "number") {
                            const date = excelTimeToJSDate(
                                renamedObject[key]
                            )?.toISOString();
                            renamedObject[key] = date.toString();
                        }
                    }
                });
            });
            return renamedObject;
        });
        setData(renamedArray);
        return renamedArray;
    };
}

import { FormRow } from "@/components/form";
import { Button, Spinner } from "@/components/ui";
import { Row } from "@/components/layout";

export default function ({ onCloseModal }: { onCloseModal?: () => void }) {
    const [Data, setData] = useState([]);
    const Fdata=[] as any[];
    const {createGuests,isCreating} = usePostGuests();
    if(isCreating) return <Spinner/>;
    return (
        <>
            <h2 style={{ textAlign: "center" }}>Upload Guests</h2>
            <Row>
                <p>Upload File :</p>
                <FileInput
                    accept="*.xls*"
                    // onChange={(e:any) => readXlsxFile(e?.target.files[0]).then((data)=>{console.log(data)})}
                    onChange={(e: any) => readerXsl(e, setData)}
                />
            </Row>
            <Row>
                <p>Action :</p>
            <Button type="submit" disabled={false} onClick={() => createGuests(Fdata)}>
                        {"Upload Guests"}
                    </Button>
                    <Button type="submit" disabled={false} onClick={() => createGuests(Fdata)}>
                        {"Upload Bookings"}
                    </Button>
            </Row>
            <table>
                <thead>
                    <tr>
                        <th style={{ padding: "10px" }}>Guest Name</th>
                        <th style={{ padding: "10px" }}>ID</th>
                        <th style={{ padding: "10px" }}>phone number</th>
                        <th style={{ padding: "10px" }}>start Date</th>
                        <th style={{ padding: "10px" }}>Checkin</th>
                        <th style={{ padding: "10px" }}>end Date</th>
                        <th style={{ padding: "10px" }}>Checkout</th>
                        <th style={{ padding: "10px" }}>Room Number</th>
                        <th style={{ padding: "10px" }}>Police case id</th>
                        <th style={{ padding: "10px" }}>Extra Info</th>
                    </tr>
                </thead>
                <tbody>
                    {Data.map((item:any,index:number)=>{
                        if(item===undefined) return;
                        item["وقت الوصول"] = (((item?.["تاريخ الوصول"]?.split("T")[0])??""+(item?.["وقت الوصول"]?"T":"")+((item?.["وقت الوصول"]?.split("T")[1])??"")));
                        item["وقت المغادره"] = (((item?.["تاريخ المغادره"]?.split("T")[0])??""+(item?.["وقت المغادره"]?"T":"")+((item?.["وقت المغادره"]?.split("T")[1])??"")));
                        Fdata.push(item);
                        return(
                            <tr key={index}>
                                <td style={{ padding: "10px" }}>{item?.["اسم النزيل"]??"-"}</td>
                                <td style={{ padding: "10px" }}>{item?.["الرقم القومي او جواز سفر"]??"-"}</td>
                                <td style={{ padding: "10px" }}>{item?.["رقم التليفون"]??"-"}</td>
                                <td style={{ padding: "10px" }}>{item?.["تاريخ الوصول"]??"-"}</td>
                                <td style={{ padding: "10px" }}>{item?.["وقت الوصول"]??"-"}</td>
                                <td style={{ padding: "10px" }}>{item?.["تاريخ المغادره"]??"-"}</td>
                                <td style={{ padding: "10px" }}>{item?.["وقت المغادره"]??"-"}</td>
                                <td style={{ padding: "10px" }}>{item?.["رقم الغرفه"]??"-"}</td>
                                <td style={{ padding: "10px" }}>{item?.["رقم الشرطه"]??"-"}</td>
                                <td style={{ padding: "10px" }}>{item?.["ملاحظات"]??"-"}</td>
                            </tr>   
                        )
            })}
                </tbody>
            </table>

            <FormRow>
                <>
                    <Button
                        variant="secondary"
                        type="reset"
                        onClick={() => onCloseModal?.()}
                    >
                        Cancel
                    </Button>
                </>
            </FormRow>
        </>
    );
}
