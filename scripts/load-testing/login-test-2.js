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
    '{\n    "ClientInfo": {\n        "ActionName": "Login",\n        "ApplicationId": 1,\n        "ApplicationVersion": "2026.1.106.0",\n        "BranchCode": "00700",\n        "LogonID": "9790",\n        "LogonIPAddress": "192.168.18.1",\n        "LogonPCName": "ABD-LEGS7",\n        "NewGuid": "ED955FE8-77A7-4E44-BCCA-F25BEBDA499E"\n    },\n    "LoginTime": "2026-01-06 19:09:12",\n    "Password": "ODB8NjR8MTE1fDExNXwxMTl8NDh8MTE0fDEwMHw=",\n    "Template": "TlQAEOgLAAAKAU5GVBDeCwAACgFORlIl1AsZAAFoAfwB/AEAAP+KAQEfAAAAB/8ZB5pxwBRJBnGXvcASUAdwkhGhDlcIcYkl4QZFCXGcbUEWOwZogMkBBU4JepfuIRJVCG2LieILVwmAdr2iBEkQe6LmghlEBmdy7SIGUxF8Gg3jDFoJgSQNQxdRBXSgLQMWUAV5eooDClEReZ2y4xBcBHujvaMVUwVxleqjDlcLdmxSBAw1H3hAaoQISSd3H20kCxtefRptRAstVH2fFoUVUAqCny1FGEcMeK82BQpLCYMGLAH///////8EBkgB/z////8A/z8EBiYC/0////8BBEIGBzoFA3P/////AvMGBxgF/18B/y////8JDEcGAkL///8DAlcHCkgI/38CATYE/08MCzkHA2EFAkoGCWUNCyT/CvT///8FBmkHCjL///8E/0//////EPYMBiH/CPIFB4QLDiQT/58PEhgOCkIHBkn/DfUXEIQNByQG/z8J/y8GBEgM/y8XEHMPC2X/CvQHC3QREhQT/08LBhoNEGMWGDsRDiIGDXP///8WGG4RD1MOCxQPECUWGBkS/z8TCBsOEUMQFoEYFVH/////CvkOEkEUGPH/GP//E/8OEf8SFf//GPX/FP8OC2oSFhIREBb/F/H///8YEnEQCVr/////////FvEUEfkW/3////////8BBCRxJAsABwAEAAD/G5lhIBRIB3WVrWASUgd1kQUhDlcIc4YZYQZBCHScXaEVNgdqfslhBEoIe5bigRFVB28JAYIEOAt4ioFiC1kIgXbBAgRFDn2h1gIZRQZqcfGCBVQRfhwVQw1cCYQkHaMXUQZznyGjFVAFenWKYwlPEnqcomMQXAV/o61DFVMEdZHaIw5WC3ldRmQLMjB3HXHECz4yfTp6RAhLIHsjfWQLI0N/LpoECzAlhaEKBRVSCYSgIcUXRwx6sSalCU4Kh0QB////////BAY4Af8v////AP8vBAYWAgM2////AQQxBgg5BQNi/////wLyBggXBf9PAf8f////Cg5HBgJB////AwJGCAc/Cf9vAgE2BP9PCgwZCANhCAn//////wX/Awb/BwL5BgplDgwTDwtz////BwjyDAsR////BP9P/////w3yDgYx/wnxBwjzDA8UFf+fEBMYDwtBCAY5Cg6EGRFzDggTBgoy////BgRHDf8fGRFiEAxk/wv0CAx0EhMVFf9fDAYbDhFjGBRGEg8zBg5y////GBptEhBTDwwUEBE1GP8vE/9PFf8fDxJUEBhiFBYf/xfyFhXzExIUERiC/////wv5DxNRFxox/xf/Ff//ExT/ERj/Gv8//xXzExZPGRhlEhEm/xnx////GhSCEQ1H/////////xjxFxI6GP+P/////////xaceSAVSgSMlsEAE1QHjZEV4Q5ZBpCKJQEHRwePmmkhFkIGf37J4QROCZWW9mESWQeHi4niC1QKonS9YgRMEZah6oIZRgKBcO0CBlQSmSUJAxdOA5EdESMNXAylny6jFkcElXOOwwlPF5ucugMRXgWdor2jFU8DkZHuww5VDZY5boQIRy+aoBplFVILobMqxQlMC6igLUUYSguZCAH///////8EBkgB/z////8A/z8EBiYCA0f///8BBEIGBzoFA3P/////AvMGBxgF/18BACT///8JC0cGAkL///8DAlcHCkgI/28CATYE/08LDDkHA2EFA0gGCWULDET/CvT///8FBmkHCjIS/78G/x//////EPYLByX/CPIFB4QMDiQS/58TDZEMB3QG/z8J/y8PEhgOCkIHBkkJDYUGCzEJ/z8VEHMPDGX/CvQHDHQPESES/08MBhoNEGMTFDsRDiIGDXP///8TFG4PDDIODBQPECUT/x8S/z//////CvkOEUMTFHEREBb/FfH///8UEncSERkT/3////////8QCVr/////////E/H/HJdtoBRGBY6WsYASUgeRkhGBDlkHkoYZYQZDCJKbXaEVPAaAeslBBEcIlZXq4RFVB4kJBYIEOQuRioFiC1UIo3PFwgNMEJeg1gIZRwKEcPliBVQTmiYVgxdTBI8fHYMNXAymnx4jFkkEl22KIwlDGZqbroMQXAafobFDFVADk4zeIw5VDphRSkQLHUeUOGpkChN3mB9x5As9L5g3gkQIQySfJoJECyZAmyqeBAszJp+hCgUVUQmjtx5lCUsMqqAd5RdLDJpQAf////////8E8wH/L////wD/LwQGFgL/P////wEEMQYIOQUDYv////8C8gYIFwX/TwEAE////woORwYCQf///wMCRgYHPwn/bwIBNgT/TwoNGQgHbwgJ//////8F/wMG/wcD9wYKZQ4NIwsJMv///wcG+QgLIRb/vwb/H/////8M8g4INf8J8QcI8w0PFBb/nxsRcw4IEwYKMv///xATGA8LQQgGOQoOhQYERwz/HxsRcxANdf8L9AgNdBASMRP/Xw0GGw4RcxkYSRIPMwYOc////xsZRhIQUw8NFBARNRn/LxP/TxT/HwsPlRL/TxUX8hoWIv8L+g8TYRUX8f8Y/xcU/xMS/xEZ/xr/H/8J+w8UUhf/P/8Y8RYUMRMSJhUZ9P8a8/8W8xcVH/8Z9RARRv8b8f///xoVjxgQPBn/j/////8J+xEKSv////////8Z8f8bnnXgFEAHXJa9ABNLB1yGCkEHOQhZkhXhDlEKWaGqIRcWA2KAyeEESglnmPZBEk0IWwQB4gMtB2WLiSIMVwlsdr2iBEgPax/aohsLBWtx6SIGUg9qpO6iGUAHXyQJIxdMB2IZDQMNVgdvojEDFkkHYn6KAwpADF+gssMQWQVlo8XDFU0FX5bqow5UC2F2VgQMJxtgPm5ECEkeXhhxZAs3V2YxkuQKMDdrnxqFFU0Ka50tRRhCDWCtMuUJTAluRAH///////8EAUMD/3////8A/z8EBiYDAkb/////A/IGCBgF/1////8B/08GCDoFAnIB/y////8MDzcGAzH///8CA1cIC0gH/y8DATYE/z8NDjkIBWMICSX///////8FAygHAyoGDGUPDiQQC3T///8HBlkICzL/////EvcMBhEE/z//////CfIHCGQOECQV/58E/z8K/x8ZEqYNBiEZD4IRCHQG/z8M/y8RFBgQC0IIBkkED8UGDUIM/z8YEpMRDmX/C/QOD0kTFBQV/08OBhoPEmMYFDUTECIPDTT///8YGm4TEVMQDhQREiUYGhkU/z8VEBQOE4MZGDEXFhH/////C/kQFEEXGiH/F/H/FfILELYUGBIa/y8VCS0QFmEY/z8TEhb/GfH///8aFHESDVj/////////GPEXEygY/3//////////G5tpgBRGB1+VsYASTgZgkglBDlIJXYoOwQY4CVyfmsEWIwVifclhBEgIapjqwRFQCFwGAWIENAlnioWiC1gJbXK9IgRJDGyi3kIZQwlgc/GiBVMPbCUVgxdOCGIbGWMNWQdxoB2jFU4HZHuKgwlODWCfpmMQWwVpo7WDFU4EYpPaQw5WDGRoSoQLMyRgHXXECzo0Zzt+RAhMGWMnikQLJkVqL54kCzMlbaAOJRVQCW2xIoUJTglzoCXFF0UMYkQB////////BAZIAf8v////AP8vBAYmAgM2////Af8/Bgg5BQNi/////wLyBggoBf9fAf8v////Cg5HBgJB////AwJWCAs3B/8fAgE2BP9PDg1JCANiCAkU/////wXxAwZ0BwIZBgplDg0TDwtz////BwZJCAshFf+/BP9P/////wzyDgZB/wnxBwhTDQ8UFf+fGhFzDggTBgoy////EBIUDwtBCAY5Cg6EBgRHDP8fGhFiEA1k/wv0CA10EhMVFf9fDQYbDhFjGBRGEg8zDgwj////GBluEhBTDw0UEBE1GBkqE/9PFf8fDxJUERiCFBkS/xbx/xXyExIUERiC/////wv5DxNRFhkx/xfxFf8/ExQhERik/xnzFQk9FhQSGP9fEhEm/xrx////GRSCFxI6GP+P////////EQpK/////////xjx",\n    "UserName": "maryam9790"\n}',
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
