import http from 'k6/http';
import { check, sleep } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

// Konfigurasi Load Testing
export const options = {
    stages: [
        { duration: '30s', target: 20 }, // Ramp-up ke 20 user selama 30 detik
        { duration: '1m', target: 20 },  // Tahan 20 user selama 1 menit
        { duration: '10s', target: 0 },  // Ramp-down ke 0 user
    ],
};

export default function () {
    // Ganti URL ini dengan target yang ingin Anda test
    const res = http.get('https://test.k6.io');

    check(res, { 'status was 200': (r) => r.status == 200 });

    sleep(1);
}

export function handleSummary(data) {
    return {
        "/scripts/reports/summary-report.html": htmlReport(data),
    };
}
