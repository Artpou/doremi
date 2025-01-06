import { Injectable } from '@nestjs/common';
import { and, eq, SQL } from 'drizzle-orm';

import { CrudService } from '@/crud/crud.service';
import { artists } from '@/db/db.schema';
import { Tx } from '@/drizzle/drizzle.module';

import { ArtistResponse } from './artist.schema';

@Injectable()
export class ArtistService extends CrudService<typeof artists, ArtistResponse> {
  protected entity = artists;

  async findMany(params: { id?: number; limit?: number }, tx?: Tx) {
    const where: SQL[] = [];

    if (params?.id) where.push(eq(artists.id, params.id));

    return await (this.db || tx).query.artists.findMany({
      columns: { createdAt: false },
      where: and(...where),
      limit: params.limit,
      with: {
        albums: { with: { album: { columns: { createdAt: false } } } },
      },
    });
  }

  async find(params: { id?: number }, tx?: Tx) {
    const [artist] = await this.findMany(params, tx);
    return artist;
  }
}
