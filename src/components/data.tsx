export interface ColourOption {
  readonly value: string;
  readonly label: string;
  readonly arlabel?: string;
  readonly color?: string;
  readonly isFixed?: boolean;
  readonly isDisabled?: boolean;
  readonly lang?: string;
}
export const roles: readonly ColourOption[]  = [
  { value: 'CoOwner', label: 'co-owner', color: 'yellow', isFixed: true },
{ value: 'cashier', label: 'cashier', color: 'red', isDisabled: false }
];
export const colourOptions: readonly ColourOption[] = [
  { value: 'CoOwner', label: 'co-owner', color: 'green', isFixed: true },
  { value: 'cashier', label: 'cashier', color: '#0052CC', isDisabled: false },
  { value: 'storage', label: 'storage', color: '#5243AA' },
  { value: 'SEO', label: 'SEO', color: '#FF5630', isFixed: true },
];
export const familyRolesOptions: readonly ColourOption[] = [
  { value: 'Father', label: 'Father', color: '#FFFFFF' },
  { value: 'StepFather', label: 'StepFather', color: '#FFFFFF' },
  { value: 'Mother', label: 'Mother', color: '#FFFFFF' },
  { value: 'Fiance', label: 'Fiance', color: '#FFFFFF' },
  { value: 'Fiancee', label: 'Fiancee', color: '#FFFFFF' },
  { value: 'StepMother', label: 'StepMother', color: '#FFFFFF' },
  { value: 'Son', label: 'Son', color: '#FFFFFF' },
  { value: 'Daughter', label: 'Daughter', color: '#FFFFFF' },
  { value: 'Grandfather', label: 'GrandFather', color: '#FFFFFF' },
  { value: 'GrandMother', label: 'GrandMother', color: '#FFFFFF' },
  { value: 'Cousin', label: 'Cousin', color: '#FFFFFF' },
  { value: 'Uncle', label: 'Uncle', color: '#FFFFFF' },

]
export interface FlavourOption {
  readonly value: string;
  readonly label: string;
  readonly rating: string;
}

