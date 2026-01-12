// K6 Configuration for UAT Performance Testing

export const CONFIG = {
    // Environment
    env: 'UAT',

    // Base URL - melalui Nginx load balancer
    baseUrl: __ENV.BASE_URL || 'http://localhost',

    // API Endpoints
    endpoints: {
        enroll: '/',
        verify: '/api/fingerprint/verify',
        identify: '/api/fingerprint/identify',
        inquiry: '/api/users',
        health: '/health',
        lbStatus: '/lb-status',
    },

    // Authentication
    auth: {
        enabled: true,
        token: __ENV.API_TOKEN || 'YOUR_UAT_TOKEN',
        type: 'Bearer',
    },

    // Test Data Files
    testData: {
        usersFile: './data/test-users.json',
        fingerprintsFile: './data/test-fingerprints.json',
    },

    // InfluxDB Output Configuration
    influxdb: {
        url: 'http://localhost:8086/k6',
        database: 'k6',
    },

    // Thresholds for Different Test Types
    thresholds: {
        // Load Test Thresholds
        load: {
            http_req_duration: ['p(95)<500', 'p(99)<1000'],
            http_req_failed: ['rate<0.05'],
            http_reqs: ['rate>50'],
        },

        // Stress Test Thresholds (more relaxed)
        stress: {
            http_req_duration: ['p(95)<1000', 'p(99)<2000'],
            http_req_failed: ['rate<0.10'],
        },

        // Spike Test Thresholds
        spike: {
            http_req_duration: ['p(95)<1500', 'p(99)<3000'],
            http_req_failed: ['rate<0.15'],
        },

        // Soak Test Thresholds
        soak: {
            http_req_duration: ['p(95)<600', 'p(99)<1200'],
            http_req_failed: ['rate<0.05'],
            http_reqs: ['rate>40'],
        },
    },

    // Load Stages for Different Test Types
    stages: {
        // Load Test - Normal expected load
        load: [
            { duration: '1m', target: 20 },    // Warm up
            { duration: '3m', target: 50 },    // Ramp to 50 users
            { duration: '5m', target: 50 },    // Stay at 50 users
            { duration: '1m', target: 0 },     // Cool down
        ],

        // Stress Test - Push beyond normal capacity
        stress: [
            { duration: '2m', target: 50 },
            { duration: '5m', target: 100 },
            { duration: '5m', target: 150 },
            { duration: '5m', target: 200 },   // Peak load
            { duration: '2m', target: 0 },
        ],

        // Spike Test - Sudden traffic surge
        spike: [
            { duration: '1m', target: 20 },    // Normal load
            { duration: '30s', target: 200 },  // Sudden spike
            { duration: '3m', target: 200 },   // Maintain spike
            { duration: '1m', target: 20 },    // Back to normal
            { duration: '1m', target: 0 },
        ],

        // Soak Test - Extended duration test
        soak: [
            { duration: '2m', target: 50 },
            { duration: '1h', target: 50 },    // Run for 1 hour
            { duration: '2m', target: 0 },
        ],
    },

    // Request Settings
    request: {
        timeout: '30s',
        insecureSkipTLSVerify: true,
        tags: {
            environment: 'uat',
            project: 'fsmgmt-performance-test',
        },
    },

    // Scenarios Configuration (for mixed load testing)
    scenarios: {
        enrollment: {
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [
                { duration: '2m', target: 10 },
                { duration: '5m', target: 10 },
                { duration: '1m', target: 0 },
            ],
            gracefulRampDown: '30s',
        },

        verify: {
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [
                { duration: '1m', target: 30 },
                { duration: '5m', target: 30 },
                { duration: '1m', target: 0 },
            ],
            gracefulRampDown: '30s',
        },

        inquiry: {
            executor: 'constant-vus',
            vus: 50,
            duration: '7m',
        },
    },
};

// Helper function to get config for specific test type
export function getTestConfig(testType) {
    const baseConfig = {
        thresholds: CONFIG.thresholds[testType] || CONFIG.thresholds.load,
        stages: CONFIG.stages[testType] || CONFIG.stages.load,
    };

    return baseConfig;
}

export default CONFIG;