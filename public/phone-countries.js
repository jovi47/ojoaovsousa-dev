// Scope: national official/de facto English, Portuguese or Spanish in CLDR 48.
// The pinned source and selection policy are recorded in docs/phone-country-sources.json.
export const PHONE_COUNTRIES=Object.freeze(["AG","AI","AO","AR","AS","AU","BB","BI","BM","BO","BR","BS","BW","BZ","CA","CC","CK","CL","CM","CO","CR","CU","CV","CX","DM","DO","EC","ER","ES","FJ","FK","FM","GB","GD","GG","GH","GI","GM","GQ","GT","GU","GW","GY","HK","HN","IE","IM","IN","IO","JE","JM","KE","KI","KN","KY","LC","LR","LS","MG","MH","MO","MP","MS","MT","MU","MW","MX","MZ","NA","NF","NG","NI","NR","NU","NZ","PA","PE","PG","PH","PK","PR","PT","PW","PY","RW","SB","SC","SD","SG","SH","SL","SS","ST","SV","SX","SZ","TC","TK","TL","TO","TT","TV","TZ","UG","US","UY","VC","VE","VG","VI","VU","WS","ZA","ZM","ZW"]);
const phoneCountries=new Set(PHONE_COUNTRIES);
export const isPhoneCountry=code=>phoneCountries.has(code);
export const phoneCountryFlag=code=>isPhoneCountry(code)?String.fromCodePoint(...Array.from(code,c=>127397+c.charCodeAt(0))):'';