export const flavourOptions: readonly FlavourOption[] = [
  { value: 'vanilla', label: 'Vanilla', rating: 'safe' },
  { value: 'chocolate', label: 'Chocolate', rating: 'good' },
  { value: 'strawberry', label: 'Strawberry', rating: 'wild' },
  { value: 'salted-caramel', label: 'Salted Caramel', rating: 'crazy' },
];
export interface CountryOption {
  readonly value: string;
  readonly label: string; 
  readonly arlabel: string;
  readonly countryFlag?: string;
  readonly color?: string;
}
// make new value in each object in countryOptions countryFlag = https://flagcdn.com/${Member.nationality.value.toLowerCase()}.svg
export const countryOptions: readonly CountryOption[] = 
[
  {
      "value": "MD",
      "label": "Moldova",
      "arlabel": "مولدوڤا",
       "countryFlag": "md"
      },
  {
      "value": "US",
      "label": "United States of America",
      "arlabel": "الولايات المتحدة",
      "countryFlag": "us"
      },
  {
      "value": "YT",
      "label": "Mayotte",
      "arlabel": "مايوت",
      "countryFlag": "yt"
      },
  {
      "value": "NR",
      "label": "Nauru",
      "arlabel": "ناورو",
      "countryFlag": "nr"
      },
  {
      "value": "MZ",
      "label": "Mozambique",
      "arlabel": "موزمبيق"
      },
  {
      "value": "BR",
      "label": "Brazil",
      "arlabel": "البرازيل"
      },
  {
      "value": "CV",
      "label": "Cape Verde",
      "arlabel": "كابو فيردي"
      },
  {
      "value": "GQ",
      "label": "Equatorial Guinea",
      "arlabel": "غينيا الاستوائية"
      },
  {
      "value": "AL",
      "label": "Albania",
      "arlabel": "ألبانيا"
      },
  {
      "value": "VI",
      "label": "United States Virgin Islands",
      "arlabel": "جزر العذراء الامريكية"
      },
  {
      "value": "NU",
      "label": "Niue",
      "arlabel": "نييوي"
      },
  {
      "value": "PW",
      "label": "Palau",
      "arlabel": "بالاو"
      },
  {
      "value": "NG",
      "label": "Nigeria",
      "arlabel": "نيجيريا"
      },
  {
      "value": "VG",
      "label": "British Virgin Islands",
      "arlabel": "جزر العذراء"
      },
  {
      "value": "GM",
      "label": "Gambia",
      "arlabel": "غامبيا"
      },
  {
      "value": "SO",
      "label": "Somalia",
      "arlabel": "الصومال"
      },
  {
      "value": "YE",
      "label": "Yemen",
      "arlabel": "اليمن"
      },
  {
      "value": "MY",
      "label": "Malaysia",
      "arlabel": "ماليزيا"
      },
  {
      "value": "DM",
      "label": "Dominica",
      "arlabel": "دومينيكا"
      },
  {
      "value": "GB",
      "label": "United Kingdom",
      "arlabel": "المملكة المتحدة"
      },
  {
      "value": "MG",
      "label": "Madagascar",
      "arlabel": "مدغشقر"
      },
  {
      "value": "EH",
      "label": "Western Sahara",
      "arlabel": "الصحراء الغربية"
      },
  {
      "value": "CY",
      "label": "Cyprus",
      "arlabel": "قبرص"
      },
  {
      "value": "AG",
      "label": "Antigua and Barbuda",
      "arlabel": "أنتيغوا وباربودا"
      },
  {
      "value": "IE",
      "label": "Ireland",
      "arlabel": "أيرلندا"
      },
  {
      "value": "PY",
      "label": "Paraguay",
      "arlabel": "باراغواي"
      },
  {
      "value": "LK",
      "label": "Sri Lanka",
      "arlabel": "سريلانكا"
      },
  {
      "value": "ZA",
      "label": "South Africa",
      "arlabel": "جنوب أفريقيا"
      },
  {
      "value": "KW",
      "label": "Kuwait",
      "arlabel": "الكويت"
      },
  {
      "value": "DZ",
      "label": "Algeria",
      "arlabel": "الجزائر"
      },
  {
      "value": "HR",
      "label": "Croatia",
      "arlabel": "كرواتيا"
      },
  {
      "value": "MQ",
      "label": "Martinique",
      "arlabel": "مارتينيك"
      },
  {
      "value": "SL",
      "label": "Sierra Leone",
      "arlabel": "سيراليون"
      },
  {
      "value": "MP",
      "label": "Northern Mariana Islands",
      "arlabel": "جزر ماريانا الشمالية"
      },
  {
      "value": "RW",
      "label": "Rwanda",
      "arlabel": "رواندا"
      },
  {
      "value": "SY",
      "label": "Syria",
      "arlabel": "سوريا"
      },
  {
      "value": "VC",
      "label": "Saint Vincent and the Grenadines",
      "arlabel": "سانت فينسنت والغرينادين"
      },
  {
      "value": "XK",
      "label": "Kosovo",
      "arlabel": "كوسوفو"
      },
  {
      "value": "LC",
      "label": "Saint Lucia",
      "arlabel": "سانت لوسيا"
      },
  {
      "value": "HN",
      "label": "Honduras",
      "arlabel": "هندوراس"
      },
  {
      "value": "JO",
      "label": "Jordan",
      "arlabel": "الأردن"
      },
  {
      "value": "TV",
      "label": "Tuvalu",
      "arlabel": "توفالو"
      },
  {
      "value": "NP",
      "label": "Nepal",
      "arlabel": "نيبال"
      },
  {
      "value": "LR",
      "label": "Liberia",
      "arlabel": "ليبيريا"
      },
  {
      "value": "HM",
      "label": "Heard Island and McDonald Islands",
      "arlabel": "جزيرة هيرد وجزر ماكدونالد"
      },
  {
      "value": "AT",
      "label": "Austria",
      "arlabel": "النمسا"
      },
  {
      "value": "GG",
      "label": "Guernsey",
      "arlabel": "غيرنزي"
      },
  {
      "value": "CF",
      "label": "Central African Republic",
      "arlabel": "جمهورية أفريقيا الوسطى"
      },
  {
      "value": "MR",
      "label": "Mauritania",
      "arlabel": "موريتانيا"
      },
  {
      "value": "DJ",
      "label": "Djibouti",
      "arlabel": "جيبوتي"
      },
  {
      "value": "FJ",
      "label": "Fiji",
      "arlabel": "فيجي"
      },
  {
      "value": "NO",
      "label": "Norway",
      "arlabel": "النرويج"
      },
  {
      "value": "LV",
      "label": "Latvia",
      "arlabel": "لاتفيا"
      },
  {
      "value": "FK",
      "label": "Falkland Islands",
      "arlabel": "جزر فوكلاند"
      },
  {
      "value": "KZ",
      "label": "Kazakhstan",
      "arlabel": "كازاخستان"
      },
  {
      "value": "AX",
      "label": "Åland Islands",
      "arlabel": "جزر أولاند"
      },
  {
      "value": "TM",
      "label": "Turkmenistan",
      "arlabel": "تركمانستان"
      },
  {
      "value": "CC",
      "label": "Cocos (Keeling) Islands",
      "arlabel": "جزر كوكوس"
      },
  {
      "value": "BG",
      "label": "Bulgaria",
      "arlabel": "بلغاريا"
      },
  {
      "value": "TK",
      "label": "Tokelau",
      "arlabel": "توكيلاو"
      },
  {
      "value": "NC",
      "label": "New Caledonia",
      "arlabel": "كاليدونيا الجديدة"
      },
  {
      "value": "BB",
      "label": "Barbados",
      "arlabel": "باربادوس"
      },
  {
      "value": "ST",
      "label": "São Tomé and Príncipe",
      "arlabel": "ساو تومي وبرينسيب"
      },
  {
      "value": "AQ",
      "label": "Antarctica",
      "arlabel": "أنتارتيكا"
      },
  {
      "value": "BN",
      "label": "Brunei",
      "arlabel": "بروناي"
      },
  {
      "value": "BT",
      "label": "Bhutan",
      "arlabel": "بوتان"
      },
  {
      "value": "CM",
      "label": "Cameroon",
      "arlabel": "الكاميرون"
      },
  {
      "value": "AR",
      "label": "Argentina",
      "arlabel": "الأرجنتين"
      },
  {
      "value": "AZ",
      "label": "Azerbaijan",
      "arlabel": "أذربيجان"
      },
  {
      "value": "MX",
      "label": "Mexico",
      "arlabel": "المسكيك"
      },
  {
      "value": "MA",
      "label": "Morocco",
      "arlabel": "المغرب"
      },
  {
      "value": "GT",
      "label": "Guatemala",
      "arlabel": "غواتيمالا"
      },
  {
      "value": "KE",
      "label": "Kenya",
      "arlabel": "كينيا"
      },
  {
      "value": "MT",
      "label": "Malta",
      "arlabel": "مالطا"
      },
  {
      "value": "CZ",
      "label": "Czechia",
      "arlabel": "التشيك"
      },
  {
      "value": "GI",
      "label": "Gibraltar",
      "arlabel": "جبل طارق"
      },
  {
      "value": "AW",
      "label": "Aruba",
      "arlabel": "أروبا"
      },
  {
      "value": "BL",
      "label": "Saint Barthélemy",
      "arlabel": "سان بارتليمي"
      },
  {
      "value": "MC",
      "label": "Monaco",
      "arlabel": "موناكو"
      },
  {
      "value": "AE",
      "label": "United Arab Emirates",
      "arlabel": "دولة الإمارات العربية المتحدة"
      },
  {
      "value": "SS",
      "label": "South Sudan",
      "arlabel": "جنوب السودان"
      },
  {
      "value": "PR",
      "label": "Puerto Rico",
      "arlabel": "بويرتوريكو"
      },
  {
      "value": "SV",
      "label": "El Salvador",
      "arlabel": "السلفادور"
      },
  {
      "value": "FR",
      "label": "France",
      "arlabel": "فرنسا"
      },
  {
      "value": "NE",
      "label": "Niger",
      "arlabel": "النيجر"
      },
  {
      "value": "CI",
      "label": "Ivory Coast",
      "arlabel": "ساحل العاج"
      },
  {
      "value": "GS",
      "label": "South Georgia",
      "arlabel": "جورجيا الجنوبية"
      },
  {
      "value": "BW",
      "label": "Botswana",
      "arlabel": "بوتسوانا"
      },
  {
      "value": "IO",
      "label": "British Indian Ocean Territory",
      "arlabel": "إقليم المحيط الهندي البريطاني"
      },
  {
      "value": "UZ",
      "label": "Uzbekistan",
      "arlabel": "أوزباكستان"
      },
  {
      "value": "TN",
      "label": "Tunisia",
      "arlabel": "تونس"
      },
  {
      "value": "HK",
      "label": "Hong Kong",
      "arlabel": "هونغ كونغ"
      },
  {
      "value": "MK",
      "label": "North Macedonia",
      "arlabel": "شمال مقدونيا"
      },
  {
      "value": "SR",
      "label": "Suriname",
      "arlabel": "سورينام"
      },
  {
      "value": "BE",
      "label": "Belgium",
      "arlabel": "بلجيكا"
      },
  {
      "value": "AS",
      "label": "American Samoa",
      "arlabel": "ساموا الأمريكية"
      },
  {
      "value": "SB",
      "label": "Solomon Islands",
      "arlabel": "جزر سليمان"
      },
  {
      "value": "UA",
      "label": "Ukraine",
      "arlabel": "أوكرانيا"
      },
  {
      "value": "FI",
      "label": "Finland",
      "arlabel": "فنلندا"
      },
  {
      "value": "BF",
      "label": "Burkina Faso",
      "arlabel": "بوركينا فاسو"
      },
  {
      "value": "BA",
      "label": "Bosnia and Herzegovina",
      "arlabel": "البوسنة والهرسك"
      },
  {
      "value": "IR",
      "label": "Iran",
      "arlabel": "إيران"
      },
  {
      "value": "CU",
      "label": "Cuba",
      "arlabel": "كوبا"
      },
  {
      "value": "ER",
      "label": "Eritrea",
      "arlabel": "إريتريا"
      },
  {
      "value": "SK",
      "label": "Slovakia",
      "arlabel": "سلوفاكيا"
      },
  {
      "value": "LT",
      "label": "Lithuania",
      "arlabel": "ليتوانيا"
      },
  {
      "value": "MF",
      "label": "Saint Martin",
      "arlabel": "سانت مارتن"
      },
  {
      "value": "PN",
      "label": "Pitcairn Islands",
      "arlabel": "جزر بيتكيرن"
      },
  {
      "value": "GW",
      "label": "Guinea-Bissau",
      "arlabel": "غينيا بيساو"
      },
  {
      "value": "MS",
      "label": "Montserrat",
      "arlabel": "مونتسرات"
      },
  {
      "value": "TR",
      "label": "Turkey",
      "arlabel": "تركيا"
      },
  {
      "value": "PH",
      "label": "Philippines",
      "arlabel": "الفلبين"
      },
  {
      "value": "VU",
      "label": "Vanuatu",
      "arlabel": "فانواتو"
      },
  {
      "value": "BO",
      "label": "Bolivia",
      "arlabel": "بوليفيا"
      },
  {
      "value": "KN",
      "label": "Saint Kitts and Nevis",
      "arlabel": "سانت كيتس ونيفيس"
      },
  {
      "value": "RO",
      "label": "Romania",
      "arlabel": "رومانيا"
      },
  {
      "value": "KH",
      "label": "Cambodia",
      "arlabel": "كمبوديا"
      },
  {
      "value": "ZW",
      "label": "Zimbabwe",
      "arlabel": "زيمبابوي"
      },
  {
      "value": "JE",
      "label": "Jersey",
      "arlabel": "جيرزي"
      },
  {
      "value": "KG",
      "label": "Kyrgyzstan",
      "arlabel": "قيرغيزستان"
      },
  {
      "value": "BQ",
      "label": "Caribbean Netherlands",
      "arlabel": "الجزر الكاريبية الهولندية"
      },
  {
      "value": "GY",
      "label": "Guyana",
      "arlabel": "غيانا"
      },
  {
      "value": "UM",
      "label": "United States Minor Outlying Islands",
      "arlabel": "جزر الولايات المتحدة الصغيرة النائية"
      },
  {
      "value": "AM",
      "label": "Armenia",
      "arlabel": "أرمينيا"
      },
  {
      "value": "LB",
      "label": "Lebanon",
      "arlabel": "لبنان"
      },
  {
      "value": "ME",
      "label": "Montenegro",
      "arlabel": "الجبل الاسود"
      },
  {
      "value": "GL",
      "label": "Greenland",
      "arlabel": "جرينلاند"
      },
  {
      "value": "PG",
      "label": "Papua New Guinea",
      "arlabel": "بابوا غينيا الجديدة"
      },
  {
      "value": "ZM",
      "label": "Zambia",
      "arlabel": "زامبيا"
      },
  {
      "value": "TT",
      "label": "Trinidad and Tobago",
      "arlabel": "ترينيداد وتوباغو"
      },
  {
      "value": "TF",
      "label": "French Southern and Antarctic Lands",
      "arlabel": "أراض فرنسية جنوبية وأنتارتيكية"
      },
  {
      "value": "PE",
      "label": "Peru",
      "arlabel": "بيرو"
      },
  {
      "value": "SE",
      "label": "Sweden",
      "arlabel": "السويد"
      },
  {
      "value": "SD",
      "label": "Sudan",
      "arlabel": "السودان"
      },
  {
      "value": "PM",
      "label": "Saint Pierre and Miquelon",
      "arlabel": "سان بيير وميكلون"
      },
  {
      "value": "OM",
      "label": "Oman",
      "arlabel": "عمان"
      },
  {
      "value": "IN",
      "label": "India",
      "arlabel": "الهند"
      },
  {
      "value": "TW",
      "label": "Taiwan",
      "arlabel": "تايوان"
      },
  {
      "value": "MN",
      "label": "Mongolia",
      "arlabel": "منغوليا"
      },
  {
      "value": "SN",
      "label": "Senegal",
      "arlabel": "السنغال"
      },
  {
      "value": "TZ",
      "label": "Tanzania",
      "arlabel": "تنزانيا"
      },
  {
      "value": "CA",
      "label": "Canada",
      "arlabel": "كندا"
      },
  {
      "value": "CR",
      "label": "Costa Rica",
      "arlabel": "كوستاريكا"
      },
  {
      "value": "CN",
      "label": "China",
      "arlabel": "الصين"
      },
  {
      "value": "CO",
      "label": "Colombia",
      "arlabel": "كولومبيا"
      },
  {
      "value": "MM",
      "label": "Myanmar",
      "arlabel": "ميانمار"
      },
  {
      "value": "RU",
      "label": "Russia",
      "arlabel": "روسيا"
      },
  {
      "value": "KP",
      "label": "North Korea",
      "arlabel": "كوريا الشمالية"
      },
  {
      "value": "KY",
      "label": "Cayman Islands",
      "arlabel": "جزر كايمان"
      },
  {
      "value": "BV",
      "label": "Bouvet Island",
      "arlabel": "جزر بوفيه"
      },
  {
      "value": "BY",
      "label": "Belarus",
      "arlabel": "بيلاروسيا"
      },
  {
      "value": "PT",
      "label": "Portugal",
      "arlabel": "البرتغال"
      },
  {
      "value": "SZ",
      "label": "Eswatini",
      "arlabel": "إسواتيني"
      },
  {
      "value": "PL",
      "label": "Poland",
      "arlabel": "بولندا"
      },
  {
      "value": "CH",
      "label": "Switzerland",
      "arlabel": "سويسرا"
      },
  {
      "value": "CG",
      "label": "Republic of the Congo",
      "arlabel": "جمهورية الكونفو"
      },
  {
      "value": "VE",
      "label": "Venezuela",
      "arlabel": "فنزويلا"
      },
  {
      "value": "PA",
      "label": "Panama",
      "arlabel": "بنما"
      },
  {
      "value": "NL",
      "label": "Netherlands",
      "arlabel": "هولندا"
      },
  {
      "value": "WS",
      "label": "Samoa",
      "arlabel": "ساموا"
      },
  {
      "value": "DK",
      "label": "Denmark",
      "arlabel": "الدنمارك"
      },
  {
      "value": "LU",
      "label": "Luxembourg",
      "arlabel": "لوكسمبورغ"
      },
  {
      "value": "FO",
      "label": "Faroe Islands",
      "arlabel": "جزر فارو"
      },
  {
      "value": "SI",
      "label": "Slovenia",
      "arlabel": "سلوفينيا"
      },
  {
      "value": "TG",
      "label": "Togo",
      "arlabel": "توغو"
      },
  {
      "value": "TH",
      "label": "Thailand",
      "arlabel": "تايلند"
      },
  {
      "value": "WF",
      "label": "Wallis and Futuna",
      "arlabel": "واليس وفوتونا"
      },
  {
      "value": "BS",
      "label": "Bahamas",
      "arlabel": "باهاماس"
      },
  {
      "value": "TO",
      "label": "Tonga",
      "arlabel": "تونغا"
      },
  {
      "value": "GR",
      "label": "Greece",
      "arlabel": "اليونان"
      },
  {
      "value": "SM",
      "label": "San Marino",
      "arlabel": "سان مارينو"
      },
  {
      "value": "RE",
      "label": "Réunion",
      "arlabel": "لا ريونيون"
      },
  {
      "value": "VA",
      "label": "Vatican City",
      "arlabel": "مدينة الفاتيكان"
      },
  {
      "value": "BI",
      "label": "Burundi",
      "arlabel": "بوروندي"
      },
  {
      "value": "BH",
      "label": "Bahrain",
      "arlabel": "‏البحرين"
      },
  {
      "value": "MH",
      "label": "Marshall Islands",
      "arlabel": "جزر مارشال"
      },
  {
      "value": "TC",
      "label": "Turks and Caicos Islands",
      "arlabel": "جزر توركس وكايكوس"
      },
  {
      "value": "IM",
      "label": "Isle of Man",
      "arlabel": "جزيرة مان"
      },
  {
      "value": "HT",
      "label": "Haiti",
      "arlabel": "هايتي"
      },
  {
      "value": "AF",
      "label": "Afghanistan",
      "arlabel": "أفغانستان"
      },
  {
      "value": "IL",
      "label": "Israel",
      "arlabel": "إسرائيل"
      },
  {
      "value": "LY",
      "label": "Libya",
      "arlabel": "‏ليبيا"
      },
  {
      "value": "UY",
      "label": "Uruguay",
      "arlabel": "الأوروغواي"
      },
  {
      "value": "NF",
      "label": "Norfolk Island",
      "arlabel": "جزيرة نورفولك"
      },
  {
      "value": "NI",
      "label": "Nicaragua",
      "arlabel": "نيكاراغوا"
      },
  {
      "value": "CK",
      "label": "Cook Islands",
      "arlabel": "جزر كوك"
      },
  {
      "value": "LA",
      "label": "Laos",
      "arlabel": "لاوس"
      },
  {
      "value": "CX",
      "label": "Christmas Island",
      "arlabel": "جزيرة كريسماس"
      },
  {
      "value": "SH",
      "label": "Saint Helena, Ascension and Tristan da Cunha",
      "arlabel": "سانت هيلينا وأسينشين وتريستان دا كونا"
      },
  {
      "value": "AI",
      "label": "Anguilla",
      "arlabel": "أنغويلا"
      },
  {
      "value": "FM",
      "label": "Micronesia",
      "arlabel": "ميكرونيسيا"
      },
  {
      "value": "DE",
      "label": "Germany",
      "arlabel": "ألمانيا"
      },
  {
      "value": "GU",
      "label": "Guam",
      "arlabel": "غوام"
      },
  {
      "value": "KI",
      "label": "Kiribati",
      "arlabel": "كيريباتي"
      },
  {
      "value": "SX",
      "label": "Sint Maarten",
      "arlabel": "سينت مارتن"
      },
  {
      "value": "ES",
      "label": "Spain",
      "arlabel": "إسبانيا"
      },
  {
      "value": "JM",
      "label": "Jamaica",
      "arlabel": "جامايكا"
      },
  {
      "value": "PS",
      "label": "Palestine",
      "arlabel": "فلسطين"
      },
  {
      "value": "GF",
      "label": "French Guiana",
      "arlabel": "غويانا"
      },
  {
      "value": "AD",
      "label": "Andorra",
      "arlabel": "أندورا"
      },
  {
      "value": "CL",
      "label": "Chile",
      "arlabel": "تشيلي"
      },
  {
      "value": "LS",
      "label": "Lesotho",
      "arlabel": "ليسوتو"
      },
  {
      "value": "AU",
      "label": "Australia",
      "arlabel": "أستراليا"
      },
  {
      "value": "GD",
      "label": "Grenada",
      "arlabel": "غرينادا"
      },
  {
      "value": "GH",
      "label": "Ghana",
      "arlabel": "غانا"
      },
  {
      "value": "SC",
      "label": "Seychelles",
      "arlabel": "سيشل"
      },
  {
      "value": "AO",
      "label": "Angola",
      "arlabel": "جمهورية أنغولا"
      },
  {
      "value": "BM",
      "label": "Bermuda",
      "arlabel": "برمودا"
      },
  {
      "value": "PK",
      "label": "Pakistan",
      "arlabel": "باكستان"
      },
  {
      "value": "ML",
      "label": "Mali",
      "arlabel": "مالي"
      },
  {
      "value": "SA",
      "label": "Saudi Arabia",
      "arlabel": "السعودية"
      },
  {
      "value": "CW",
      "label": "Curaçao",
      "arlabel": "كوراساو"
      },
  {
      "value": "KR",
      "label": "South Korea",
      "arlabel": "كوريا الجنوبية"
      },
  {
      "value": "ET",
      "label": "Ethiopia",
      "arlabel": "إثيوبيا"
      },
  {
      "value": "GP",
      "label": "Guadeloupe",
      "arlabel": "غوادلوب"
      },
  {
      "value": "BD",
      "label": "Bangladesh",
      "arlabel": "بنغلاديش"
      },
  {
      "value": "NZ",
      "label": "New Zealand",
      "arlabel": "نيوزيلندا"
      },
  {
      "value": "KM",
      "label": "Comoros",
      "arlabel": "جزر القمر"
      },
  {
      "value": "BZ",
      "label": "Belize",
      "arlabel": "بليز"
      },
  {
      "value": "UG",
      "label": "Uganda",
      "arlabel": "أوغندا"
      },
  {
      "value": "SG",
      "label": "Singapore",
      "arlabel": "سنغافورة"
      },
  {
      "value": "LI",
      "label": "Liechtenstein",
      "arlabel": "ليختنشتاين"
      },
  {
      "value": "HU",
      "label": "Hungary",
      "arlabel": "المجر"
      },
  {
      "value": "IS",
      "label": "Iceland",
      "arlabel": "آيسلندا"
      },
  {
      "value": "TJ",
      "label": "Tajikistan",
      "arlabel": "طاجيكستان"
      },
  {
      "value": "NA",
      "label": "Namibia",
      "arlabel": "ناميبيا"
      },
  {
      "value": "TL",
      "label": "Timor-Leste",
      "arlabel": "تيمور الشرقية"
      },
  {
      "value": "EG",
      "label": "Egypt",
      "arlabel": "مصر"
      },
  {
      "value": "RS",
      "label": "Serbia",
      "arlabel": "صيربيا"
      },
  {
      "value": "MU",
      "label": "Mauritius",
      "arlabel": "موريشيوس"
      },
  {
      "value": "MO",
      "label": "Macau",
      "arlabel": "ماكاو"
      },
  {
      "value": "PF",
      "label": "French Polynesia",
      "arlabel": "بولينزيا الفرنسية"
      },
  {
      "value": "MV",
      "label": "Maldives",
      "arlabel": "المالديف"
      },
  {
      "value": "ID",
      "label": "Indonesia",
      "arlabel": "إندونيسيا"
      },
  {
      "value": "CD",
      "label": "DR Congo",
      "arlabel": "الكونغو"
      },
  {
      "value": "EE",
      "label": "Estonia",
      "arlabel": "إستونيا"
      },
  {
      "value": "VN",
      "label": "Vietnam",
      "arlabel": "فيتنام"
      },
  {
      "value": "IT",
      "label": "Italy",
      "arlabel": "إيطاليا"
      },
  {
      "value": "GN",
      "label": "Guinea",
      "arlabel": "غينيا"
      },
  {
      "value": "TD",
      "label": "Chad",
      "arlabel": "تشاد"
      },
  {
      "value": "EC",
      "label": "Ecuador",
      "arlabel": "الإكوادور"
      },
  {
      "value": "GE",
      "label": "Georgia",
      "arlabel": "جورجيا"
      },
  {
      "value": "MW",
      "label": "Malawi",
      "arlabel": "مالاوي"
      },
  {
      "value": "IQ",
      "label": "Iraq",
      "arlabel": "العراق"
      },
  {
      "value": "SJ",
      "label": "Svalbard and Jan Mayen",
      "arlabel": "سفالبارد ويان ماين"
      },
  {
      "value": "BJ",
      "label": "Benin",
      "arlabel": "بنين"
      },
  {
      "value": "JP",
      "label": "Japan",
      "arlabel": "اليابان"
      },
  {
      "value": "DO",
      "label": "Dominican Republic",
      "arlabel": "جمهورية الدومينيكان"
      },
  {
      "value": "QA",
      "label": "Qatar",
      "arlabel": "قطر"
      },
  {
      "value": "GA",
      "label": "Gabon",
      "arlabel": "الغابون"
      }
]
export interface StateOption {
  readonly value: string;
  readonly label: string;
  readonly color: string;
}

