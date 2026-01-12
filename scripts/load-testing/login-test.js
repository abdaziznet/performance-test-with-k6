// Creator: Insomnia REST Client insomnia.desktop.app:v12.2.0

import { sleep, check } from 'k6'
import http from 'k6/http'
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";


export const options = {
  scenarios: {
    concurrent_login: {
      executor: 'per-vu-iterations',
      vus: 1,
      iterations: 1,
      maxDuration: '30s',
    },
  },
}


export default function main() {
  let response

  // getqualityuser
  response = http.post(
    'http://192.168.5.68//k6/finger/getqualityuser',
    '{\n    "ActionName": "Login",\n    "ApplicationId": 1,\n    "ApplicationVersion": "2026.1.106.0",\n    "BranchCode": "00700",\n    "LogonID": "9790",\n    "LogonIPAddress": "192.168.18.1",\n    "LogonPCName": "ABD-LEGS7",\n    "NewGuid": "ED955FE8-77A7-4E44-BCCA-F25BEBDA499E"\n}',
    {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'insomnia/12.2.0',
        'X-RequesterHeader':
          '1/0x042D12E6126BA935FAFF9466A0D1C65EDC7DC0AB456CEBC136E015F4CE8B3C51/2026.1.106.0',
      },
    }
  )

  check(response, {
    'getqualityuser status 200': (r) => r.status === 200,
  })

  console.log(`getqualityuser → HTTP ${response.status}`)
  if (response.status !== 200) {
    console.log(`getqualityuser FAILED body: ${response.body}`)
  }

  // login
  response = http.post(
    'http://192.168.5.68//k6/finger/login',
    '{\n    "ClientInfo": {\n        "ActionName": "Login",\n        "ApplicationId": 1,\n        "ApplicationVersion": "2026.1.106.0",\n        "BranchCode": "00700",\n        "LogonID": "9790",\n        "LogonIPAddress": "192.168.18.1",\n        "LogonPCName": "ABD-LEGS7",\n        "NewGuid": "ED955FE8-77A7-4E44-BCCA-F25BEBDA499E"\n    },\n    "LoginTime": "2026-01-06 19:09:12",\n    "Password": "ODB8NjR8MTE1fDExNXwxMTl8NDh8MTE0fDEwMHw=",\n    "Template": "TlQAEOgLAAAKAU5GVBDeCwAACgFORlIl1AsZAAFoAfwB/AEAAP+JAQEfAAAAB/8ZBxlNgQxKC3KTosENUQd0proBHE8GcaPpIRpTB2+fCWIVVgZyjymiCVQGgIBdogRMCX8bYUIKXQl8edWCARIEhanVIhw/A2eC6YIGUQ6FpxKDFlYFa4Ul4wdUEYSfNcMOWwiALrljDVwHhYvSwwhJFHg2QgQYIgttsWWkFUQGb7NuRA5UAn6pcmQLTwl8U35kA0kdd36SRAc6JHYwnQQGM3B5RcYEBSsxgLTR5BI/BGUGLAEBBRcG/6//////BPEA/x//BPILDRgF/1////////8JAzIEAGf///8C/y8JCyYEAUb///8D/08LDToHAYL///8BBFcNBzIKBmP///8ABaMHCiQI//8NDCYKBlIFASYEC4T/////Bv8KD/8U//8D/y//////EPYLBEIIBvQHBF0NDDIU/78EAzYJ/08QEioNB2QICvIHDWQODyQU/58HBCoLEGQRDiQPDHQSExQPDEINC0kJEdUIDPQNDnQSEyEW/2//EfISDYQL/y////8LEEL/////GPMSDmUOCxoRGGP///8TDyIPDhQSGCX///8VCD//////DPkPFkIX/y8UCB8PE0MY/4//FvH/F/EU/y8MD7YV/x//////FPIWFRL///8LEXP///////8TElMBBDmpBAYABwAEAAD/GxpZAQ1HCnORlkENTwh2paahG08HdaPZwRlUBnMQ6YEGPQaCn/3hFFcGdIwhIglUBYJ9WSIETwmAHW3CCl0JfavFohtABGp84eIFUw2HAfkCAz0HiKcCAxZWBm6EIWMHVhCGniVDDlsHgzHFww1dB4mJzkMITBd5sVFEFUcHciVWJBgXDG6xWgQOVgOEqWYEC1AKfXWGBAdELHZPjuQCRhh7M6lkBjZKe7a5hBJDAmo/vqQFHkd+Q9rkBC0dgkQBDAEhBP///////wXx/wDx/wXyDAgmBgRf////////CQMyBQBn////Av8vCQwWBQE2Bgr/B///////AAH/////AwkxDA45CAFyBP//AQVWCA0WCgdS////BAbyCAoTC///Dg0VCgdBBgEWBQx0A/8f/////xL2DAVB/wfzBghUDg0hFQu/DRD/////////Bwr/BQM2Cf9PEQ9JDghkCwrxCA5TDxAUFv+fCAUZDP9vEQ8TEA1zExQUEA1BDgw5/xH0Cw30Dg90ExQxFf9fDAlHEv8v/xjyEw9k////EQ8nDAk2////DwwbERhj/xr5FBAzEA8UExg1////FQtPFgsfEA9YFP9P/xfx/////wv/EBdSGf8//xnxFv8vEBVhE/9vDBFy////////FBNTGv8fFgs/FRcxGP+v/////xbzGRQX/////xcbSWEMSwqQkqahDVIIlabCIRxOBo6k7SEaVQaNnxGiFVkEkI8twglXCKKBYcIETAqjHGFCCl4Kn6jNIhxGA38D6sICNgengekiBlUQp6UWoxZYBIeDIYMHURSonTGjDl0IpDLBow1cCquG0qMITRqcNjrkFyoIibFtpBVIBYulcmQLUgqdsnIkDlcDoVCCZANEJJh4mkQHRy2Ws9HkEkcEgxQBAQUXBv+v/////wTxAP8f/wTyCw0YBf9f////////CAs3AwAn////Av8vCAsmBAFG////AwhCCw06BwGC/wD3AQRXDQdCCgZj////AAWjDQoUCf9PDQwmCgZSBQEmBAuEA/8v/////xD2CwRCDA8V////////BgpB/wb0BwRdDQwyFAmxBAM2CP9PEBMqDQdkCQoSBwtqDQ9EFP+fBwQqC/9vEQ4kDwx0ExUYDwxCDQtJEBF1CQxUDQ50ExIhFf9P/xHyEw2EC/8v////CxBC/////xbzEw5lDw4UExYl////Ff8/DgsaERZj////Eg8i/////wz5DxVB////FAkaDxJDE/9f////DREj////////EhNT/xsaWaEMTQqRj5ZBDUwJlaWy4RtOB5Ck5cEZVQaQEemBBjwGop8JIhVZBZKMISIJVQekfl0CBE4JpR1tggpfCqCpxaIbRwSBfuGCBVUOqP7uQgM5CKimCiMWWQSKgyHjBlYSqZwhIw5aCKWDyiMISB2eNNEDDl4Kri5OBBgvCYmvWWQVSgaPoV7kClEMnq9eJA5YBaZrigQHMj2VTpLkAkkfmjWthAY4RZizwaQSSgKGQ8YEBSkwmz3GpAUgNJpEAQEGFgT///////8F8f8A8f8D9gUOKAYEX////////wkMOAMAJ////wL/LwkMFgUBNgYK/wf//////wAB/////wMJMQwOOQgBcgT//wEFVggNFgoHUv///wQG8ggKEwv/Tw4NFQoHQQYBFgUMdAP/H/////8R9gwFQf8H8wYIVA4NIRYLsQ0PFhb/v////wcKQQUDNgn/TxEQOQ4IZAsKEQgOUxAPFBb/nwgFGQkMphIQEw8Nc/8N9AgQlBQTMRX/XxQTFA8NQQ4MORESdP8Y9BIQJwz/P////wwJRxH/L/8Y8hQQZA8QFBQYNf///xX/TxAMGxIYY////xMPMxb/Hw8QWBP/T/8X//////8N+Q8XXxn/P/8a/xb//xUT/xj//wwScv///////xMUU////xYLPRUaMf///////xkLHhUXPxj/r90bGUlBDEcLXZeq4Q1PCF+oviEcTQZaDOUBBjoHaaTxQRpPB1qiFYIVUwdckC3CCVQGaYBZwgRNCWYZWQIKVApmguVCBlIMba36whssBVb+/cICPAhwpxqjFlAHWIYl4wdSDmufLaMOWQhrJlJDGw0GVC25gw1bBm2Q5UMIPBNetG5EDlAEaax2ZAtJCWhVemQDRRhftnrEFDUGV4WSRAc2IWovpSQGMGpuqd1EETY8bST1RA4RI2IbCaUPCEJmRAEBBhcD/2//////BPUA/x//BfIMDhgG/1////////8KBDIFAGcGCRcH/0////8AAWT/AvL///8KDCYFAUb///8E/08MDjoIAYIDABcBBVcOCEIJB2P///8DBkMICSQL/18ODSYJB1IGACgBDGT/B/QIBV0ODTIUC7EE/y////8PFRcMBTENERYU/6////8HCVEFBDYKDzL/FfQOCGQJByUIDmQQESUU/58IBSoMD2gVECQRDYT/FfYODIIECkH///8SExQRDVIODEkPFbQLDWUOEIUTFhQU/08QDBoVGFEZ/x8TESMNEEQSGSL///8WETH/////DfkRF0L///8MD0b/////GPMSEFQUDRkRE0MZ/1//F/H/////FPIRFmET/08QFRP/////Gv8ZEiH/////FvUSDBoYGi//////Gf8SDv8Y////GxlVwQxKC1+WnmENTghhp6rBG00HX6ThwRlQBl4P6YEGPAdtoAECFVQHYIwhQglUBmx+WSIETQlpGmmCClsKaH3dwgVRC2+p5sIbLgRZAflCAz4HcqgKQxZTB1qFIWMHUg5tnyVDDlkIbS/Jww1bB3GI0eMHPBVgtV4EDlEFbapiBAtLCmuzauQUOAlaeILEBkEqalGKBANIFmQzrWQGNERvs9HkEjBVcrHZxBARO2pA2UQFJB9uM/2kDhIxY0QBAQYWBP9f/////wXxAP8f/wXyDAgmBv9f////////CgNCBQBn/wLy////CgwmBQE2BgkWB/8/////AAFU////A/8/DA45CAFyBP8fAQVWDggxCQdS////BAYyCAkTC/9PDg0VCQdBBgEWBQx0/wfzBghUDg0hFAuxA/8v/////xP4DAVBDRAVFf+v////BwlBBQM2Cv9PEw9ZDghkCQcUCA5TDxAUFf+fCAUZDP9vEw8TEA1zERIUEA1BDgw5/xP0/w30Dg90Ev8fFP9PDwwbExhhGhYWEhAzDQ9EERoy/xn/FBBBDApY/////xf/EQ9kFQsaEBJEEf9vFv8f/////w35EBZCGf///xn/Ff8vFBIUEf9vDBP/////////GBH/DxMSF////xrxFBFh/////xX/FhL/Gv//////FhJSERgRF///",\n    "UserName": "maryam9790"\n}',
    {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'insomnia/12.2.0',
        'X-RequesterHeader':
          '1/0x042D12E6126BA935FAFF9466A0D1C65EDC7DC0AB456CEBC136E015F4CE8B3C51/2026.1.106.0',
      },
    }
  )

  check(response, {
    'login status 200': (r) => r.status === 200,
  })

  console.log(`login → HTTP ${response.status}`)
  if (response.status !== 200) {
    console.log(`login FAILED body: ${response.body}`)
  }

  // dashboard
  response = http.post(
    'http://192.168.5.68//k6/finger/dashboard',
    '{\n    "ActionName": "Get Dashboard Info",\n    "ApplicationId": 1,\n    "ApplicationVersion": "2026.1.106.0",\n    "BranchCode": "00700",\n    "LogonID": "9790",\n    "LogonIPAddress": "192.168.18.1",\n    "LogonPCName": "ABD-LEGS7",\n    "NewGuid": "FF15739D-AE39-4D43-B591-815AA176EF1A"\n}',
    {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'insomnia/12.2.0',
        'X-RequesterHeader':
          '1/0x042D12E6126BA935FAFF9466A0D1C65EDC7DC0AB456CEBC136E015F4CE8B3C51/2026.1.106.0',
      },
    }
  )

  check(response, {
    'dashboard status 200': (r) => r.status === 200,
  })

  console.log(`dashboard → HTTP ${response.status}`)
  if (response.status !== 200) {
    console.log(`dashboard FAILED body: ${response.body}`)
  }

  // logout
  response = http.post(
    'http://192.168.5.68//k6/finger/logout',
    '{"ClientInfo": {\n    "ActionName": "Logout",\n    "ApplicationId": 1,\n    "ApplicationVersion": "2026.1.106.0",\n    "BranchCode": "00700",\n    "LogonID": "9790",\n    "LogonIPAddress": "192.168.18.1",\n    "LogonPCName": "ABD-LEGS7",\n    "NewGuid": "FF15739D-AE39-4D43-B591-815AA176EF1A"\n}, "LogOutTime": "2026-01-07 13:51:05","Nip": "9790"}',
    {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'insomnia/12.2.0',
        'X-RequesterHeader':
          '1/0x042D12E6126BA935FAFF9466A0D1C65EDC7DC0AB456CEBC136E015F4CE8B3C51/2026.1.106.0',
      },
    }
  )

  check(response, {
    'logout status 200': (r) => r.status === 200,
  })

  console.log(`logout → HTTP ${response.status}`)
  if (response.status !== 200) {
    console.log(`logout FAILED body: ${response.body}`)
  }

  // Automatically added sleep
  sleep(1)
}

export function handleSummary(data) {
  return {
    "/reports/login-test-report.html": htmlReport(data),
  };
}
