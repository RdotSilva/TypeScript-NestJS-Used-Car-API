import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';

// Limit the constructor to a class only
interface ClassConstructor {
  new (any: [], ...args): {};
}

// Custom decorator that we can use to serialize data using the interceptor
export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}

  intercept(
    context: ExecutionContext,
    handler: CallHandler<any>,
  ): Observable<any> {
    return handler.handle().pipe(
      map((data: any) => {
        // Convert the incoming data to a user data object before the response is sent out
        return plainToClass(this.dto, data, {
          excludeExtraneousValues: true, // Only share properties that are marked with the @Expose annotation
        });
      }),
    );
  }
}
