import http from 'k6/http';
import { check, sleep } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

// export let options = {
//     vus: 10,          // 10 concurrent users
//     duration: '2s',    // 30 second
// };

export let options = {
    stages: [
        { duration: '20s', target: 50 },
        { duration: '20s', target: 100 },
        { duration: '20s', target: 100 },
    ],
};

export default function () {
    const res = http.get('http://192.168.5.68/k6/finger/license');

    check(res, {
        'status is 200': r => r.status === 200,
    });

    sleep(1); // simulasi user berpikir
}

export function handleSummary(data) {
    return {
        "/reports/license-test-report-2.html": htmlReport(data),
    };
}