export const stateOptions: readonly StateOption[] = [
  { value: 'AL', label: 'Alabama', color : '#FFFFFF'},
  { value: 'AK', label: 'Alaska', color : '#FFFFFF'},
  { value: 'AS', label: 'American Samoa', color : '#FFFFFF'},
  { value: 'AZ', label: 'Arizona', color : '#FFFFFF'},
  { value: 'AR', label: 'Arkansas', color : '#FFFFFF'},
  { value: 'CA', label: 'California', color : '#FFFFFF'},
  { value: 'CO', label: 'Colorado', color : '#FFFFFF'},
  { value: 'CT', label: 'Connecticut', color : '#FFFFFF'},
  { value: 'DE', label: 'Delaware', color : '#FFFFFF'},
  { value: 'DC', label: 'District Of Columbia', color : '#FFFFFF'},
  { value: 'FM', label: 'Federated States Of Micronesia', color : '#FFFFFF'},
  { value: 'FL', label: 'Florida', color : '#FFFFFF'},
  { value: 'GA', label: 'Georgia', color : '#FFFFFF'},
  { value: 'GU', label: 'Guam', color : '#FFFFFF'},
  { value: 'HI', label: 'Hawaii', color : '#FFFFFF'},
  { value: 'ID', label: 'Idaho', color : '#FFFFFF'},
  { value: 'IL', label: 'Illinois', color : '#FFFFFF'},
  { value: 'IN', label: 'Indiana', color : '#FFFFFF'},
  { value: 'IA', label: 'Iowa', color : '#FFFFFF'},
  { value: 'KS', label: 'Kansas', color : '#FFFFFF'},
  { value: 'KY', label: 'Kentucky', color : '#FFFFFF'},
  { value: 'LA', label: 'Louisiana', color : '#FFFFFF'},
  { value: 'ME', label: 'Maine', color : '#FFFFFF'},
  { value: 'MH', label: 'Marshall Islands', color : '#FFFFFF'},
  { value: 'MD', label: 'Maryland', color : '#FFFFFF'},
  { value: 'MA', label: 'Massachusetts', color : '#FFFFFF'},
  { value: 'MI', label: 'Michigan', color : '#FFFFFF'},
  { value: 'MN', label: 'Minnesota', color : '#FFFFFF'},
  { value: 'MS', label: 'Mississippi', color : '#FFFFFF'},
  { value: 'MO', label: 'Missouri', color : '#FFFFFF'},
  { value: 'MT', label: 'Montana', color : '#FFFFFF'},
  { value: 'NE', label: 'Nebraska', color : '#FFFFFF'},
  { value: 'NV', label: 'Nevada', color : '#FFFFFF'},
  { value: 'NH', label: 'New Hampshire', color : '#FFFFFF'},
  { value: 'NJ', label: 'New Jersey', color : '#FFFFFF'},
  { value: 'NM', label: 'New Mexico', color : '#FFFFFF'},
  { value: 'NY', label: 'New York', color : '#FFFFFF'},
  { value: 'NC', label: 'North Carolina', color : '#FFFFFF'},
  { value: 'ND', label: 'North Dakota', color : '#FFFFFF'},
  { value: 'MP', label: 'Northern Mariana Islands', color : '#FFFFFF'},
  { value: 'OH', label: 'Ohio', color : '#FFFFFF'},
  { value: 'OK', label: 'Oklahoma', color : '#FFFFFF'},
  { value: 'OR', label: 'Oregon', color : '#FFFFFF'},
  { value: 'PW', label: 'Palau', color : '#FFFFFF'},
  { value: 'PA', label: 'Pennsylvania', color : '#FFFFFF'},
  { value: 'PR', label: 'Puerto Rico', color : '#FFFFFF'},
  { value: 'RI', label: 'Rhode Island', color : '#FFFFFF'},
  { value: 'SC', label: 'South Carolina', color : '#FFFFFF'},
  { value: 'SD', label: 'South Dakota', color : '#FFFFFF'},
  { value: 'TN', label: 'Tennessee', color : '#FFFFFF'},
  { value: 'TX', label: 'Texas', color : '#FFFFFF'},
  { value: 'UT', label: 'Utah', color : '#FFFFFF'},
  { value: 'VT', label: 'Vermont', color : '#FFFFFF'},
  { value: 'VI', label: 'Virgin Islands', color : '#FFFFFF'},
  { value: 'VA', label: 'Virginia', color : '#FFFFFF'},
  { value: 'WA', label: 'Washington', color : '#FFFFFF'},
  { value: 'WV', label: 'West Virginia', color : '#FFFFFF'},
  { value: 'WI', label: 'Wisconsin', color : '#FFFFFF'},
  { value: 'WY', label: 'Wyoming', color : '#FFFFFF'},
];

