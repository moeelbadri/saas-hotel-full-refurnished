"use client";
import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
:root {
    &, &.light-mode {
    /* Grey */
    -
    --color-grey-0:  #fff;
    --color-grey-50: #f9fafb;
    --color-grey-100: #f3f4f6;
    --color-grey-200: #e5e7eb;
    --color-grey-250: #dbdee3;
    --color-grey-300: #d1d5db;
    --color-grey-400: #9ca3af;
    --color-grey-500: #6b7280;
    --color-grey-600: #4b5563;
    --color-grey-700: #374151;
    --color-grey-800: #1f2937;
    --color-grey-900: #111827;

    --color-grey-table: #dbdee3;

    --color-blue-100: #e0f2fe;
    --color-blue-700: #0369a1;
    --color-green-100: #dcfce7;
    --color-green-700: #15803d;
    --color-yellow-100: #fef9c3;
    --color-yellow-700: #a16207;
    --color-silver-100: #e5e7eb;
    --color-silver-700: #374151;
    --color-indigo-100: #e0e7ff;
    --color-indigo-700: #4338ca;

    --color-red-100: #fee2e2;
    --color-red-700: #b91c1c;
    --color-red-800: #991b1b;

    --backdrop-color: rgba(255, 255, 255, 0.1);

    --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.04);
    --shadow-md: 0px 0.6rem 2.4rem rgba(0, 0, 0, 0.06);
    --shadow-lg: 0 2.4rem 3.2rem rgba(0, 0, 0, 0.12);
    

    --image-grayscale: 0;
    --image-opacity: 100%;
    }
    
    
    &.dark-mode {
    --color-grey-0: #18212f;
    --color-grey-50: #111827;
    --color-grey-100: #1f2937;
    --color-grey-200: #374151;
    --color-grey-300: #4b5563;
    --color-grey-400: #6b7280;
    --color-grey-500: #9ca3af;
    --color-grey-600: #d1d5db;
    --color-grey-700: #e5e7eb;
    --color-grey-800: #f3f4f6;
    --color-grey-900: #f9fafb;

    --color-grey-table : #1f2937;

    --color-blue-100: #075985;
    --color-blue-700: #e0f2fe;
    --color-green-100: #166534;
    --color-green-700: #dcfce7;
    --color-yellow-100: #854d0e;
    --color-yellow-700: #fef9c3;
    --color-silver-100: #374151;
    --color-silver-700: #f3f4f6;
    --color-indigo-100: #3730a3;
    --color-indigo-700: #e0e7ff;

    --color-red-100: #fee2e2;
    --color-red-700: #b91c1c;
    --color-red-800: #991b1b;

    --backdrop-color: rgba(0, 0, 0, 0.3);

    --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.4);
    --shadow-md: 0px 0.6rem 2.4rem rgba(0, 0, 0, 0.3);
    --shadow-lg: 0 2.4rem 3.2rem rgba(0, 0, 0, 0.4);

    --image-grayscale: 10%;
    --image-opacity: 90%;
    }
  
    /* Indigo */
    --color-brand-50: #eef2ff;
    --color-brand-100: #e0e7ff;
    --color-brand-200: #c7d2fe;
    --color-brand-500: #6366f1;
    --color-brand-600: #4f46e5;
    --color-brand-700: #4338ca;
    --color-brand-800: #3730a3;
    --color-brand-900: #312e81;
    
    /* Sky */
    --color-brand-50: #f0f9ff;
    --color-brand-100: #e0f2fe;
    --color-brand-200: #bae6fd;
    --color-brand-500: #38bdf8;
    --color-brand-600: #0ea5e9;
    --color-brand-700: #0284c7;
    --color-brand-800: #0369a1;
    --color-brand-900: #075985;
    
    /* Blue */
    --color-brand-50: #eef2ff;
    --color-brand-100: #dbeafe;
    --color-brand-200: #bfdbfe;
    --color-brand-500: #60a5fa;
    --color-brand-600: #3b82f6;
    --color-brand-700: #2563eb;
    --color-brand-800: #1d4ed8;
    --color-brand-900: #1e40af;
    


    --border-radius-tiny: 3px;
    --border-radius-sm: 5px;
    --border-radius-md: 7px;
    --border-radius-lg: 9px;


    }

    /* FONT WEIGHTS */

    --fw-extralight: 200;
    --fw-light: 300;
    --fw-normal: 400;
    --fw-medium: 500;
    --fw-semibold: 600;
    --fw-bold: 700;
    --fw-extrabold: 800;


    *,
    *::before,
    *::after {
    box-sizing: border-box;
    padding: 0;
    margin: 0;

    /* Creating animations for dark mode */
    transition: background-color 1.3s, border 1.3s;
    }

    html[dir="ltr"] {
      direction: ltr;
    }
    
    html[dir="rtl"] {
      direction: rtl;
    }
    :lang(ar){
       font-family: "Cairo", sans-serif;
    }

    body {
    font-family: "Poppins", sans-serif;
    color: var(--color-grey-700);
    
    transition: color 0.3s, background-color 0.3s;
    line-height: 1.5;
    font-size: 1.6rem;
      width: 100%;
      height: 100%;
    }
    html {
      font-size: 62.5%;
    }
     /* Mobile Responsive Styles */
    @media (min-width: 1201px) {
      html {
        font-size: 65%; /* Slightly smaller base font size for mobile */
      }
      
      body {
        font-size: 1.4rem;
      }
    }

    /* Mobile Responsive Styles */
    @media (max-width: 1200px) {
      html {
        font-size: 55%; /* Slightly smaller base font size for mobile */
      }
      
      body {
        font-size: 1.4rem;
      }
    }

    @media (max-width: 768px) {
      html {
        font-size: 50%; /* Even smaller for mobile devices */
      }
      
      body {
        font-size: 1.2rem;
      }
    }

    @media (max-width: 480px) {
      html {
        font-size: 45%; /* Smallest for very small screens */
      }
    }
        .scrollable {
          overflow-y: auto !important;
          scrollbar-width: thin;                    /* Firefox: make it thin */
          scrollbar-color: rgba(0,0,0,0.3) transparent; /* Firefox: thumb + track */
          z-index: 1000;
        }

        /* 2) WebKit browsers (Chrome, Edge, Safari) */
        .scrollable::-webkit-scrollbar {
          width: 4px;                                /* super skinny */
          height: 4px;                               /* if you scroll horizontally */
          background: transparent;                   /* no visible track */
        }

        .scrollable::-webkit-scrollbar-track {
          background: transparent;
        }

        .scrollable::-webkit-scrollbar-thumb {
          background-color: rgba(0,0,0,0.3);         /* light gray thumb */
          border-radius: 2px;                        /* round ends */
          transition: background-color 0.3s;
        }

        .scrollable::-webkit-scrollbar-thumb:hover {
          background-color: rgba(0,0,0,0.5);
        }

        /* 3) Optional: auto-hide until you hover */
        .scrollable::-webkit-scrollbar-thumb {
          opacity: 0;
        }
        .scrollable:hover::-webkit-scrollbar-thumb {
          opacity: 1;
        }

    .nice-dates-day.-highlight { color: BLUE }
    .nice-dates-day.-Booked { color: RED }
    
    /* Tooltip container */
    .tooltip {
      position: relative;
      display: inline-block;
      border-bottom: 1px dotted black; /* If you want dots under the hoverable text */
    }
    
    /* Tooltip text */
    .tooltip .tooltiptext {
      visibility: hidden;
      width: auto;
      background-color: black;
      color: #fff;
      text-align: center;
      padding: 5px 0;
      border-radius: 6px;
    
      /* Position the tooltip text */
      position: absolute;
      z-index: 1;
      bottom: 125%;
      left: 20%;
      margin-left: -50px;
    
      /* Fade in tooltip */
      opacity: 0;
      transition: opacity 0.3s;
    }
    
    /* Tooltip arrow */
    .tooltip .tooltiptext::after {
      content: "";
      position: absolute;
      top: 100%;
      left: 50%;
      margin-left: -5px;
      border-width: 5px;
      border-style: solid;
      border-color: #555 transparent transparent transparent;
    }
    
    /* Show the tooltip text when you mouse over the tooltip container */
    .tooltip:hover .tooltiptext {
      visibility: visible;
      opacity: 1;
    }

    input,
    button,
    textarea,
    select {
    font: inherit;
    color: inherit;
    }

    button {
    cursor: pointer;
    }

   *:disabled {
    cursor: not-allowed;
    }

    select:disabled,
    input:disabled {
    background-color: var(--color-grey-200);
    color: var(--color-grey-500);
    }

    input:focus,
    button:focus,
    textarea:focus,
    select:focus {
      outline: 2px solid var(--color-brand-600);
      outline-offset: -1px;
    }

    /* Parent selector, finally 😃 */
    button:has(svg) {
    line-height: 0;
    }

    a {
    color: inherit;
    text-decoration: none;
    }

    ul {
    list-style: none;
    }

    p,
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
    overflow-wrap: break-word;
    hyphens: auto;
    }
    .sc-feUZmu {
        width: 100%;
    }
    img {
    max-width: 100%;

    /* For dark mode */
    filter: grayscale(var(--image-grayscale)) opacity(var(--image-opacity));
    }
