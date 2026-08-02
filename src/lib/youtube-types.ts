export type YouTubeShort = {
  id: string;
  title: string;
  thumbnailUrl: string;
  publishedAt: string;
  durationSeconds: number;
};

export type YouTubeFeaturedVideo = {
  id: string;
  title: string;
  thumbnailUrl: string;
  durationSeconds: number;
};

export type YouTubePlaylist = {
  id: string;
  title: string;
  thumbnailUrl: string;
  itemCount: number;
};

export type YouTubeHomeContent = {
  channelId: string;
  channelTitle: string;
  channelThumbnailUrl: string;
  subscriberCount: number | null;
  shorts: YouTubeShort[];
  featuredVideos: YouTubeFeaturedVideo[];
  playlists: YouTubePlaylist[];
};