export const optionLength = [
  { value: 1, label: 'general'},
  {
    value: 2,
    label:
      'Evil is the moment when I lack the strength to be true to the Good that compels me.',
  },
  {
    value: 3,
    label:
      "It is now an easy matter to spell out the ethic of a truth: 'Do all that you can to persevere in that which exceeds your perseverance. Persevere in the interruption. Seize in your being that which has seized and broken you.",
  },
];

export const dogOptions = [
  { id: 1, label: 'Chihuahua' },
  { id: 2, label: 'Bulldog' },
  { id: 3, label: 'Dachshund' },
  { id: 4, label: 'Akita' },
];

// let bigOptions = [];
// for (let i = 0; i < 10000; i++) {
// 	bigOptions = bigOptions.concat(colourOptions);
// }

export interface GroupedOption {
  readonly label: string;
  readonly options: readonly ColourOption[] | readonly FlavourOption[];
}

export const groupedOptions: readonly GroupedOption[] = [
  {
    label: 'Colours',
    options: colourOptions,
  },
  {
    label: 'Flavours',
    options: flavourOptions,
  },
];

export const genderOptions: readonly ColourOption[]  = [
    { value: 'Male', label: 'Male', lang:"en"},
  { value: 'Female', label: 'Female', lang:"en"},
  { value: 'Male', label: 'ذكر' , lang:"ar"},
  { value: 'Female', label: 'أنثى', lang:"ar"},
]