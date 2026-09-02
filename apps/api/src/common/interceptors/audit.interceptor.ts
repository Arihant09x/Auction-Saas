import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { AuditService } from "../../modules/audit/audit.service";

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const method = req.method;

    // Only log "writes" (POST, PATCH, PUT, DELETE); skip GETs to save space
    if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
      return next.handle().pipe(
        tap(() => {
          // Runs AFTER the request succeeds
          if (req.user) {
            this.auditService.log(
              req.user.id,
              `${method} ${req.route?.path ?? req.url}`,
              req.originalUrl,
              req.body,
              req.ip,
              req.headers['user-agent'],
            );
          }
        }),
      );
    }

    return next.handle();
  }
}
