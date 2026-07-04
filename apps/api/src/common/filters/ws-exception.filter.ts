import {
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { captureError } from '../monitoring/sentry';

/**
 * WsExceptionFilter — Global WebSocket exception handler.
 *
 * Catches ALL exceptions thrown inside @SubscribeMessage handlers.
 * - Emits a structured `error` event back to the offending socket.
 * - Captures unknown errors (non-WsException, non-HttpException) to Sentry.
 */
@Catch()
export class WsExceptionFilter extends BaseWsExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost): void {
        if (host.getType() !== 'ws') {
            const ctx = host.switchToHttp();
            const response = ctx.getResponse<any>();
            const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
            const exceptionResponse = exception instanceof HttpException ? exception.getResponse() : { message: 'Internal server error' };
            const message = typeof exceptionResponse === 'object' && exceptionResponse !== null && 'message' in exceptionResponse
                ? (exceptionResponse as any).message
                : exceptionResponse;

            response.status(status).json({
                success: false,
                statusCode: status,
                message: Array.isArray(message) ? message[0] : message,
                timestamp: new Date().toISOString(),
            });
            return;
        }

        const client = host.switchToWs().getClient<any>();
        const data = host.switchToWs().getData();

        let message: string;
        let code: string | number = 'WS_ERROR';

        if (exception instanceof WsException) {
            const err = exception.getError();
            message = typeof err === 'string' ? err : (err as any).message ?? 'WebSocket error';
            code = (err as any).status ?? 'WS_ERROR';
        } else if (exception instanceof HttpException) {
            message = exception.message;
            code = exception.getStatus();
        } else if (exception instanceof Error) {
            message = exception.message;
            // Only report truly unexpected errors to Sentry
            captureError(exception, {
                socketId: client?.id,
                data,
            });
        } else {
            message = 'Unknown WebSocket error';
            captureError(new Error(String(exception)), { socketId: client?.id });
        }

        // Emit structured error event back to client (never crash the handler)
        try {
            client?.emit('error', { code, message });
        } catch {
            // If client is already disconnected, ignore
        }
    }
}
