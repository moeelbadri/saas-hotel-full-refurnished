"use client";
import React, { useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import generatePDF from 'react-to-pdf';
import { useRef } from 'react';
import {InvoiceMaker,Button} from '@/components/ui';
import { useDarkMode,useMoveBack } from "@/hooks";
import { useRouter,useParams ,useSearchParams} from "next/navigation";
import { useSettingsStore } from '@/components/WizardForm/useStore';
import { LanguageToggle } from '@/components/utils';
const WhitePage = () => {
  const targetRef:any = useRef(null);
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const moveBack = useMoveBack();
  const router = useRouter();
  const { bookingId } = useParams();
  const searchParams =useSearchParams();
  useEffect(
       function() {

    isDarkMode ? null : (generatePDF(targetRef, { filename: 'Receipt.pdf' }));
    setTimeout(() => {
          
    }, 0);
    console.log("before if schanging back to dark mode",searchParams.get("DarkMode"),isDarkMode)

if((searchParams.get("DarkMode")==="true")!==isDarkMode){
  console.log("changing back to dark mode",searchParams.get("DarkMode"),isDarkMode)
  toggleDarkMode();
}
    setTimeout(() => router.push("/bookings/"+bookingId), 0);
  }, [router]); // Empty dependency array ensures this effect runs only once, when the component mounts

    const Component = () => {
        // const handlePrint = useReactToPrint({
        //     content: () => targetRef.current,
        //     documentTitle: 'page.pdf',
        //   });
        return (
           <div>
              {/* <Button variant="primary" onClick={() =>handlePrint}>Print PDF</Button> */}
              {/* <Button onClick={() => generatePDF(targetRef, {filename: 'Reciept.pdf'})} style={{float: 'left'}} variant="primary">Download Reciept</Button> */}
              <div style={{ display: 'block' }}>
            <InvoiceMaker ref={targetRef} direction={searchParams.get("Language")} darkmode={searchParams.get("DarkMode")} />
          </div>
           </div>
        )
     }
  return (
    <div style={{ backgroundColor: 'white', height: '100vh', width: '100vw' }}>
      <Component />
    </div>
  );
};

export default WhitePage;
