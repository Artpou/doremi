import { Request } from 'fastify';
import { providers } from 'db/providers';
import { InferSelectModel } from 'drizzle-orm';

export interface AuthenticatedRequest extends Request {
  user: {
    id: number;
  };
  provider?: InferSelectModel<typeof providers>;
}
