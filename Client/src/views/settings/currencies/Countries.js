const countries = [
    {
      "CountryName": "Afghanistan",
      "Currency": "Afghani",
      "Code": "AFN",
      "Symbol": "؋"
    },
    {
      "CountryName": "Albania",
      "Currency": "Lek",
      "Code": "ALL",
      "Symbol": "L"
    },
    {
      "CountryName": "Algeria",
      "Currency": "Algerian Dinar",
      "Code": "DZD",
      "Symbol": "د.ج"
    },
    {
      "CountryName": "Angola",
      "Currency": "Kwanza",
      "Code": "AOA",
      "Symbol": "Kz"
    },
    {
      "CountryName": "Argentina",
      "Currency": "Argentine Peso",
      "Code": "ARS",
      "Symbol": "$"
    },
    {
      "CountryName": "Armenia",
      "Currency": "Armenian Dram",
      "Code": "AMD",
      "Symbol": "֏"
    },
    {
      "CountryName": "Australia",
      "Currency": "Australian Dollar",
      "Code": "AUD",
      "Symbol": "A$"
    },
    {
      "CountryName": "Azerbaijan",
      "Currency": "Azerbaijani Manat",
      "Code": "AZN",
      "Symbol": "₼"
    },
    {
      "CountryName": "Bahrain",
      "Currency": "Bahraini Dinar",
      "Code": "BHD",
      "Symbol": ".د.ب"
    },
    {
      "CountryName": "Bangladesh",
      "Currency": "Taka",
      "Code": "BDT",
      "Symbol": "৳"
    },
    {
      "CountryName": "Belarus",
      "Currency": "Belarusian Ruble",
      "Code": "BYN",
      "Symbol": "Br"
    },
    {
      "CountryName": "Belize",
      "Currency": "Belize Dollar",
      "Code": "BZD",
      "Symbol": "BZ$"
    },
    {
      "CountryName": "Bhutan",
      "Currency": "Ngultrum",
      "Code": "BTN",
      "Symbol": "Nu."
    },
    {
      "CountryName": "Bolivia",
      "Currency": "Boliviano",
      "Code": "BOB",
      "Symbol": "Bs."
    },
    {
      "CountryName": "Brazil",
      "Currency": "Brazilian Real",
      "Code": "BRL",
      "Symbol": "R$"
    },
    {
      "CountryName": "Brunei",
      "Currency": "Brunei Dollar",
      "Code": "BND",
      "Symbol": "B$"
    },
    {
      "CountryName": "Bulgaria",
      "Currency": "Bulgarian Lev",
      "Code": "BGN",
      "Symbol": "лв"
    },
    {
      "CountryName": "Cambodia",
      "Currency": "Riel",
      "Code": "KHR",
      "Symbol": "៛"
    },
    {
      "CountryName": "Chile",
      "Currency": "Chilean Peso",
      "Code": "CLP",
      "Symbol": "$"
    },
    {
      "CountryName": "China",
      "Currency": "Yuan Renminbi",
      "Code": "CNY",
      "Symbol": "¥"
    },
    {
      "CountryName": "Colombia",
      "Currency": "Colombian Peso",
      "Code": "COP",
      "Symbol": "$"
    },
    {
      "CountryName": "Costa Rica",
      "Currency": "Costa Rican Colon",
      "Code": "CRC",
      "Symbol": "₡"
    },
    {
      "CountryName": "Croatia",
      "Currency": "Croatian Kuna",
      "Code": "HRK",
      "Symbol": "kn"
    },
    {
      "CountryName": "Cuba",
      "Currency": "Cuban Peso",
      "Code": "CUP",
      "Symbol": "₱"
    },
    {
      "CountryName": "Czech Republic",
      "Currency": "Czech Koruna",
      "Code": "CZK",
      "Symbol": "Kč"
    },
    {
      "CountryName": "Djibouti",
      "Currency": "Franc",
      "Code": "DJF",
      "Symbol": "Fdj"
    },
    {
      "CountryName": "Dominican Republic",
      "Currency": "Dominican Peso",
      "Code": "DOP",
      "Symbol": "RD$"
    },
    {
      "CountryName": "Egypt",
      "Currency": "Egyptian Pound",
      "Code": "EGP",
      "Symbol": "£"
    },
    {
      "CountryName": "Ethiopia",
      "Currency": "Birr",
      "Code": "ETB",
      "Symbol": "Br"
    },
    {
      "CountryName": "Fiji",
      "Currency": "Fiji Dollar",
      "Code": "FJD",
      "Symbol": "FJ$"
    },
    {
      "CountryName": "Gambia",
      "Currency": "Dalasi",
      "Code": "GMD",
      "Symbol": "D"
    },
    {
      "CountryName": "Georgia",
      "Currency": "Lari",
      "Code": "GEL",
      "Symbol": "₾"
    },
    {
      "CountryName": "Ghana",
      "Currency": "Ghana Cedi",
      "Code": "GHS",
      "Symbol": "₵"
    },
    {
      "CountryName": "Guatemala",
      "Currency": "Quetzal",
      "Code": "GTQ",
      "Symbol": "Q"
    },
    {
      "CountryName": "Honduras",
      "Currency": "Lempira",
      "Code": "HNL",
      "Symbol": "L"
    },
    {
      "CountryName": "Hungary",
      "Currency": "Forint",
      "Code": "HUF",
      "Symbol": "Ft"
    },
    {
      "CountryName": "Iceland",
      "Currency": "Iceland Krona",
      "Code": "ISK",
      "Symbol": "kr"
    },
    {
      "CountryName": "India",
      "Currency": "Indian Rupee",
      "Code": "INR",
      "Symbol": "₹"
    },
    {
      "CountryName": "Indonesia",
      "Currency": "Rupiah",
      "Code": "IDR",
      "Symbol": "Rp"
    },
    {
      "CountryName": "Iran",
      "Currency": "Iranian Rial",
      "Code": "IRR",
      "Symbol": "﷼"
    },
    {
      "CountryName": "Iraq",
      "Currency": "Iraqi Dinar",
      "Code": "IQD",
      "Symbol": "ع.د"
    },
    {
      "CountryName": "Israel",
      "Currency": "New Israeli Shekel",
      "Code": "ILS",
      "Symbol": "₪"
    },
    {
      "CountryName": "Jamaica",
      "Currency": "Jamaican Dollar",
      "Code": "JMD",
      "Symbol": "J$"
    },
    {
      "CountryName": "Japan",
      "Currency": "Yen",
      "Code": "JPY",
      "Symbol": "¥"
    },
    {
      "CountryName": "Jordan",
      "Currency": "Jordanian Dinar",
      "Code": "JOD",
      "Symbol": "JD"
    },
    {
      "CountryName": "Kazakhstan",
      "Currency": "Tenge",
      "Code": "KZT",
      "Symbol": "₸"
    },
    {
      "CountryName": "Kenya",
      "Currency": "Kenyan Shilling",
      "Code": "KES",
      "Symbol": "KSh"
    },
    {
      "CountryName": "Kuwait",
      "Currency": "Kuwaiti Dinar",
      "Code": "KWD",
      "Symbol": "د.ك"
    },
    {
      "CountryName": "Kyrgyzstan",
      "Currency": "Som",
      "Code": "KGS",
      "Symbol": "с"
    },
    {
      "CountryName": "Laos",
      "Currency": "Kip",
      "Code": "LAK",
      "Symbol": "₭"
    },
    {
      "CountryName": "Lebanon",
      "Currency": "Lebanese Pound",
      "Code": "LBP",
      "Symbol": "ل.ل"
    },
    {
      "CountryName": "Libya",
      "Currency": "Libyan Dinar",
      "Code": "LYD",
      "Symbol": "ل.د"
    },
    {
      "CountryName": "Madagascar",
      "Currency": "Malagasy Ariary",
      "Code": "MGA",
      "Symbol": "Ar"
    }
  ];
  
  export default countries;