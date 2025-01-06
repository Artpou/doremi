import { Injectable } from '@nestjs/common';
import { and, eq, InferInsertModel, OneOrMany, SQL } from 'drizzle-orm';

import { CrudService } from '@/crud/crud.service';
import { albums, albumsToArtists } from '@/db/db.schema';
import { Tx } from '@/drizzle/drizzle.module';

import { AlbumResponse } from './album.schema';

@Injectable()
export class AlbumService extends CrudService<typeof albums, AlbumResponse> {
  protected entity = albums;

  async findMany(params: { id?: number; limit?: number }, tx?: Tx) {
    const where: SQL[] = [];

    if (params?.id) where.push(eq(albums.id, params.id));

    return await (this.db || tx).query.albums.findMany({
      columns: { createdAt: false },
      where: and(...where),
      limit: params?.limit,
      with: {
        reviews: { columns: { createdAt: false } },
        tracks: { columns: { createdAt: false } },
        tags: { with: { tag: { columns: { createdAt: false } } } },
        artists: { with: { artist: { columns: { createdAt: false } } } },
      },
    });
  }

  async find(params: { id?: number }, tx?: Tx) {
    const [album] = await this.findMany(params, tx);
    return album;
  }

  async create(
    values: OneOrMany<
      InferInsertModel<typeof albums> & { artistIds?: number[] }
    >,
    tx?: Tx,
  ) {
    values = Array.isArray(values) ? values : [values];

    return this.db.transaction(async (tx2) => {
      tx = tx || tx2;
      const albums = await super.create(values, tx);

      albums.forEach(async (album, idx) => {
        const linkIds = values?.[idx]?.artistIds;
        if (Array.isArray(linkIds) && linkIds.length === 0) return;

        await tx?.insert(albumsToArtists).values(
          (Array.isArray(linkIds) ? linkIds : [linkIds]).map((linkId) => ({
            albumId: album.id,
            artistId: Number(linkId),
          })),
        );
      });

      return albums;
    });
  }
}
