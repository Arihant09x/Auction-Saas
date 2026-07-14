import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import * as dotenv from 'dotenv';
dotenv.config();
/**
 * Initialize Sentry APM.
 * Must be called BEFORE NestFactory.create() in main.ts.
 * No-op in development unless SENTRY_DSN is explicitly set.
 */
export function initSentry(): void {
    const dsn = process.env.SENTRY_DSN;
    const env = process.env.NODE_ENV || 'development';

    // Only init when DSN is configured (opt-in for production)
    if (!dsn) {
        console.log('ℹ️  Sentry: SENTRY_DSN not set — skipping APM init', dsn);
        return;
    }

    Sentry.init({
        dsn,
        environment: env,
        integrations: [
            nodeProfilingIntegration(),
        ],
        // Performance: trace 100% in prod; 0% in dev
        tracesSampleRate: env === 'production' ? 1.0 : 0.1,
        profilesSampleRate: env === 'production' ? 0.5 : 0.0,
        // Send release info if available (set by CI/CD)
        release: process.env.APP_VERSION || 'unknown',
    });

    console.log(`✅ Sentry initialized [env=${env}]`);
}

/**
 * Capture an error to Sentry with optional extra context.
 * Wraps Sentry so callers never need to import Sentry directly.
 */
export function captureError(
    error: unknown,
    context?: Record<string, unknown>,
): void {
    if (process.env.SENTRY_DSN) {
        Sentry.withScope((scope) => {
            if (context) {
                scope.setExtras(context);
            }
            Sentry.captureException(error);
        });
    }

    // Synchronize to New Relic
    try {
        const nr = require('newrelic');
        nr.noticeError(
            error instanceof Error ? error : new Error(String(error)),
            context || {}
        );
    } catch (error) {
        // newrelic not loaded or running
        console.log('❌ New Relic not loaded or running', error);
    }
}

/**
 * Add a breadcrumb for structured event tracing.
 */
export function addBreadcrumb(
    message: string,
    data?: Record<string, unknown>,
): void {
    if (!process.env.SENTRY_DSN) return;
    Sentry.addBreadcrumb({ message, data: data ?? {}, level: 'info' });
}
