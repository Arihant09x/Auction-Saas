'use strict';
const path = require('path');

// 1. FORCE LOAD ENV VARS IMMEDIATELY
// Adjust this path if your .env is in a different folder relative to this file
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

exports.config = {
    // 2. CORE CONFIG
    // Adding a fallback string prevents the app from crashing if the .env acts up
    app_name: [process.env.NEW_RELIC_APP_NAME || 'RealAuction'],
    license_key: process.env.NEW_RELIC_LICENSE_KEY,

    // 3. LOGGING (Production safe)
    logging: {
        filepath: 'stdout', //for production and if u want local test remove this 
        level: 'info', // Change to 'trace' only if you are debugging New Relic itself
    },
    application_logging: {
        forwarding: {
            enabled: true,
            max_samples_stored: 10000
        }
    },

    // 4. DISTRIBUTED TRACING (Crucial for modern apps)
    distributed_tracing: {
        enabled: true,
    },

    // 5. SECURITY & ATTRIBUTES
    allow_all_headers: true,
    attributes: {
        exclude: [
            'request.headers.cookie',
            'request.headers.authorization',
            'request.headers.proxyAuthorization',
            'request.headers.setCookie*',
            'request.headers.x*',
            'response.headers.cookie',
            'response.headers.authorization',
            'response.headers.proxyAuthorization',
            'response.headers.setCookie*',
            'response.headers.x*'
        ]
    },

    // 6. IGNORE RULES (Very Important)
    rules: {
        ignore: [
            // Ignore health and metrics endpoints! 
            // Otherwise, UptimeRobot/Prometheus pinging every 10 seconds will ruin your APM stats.
            '^/api/health',
            '^/api/metrics'
        ]
    }
};