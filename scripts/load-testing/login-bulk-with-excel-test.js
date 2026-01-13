// login-bulk-with-excel-test.js - K6 Load Testing Script reading from Excel
import { sleep } from 'k6'
import http from 'k6/http'
import { check } from 'k6'
import { SharedArray } from 'k6/data'
import * as XLSX from 'https://cdn.sheetjs.com/xlsx-latest/package/xlsx.mjs';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

// Load and parse Excel data once
const testData = new SharedArray('users', function () {
    // Read the Excel file as binary
    const binFile = open('../../data/user-data.xlsx', 'b');

    // Parse using SheetJS (XLSX)
    const workbook = XLSX.read(new Uint8Array(binFile), { type: 'array' });

    // Get the first sheet
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    // Convert to JSON
    const rawData = XLSX.utils.sheet_to_json(worksheet);

    // Map to the required format
    return rawData.map(row => ({
        BranchCode: row.origin_branch_code || "00700",
        LogonID: row.nip || "9790",
        LogonIPAddress: "192.168.1.100", // Default
        LogonPCName: "K6-LOAD-TEST",    // Default
        NewGuid: "550e8400-e29b-41d4-a716-446655440000", // Default UUID
        LoginTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
        Password: "ODB8NjR8MTE1fDExNXwxMTl8NDh8MTE0fDEwMHw=", // Default password
        Template: row.Template,
        UserName: row.user_name,
        UserLDAP: row.UserLDAP
    }));
});

// export const options = {
//     stages: [
//         { duration: '30s', target: 10 },  // Ramp-up to 10 VUs
//         { duration: '1m', target: 10 },   // Hold 10 VUs
//         { duration: '30s', target: 0 },   // Ramp-down
//     ],
//     thresholds: {
//         http_req_duration: ['p(95)<2000'], // database queries can be slow
//         http_req_failed: ['rate<0.1'],
//     },
// }

export const options = {
    scenarios: {
        concurrent_login: {
            executor: 'per-vu-iterations',
            vus: 4,
            iterations: 1,
            maxDuration: '30s',
        },
    },
}

// Konstanta
const BASE_URL = 'http://192.168.5.68'
const APPLICATION_VERSION = '2026.1.106.0'
const X_REQUESTER_HEADER = '1/0x042D12E6126BA935FAFF9466A0D1C65EDC7DC0AB456CEBC136E015F4CE8B3C51/2026.1.106.0'

export default function main() {
    // Ambil data dari SharedArray
    const userData = testData[(__VU - 1) % testData.length]

    console.log(`VU ${__VU} user logonID: ${userData.LogonID}`)

    const headers = {
        'Content-Type': 'application/json',
        'User-Agent': 'k6-performance-test',
        'X-RequesterHeader': X_REQUESTER_HEADER,
    }

    const clientInfo = {
        ActionName: 'Login',
        ApplicationId: 1,
        ApplicationVersion: APPLICATION_VERSION,
        BranchCode: userData.BranchCode,
        LogonID: userData.LogonID,
        LogonIPAddress: userData.LogonIPAddress,
        LogonPCName: userData.LogonPCName,
        NewGuid: userData.NewGuid
    }

    // ========== 1. GET QUALITY USER ==========
    let response = http.post(
        `${BASE_URL}/k6/finger/getqualityuser`,
        JSON.stringify(clientInfo),
        { headers }
    )

    check(response, {
        'getqualityuser: status 200': (r) => r.status === 200,
    })

    console.log(`getqualityuser [${userData.LogonID}] → HTTP ${response.status}`)
    if (response.status !== 200) {
        console.log(`getqualityuser [${userData.LogonID}] FAILED body: ${response.body}`)
    }

    sleep(0.5)

    // ========== 2. LOGIN ==========
    const loginPayload = {
        ClientInfo: clientInfo,
        LoginTime: userData.LoginTime,
        Password: userData.Password,
        Template: userData.Template,
        UserName: userData.UserLDAP,
    }

    // console.log(`login request body: ${JSON.stringify(loginPayload)}`)

    response = http.post(
        `${BASE_URL}/k6/finger/login`,
        JSON.stringify(loginPayload),
        { headers }
    )

    check(response, {
        'login: status 200': r => r.status === 200
    })

    console.log(`login [${userData.LogonID}] → HTTP ${response.status}`)
    if (response.status !== 200) {
        console.log(`login [${userData.LogonID}] FAILED body: ${response.body}`)

        return response;
    }

    // ========== 3. DASHBOARD ==========
    const dashboardPayload = {
        ...clientInfo,
        ActionName: 'Get Dashboard Info'
    }

    response = http.post(
        `${BASE_URL}/k6/finger/dashboard`,
        JSON.stringify(dashboardPayload),
        { headers }
    )

    check(response, {
        'dashboard: status 200': (r) => r.status === 200,
    })

    console.log(`dashboard [${userData.LogonID}] → HTTP ${response.status}`)
    if (response.status !== 200) {
        console.log(`dashboard [${userData.LogonID}] FAILED body: ${response.body}`)

        return response;
    }

    sleep(2)

    // ========== 4. LOGOUT ==========
    const logoutPayload = {
        ClientInfo: {
            ...clientInfo,
            ActionName: 'Logout'
        },
        LogOutTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
        Nip: userData.LogonID
    }
    response = http.post(
        `${BASE_URL}/k6/finger/logout`,
        JSON.stringify(logoutPayload),
        { headers }
    )

    check(response, {
        'logout: status 200': (r) => r.status === 200,
    })

    console.log(`logout [${userData.LogonID}] → HTTP ${response.status}`)
    if (response.status !== 200) {
        console.log(`logout [${userData.LogonID}] FAILED body: ${response.body}`)
    }

    sleep(1)
}

export function setup() {
    console.log('🚀 Starting load test with', testData.length, 'users from Excel')
}

export function teardown() {
    console.log('✅ Load test completed')
}

export function handleSummary(data) {
    return {
        "/reports/login-test-report.html": htmlReport(data),
    };
}