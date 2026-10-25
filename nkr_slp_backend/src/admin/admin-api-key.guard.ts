import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { createHash, timingSafeEqual } from 'node:crypto';

@Injectable()
export class AdminApiKeyGuard implements CanActivate {
  constructor(@Inject('ADMIN_API_KEY') private readonly expectedKey: string) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ headers: Record<string, string | undefined> }>();
    const providedKey = request.headers['x-admin-api-key'] ?? '';
    if (!this.expectedKey || !providedKey) {
      throw new UnauthorizedException();
    }

    const expectedDigest = createHash('sha256').update(this.expectedKey).digest();
    const providedDigest = createHash('sha256').update(providedKey).digest();
    if (!timingSafeEqual(expectedDigest, providedDigest)) {
      throw new UnauthorizedException();
    }
    return true;
  }
}
