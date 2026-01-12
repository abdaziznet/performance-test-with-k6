// load-test.js - K6 Load Testing Script with Dynamic Data
import { sleep } from 'k6'
import http from 'k6/http'
import { check } from 'k6'
import { testDataLogin } from '../data/test-data-login.js'

export const options = {
    stages: [
        { duration: '30s', target: 10 },  // Ramp-up ke 10 VUs
        { duration: '1m', target: 10 },   // Hold 10 VUs selama 1 menit
        { duration: '30s', target: 0 },   // Ramp-down ke 0
    ],
    thresholds: {
        http_req_duration: ['p(95)<500'], // 95% request harus < 500ms
        http_req_failed: ['rate<0.1'],    // Error rate harus < 10%
    },
}

// Konstanta
const BASE_URL = 'http://192.168.5.68'
const APPLICATION_VERSION = '2025.1.1219.0'
const X_REQUESTER_HEADER = '1/0x042D12E6126BA935FAFF9466A0D1C65EDC7DC0AB456CEBC136E015F4CE8B3C51/2025.1.1219.0'

export default function main() {
    // Pilih data random dari array testData
    const userData = testDataLogin[Math.floor(Math.random() * testDataLogin.length)]

    // Persiapkan common headers
    const headers = {
        'Content-Type': 'application/json',
        'User-Agent': 'insomnia/12.2.0',
        'X-RequesterHeader': X_REQUESTER_HEADER,
    }

    // Persiapkan ClientInfo yang digunakan di semua request
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
        'getqualityuser: response time < 500ms': (r) => r.timings.duration < 500,
    })

    sleep(0.5)

    // ========== 2. LOGIN ==========
    const loginPayload = {
        ClientInfo: clientInfo,
        LoginTime: userData.LoginTime,
        Password: userData.Password,
        Template: userData.Template,
        UserName: userData.UserName
    }

    response = http.post(
        `${BASE_URL}/k6/finger/login`,
        JSON.stringify(loginPayload),
        { headers }
    )

    check(response, {
        'login: status 200': (r) => r.status === 200,
        'login: response time < 1000ms': (r) => r.timings.duration < 1000,
        'login: has token': (r) => {
            try {
                const body = JSON.parse(r.body)
                return body.token !== undefined || body.success === true
            } catch {
                return false
            }
        }
    })

    sleep(1)

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
        'dashboard: response time < 800ms': (r) => r.timings.duration < 800,
    })

    // Think time - simulasi user membaca dashboard
    sleep(2)
}

// Fungsi untuk smoke testing (optional)
export function setup() {
    console.log('🚀 Starting load test with', testDataLogin.length, 'test users')
    console.log('📊 Target:', BASE_URL)
}

// Fungsi untuk teardown (optional)
export function teardown(data) {
    console.log('✅ Load test completed')
}