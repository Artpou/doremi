import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

// Base schemas
export const ExternalUrlsSchema = z.object({
  spotify: z.string().url(),
});

export const ImageSchema = z.object({
  url: z.string().url(),
  height: z.number().nullable(),
  width: z.number().nullable(),
});

export const FollowersSchema = z.object({
  total: z.number(),
});

// Artist schema
export const ArtistSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  uri: z.string(),
  external_urls: ExternalUrlsSchema,
  followers: FollowersSchema.optional(),
  genres: z.array(z.string()).optional(),
  images: z.array(ImageSchema).optional(),
  popularity: z.number().min(0).max(100).optional(),
});

// Album schema
export const AlbumSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  uri: z.string(),
  album_type: z.string(),
  artists: z.array(ArtistSchema),
  external_urls: ExternalUrlsSchema,
  images: z.array(ImageSchema),
  release_date: z.string(),
  total_tracks: z.number(),
});

// Track schema
export const TrackSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  uri: z.string(),
  artists: z.array(ArtistSchema),
  album: AlbumSchema,
  duration_ms: z.number(),
  explicit: z.boolean(),
  external_urls: ExternalUrlsSchema,
  preview_url: z.string().nullable(),
  popularity: z.number().min(0).max(100).optional(),
});

// User schema
export const UserSchema = z.object({
  id: z.string(),
  display_name: z.string(),
  email: z.string().email(),
  external_urls: ExternalUrlsSchema,
  followers: FollowersSchema,
  images: z.array(ImageSchema),
  type: z.string(),
  uri: z.string(),
});

// Paging schema
export const PagingSchema = <T extends z.ZodType>(itemSchema: T) =>
  z.object({
    items: z.array(itemSchema),
    total: z.number(),
    limit: z.number(),
    offset: z.number(),
    next: z.string().nullable(),
    previous: z.string().nullable(),
  });

export const TrackResultsSchema = PagingSchema(TrackSchema);
export const AlbumResultsSchema = PagingSchema(AlbumSchema);
export const ArtistResultsSchema = PagingSchema(ArtistSchema);

// Search results schema
export const SearchResultsSchema = z.object({
  tracks: TrackResultsSchema.optional(),
  artists: ArtistResultsSchema.optional(),
  albums: AlbumResultsSchema.optional(),
});

export const NewReleasesSchema = z.object({
  albums: AlbumResultsSchema,
});

// Export types
export type Artist = z.infer<typeof ArtistSchema>;
export type Album = z.infer<typeof AlbumSchema>;
export type Track = z.infer<typeof TrackSchema>;
export type User = z.infer<typeof UserSchema>;
export type SearchResults = z.infer<typeof SearchResultsSchema>;
export type TrackResults = z.infer<typeof TrackResultsSchema>;
export type AlbumResults = z.infer<typeof AlbumResultsSchema>;
export type NewReleases = z.infer<typeof NewReleasesSchema>;
// dto
export class SearchDto extends createZodDto(SearchResultsSchema) {}
export class TrackDto extends createZodDto(TrackResultsSchema) {}
export class AlbumDto extends createZodDto(AlbumResultsSchema) {}
export class NewReleasesDto extends createZodDto(NewReleasesSchema) {}