::-webkit-input-placeholder { /* Chrome/Opera/Safari */
  color: #FFFFFF;
}
::-moz-placeholder { /* Firefox 19+ */
color: #FFFFFF;
}
:-ms-input-placeholder { /* IE 10+ */
color: #FFFFFF;
}
:-moz-placeholder { /* Firefox 18- */
color: #FFFFFF;
}

`;
// #FFF8DC

export default GlobalStyles;

/*
FOR DARK MODE

--color-grey-0: #18212f;
--color-grey-50: #111827;
--color-grey-100: #1f2937;
--color-grey-200: #374151;
--color-grey-300: #4b5563;
--color-grey-400: #6b7280;
--color-grey-500: #9ca3af;
--color-grey-600: #d1d5db;
--color-grey-700: #e5e7eb;
--color-grey-800: #f3f4f6;
--color-grey-900: #f9fafb;

--color-blue-100: #075985;
--color-blue-700: #e0f2fe;
--color-green-100: #166534;
--color-green-700: #dcfce7;
--color-yellow-100: #854d0e;
--color-yellow-700: #fef9c3;
--color-silver-100: #374151;
--color-silver-700: #f3f4f6;
--color-indigo-100: #3730a3;
--color-indigo-700: #e0e7ff;

--color-red-100: #fee2e2;
--color-red-700: #b91c1c;
--color-red-800: #991b1b;

--backdrop-color: rgba(0, 0, 0, 0.3);

--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.4);
--shadow-md: 0px 0.6rem 2.4rem rgba(0, 0, 0, 0.3);
--shadow-lg: 0 2.4rem 3.2rem rgba(0, 0, 0, 0.4);

--image-grayscale: 10%;
--image-opacity: 90%;
*/
