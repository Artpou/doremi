import { Injectable, NotFoundException } from '@nestjs/common';
import { and, eq, OneOrMany, SQL } from 'drizzle-orm';

import { CrudService } from '@/crud/crud.service';
import { tracks, tracksToArtists } from '@/db/db.schema';
import { Tx } from '@/drizzle/drizzle.module';

import { TrackResponse } from './track.schema';

@Injectable()
export class TrackService extends CrudService<typeof tracks, TrackResponse> {
  entity = tracks;

  async findMany(params: { id?: number; limit?: number }, tx?: Tx) {
    const where: SQL[] = [];

    if (params.id) where.push(eq(tracks.id, params.id));

    return await (this.db || tx).query.tracks.findMany({
      columns: { createdAt: false },
      where: and(...where),
      limit: params.limit,
    });
  }

  async find(params: { id?: number }, tx?: Tx) {
    const [track] = await this.findMany(params, tx);
    if (!track) throw new NotFoundException('Track not found');
    return track;
  }

  async create(
    values: OneOrMany<typeof this.insert & { artistIds?: number[] }>,
    tx?: Tx,
  ) {
    values = Array.isArray(values) ? values : [values];

    return this.db.transaction(async (tx2) => {
      tx = tx || tx2;
      const tracks = await super.create(values, tx);

      tracks.forEach(async (track, idx) => {
        const linkIds = values?.[idx]?.artistIds;
        if (Array.isArray(linkIds) && linkIds.length === 0) return;

        await tx?.insert(tracksToArtists).values(
          (Array.isArray(linkIds) ? linkIds : [linkIds]).map((linkId) => ({
            trackId: track.id,
            artistId: Number(linkId),
          })),
        );
      });

      return tracks;
    });
  }
}
