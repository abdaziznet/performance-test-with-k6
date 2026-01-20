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
        UserLDAP: row.UserLDAP,
        ReffNumber: row.ReffNumber,
        SupervisorId: row.SupervisorId,
        ServiceCode: row.ServiceCode,
        Amount: row.Amount
    }));
});


export const options = {
    scenarios: {
        spike_test: {
            executor: 'constant-vus',
            vus: 1000,
            duration: '1m', // Gempur selama 1 menit
        },
    },
    thresholds: {
        http_req_duration: ['p(95)<=1000'], // response time <= 1 detik
        http_req_failed: ['rate<0.01'],     // error rate < 1%
    },
};


// Konstanta
const BASE_URL = 'http://192.168.5.68'
const APPLICATION_VERSION = '1.0.0.0'
const X_REQUESTER_HEADER = `2/0xFD9FD8D2037BD0B2B15040AC32A9317CC70CD2A43B735A024C34382F689DD2FF/${APPLICATION_VERSION}`
const APP_NAME = 'Core Banking Syariah'

export default function main() {
    // Ambil data dari SharedArray
    const userData = testData[(__VU - 1) % testData.length]

    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    console.log(`[${now}] VU ${__VU} user id: ${userData.UserName}`)

    const headers = {
        'Content-Type': 'application/json',
        'User-Agent': 'k6-performance-test',
        'X-RequesterHeader': X_REQUESTER_HEADER,
    }

    const clientInfo = {
        ActionName: 'Verification',
        ApplicationId: 2,
        ApplicationVersion: APPLICATION_VERSION,
        BranchCode: userData.BranchCode,
        LogonID: userData.LogonID,
        LogonIPAddress: userData.LogonIPAddress,
        LogonPCName: userData.LogonPCName,
        NewGuid: userData.NewGuid
    }

    const coreClientInfo = {
        Amount: userData.Amount,
        BranchCode: userData.BranchCode,
        ReffNumber: userData.ReffNumber,
        ServiceCode: userData.ServiceCode,
        SupervisorId: userData.SupervisorId
    }

    // ========== 1. BIO GET QUALITY USER ==========
    const getQualityUserPayload = {
        ApplicationUserId: userData.UserName,
        ClientInfo: clientInfo
    }

    let response = http.post(
        `${BASE_URL}/k6/finger/biogetqualityappuser`,
        JSON.stringify(getQualityUserPayload),
        { headers }
    )

    check(response, {
        'login-get-quality-user: status 200': (r) => r.status === 200,
    })

    //console.log(`login-get-quality-user [${userData.UserName}] → HTTP ${response.status}`)
    if (response.status !== 200) {
        console.log(`login-get-quality-user [${userData.UserName}] FAILED body: ${response.body}`)

        return response;
    }

    sleep(1)

    // ========== 2. BIO LOGIN VERIFICATION ==========
    const verifyPayload = {
        AppName: APP_NAME,
        ApplicationUserId: userData.UserName,
        ClientInfo: clientInfo,
        CoreClientInfo: coreClientInfo,
        Template: userData.Template,
        VerifiedActionId: 1,
        VerifyDate: new Date().toISOString().slice(0, 19).replace('T', ' ')
    }

    response = http.post(
        `${BASE_URL}/k6/finger/bioverification`,
        JSON.stringify(verifyPayload),
        { headers }
    )

    check(response, {
        'login-verfy: status 200': (r) => r.status === 200,
    })

    //.log(`login-verfy [${userData.UserName}] → HTTP ${response.status}`)
    if (response.status !== 200) {
        console.log(`login-verfy [${userData.UserName}] FAILED body: ${response.body}`)

        return response;
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
        "/reports/CBS-login-report.html": htmlReport(data),
    };
}