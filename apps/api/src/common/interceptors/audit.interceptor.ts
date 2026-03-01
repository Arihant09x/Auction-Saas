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

    // Only Log "Writes" (POST, PATCH, PUT, DELETE)
    // Ignore GET requests to save DB space
    if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
      return next.handle().pipe(
        tap(() => {
          // This code runs AFTER the request is successful
          if (req.user) {
            // Only log if user is logged in
            this.auditService.log(
              req.user.id,
              `${method} ${req.route.path}`, // Action: "POST /auction"
              req.originalUrl,
              req.body, // Capture what they sent
              req.ip
            );
          }
        })
      );
    }

    return next.handle();
  }
}
