export enum ProposalStatus {
  Active = 'Active',
  Passed = 'Passed',
  Failed = 'Failed',
}

export interface Proposal {
  id: string;
  title: string;
  description: string;
  status: ProposalStatus;
  endsAt: string;
  yesVotes: number;
  totalVotes: number;
}

export interface Meme {
  id: string;
  imageUrl: string;
  author: string;
  tips: number;
  createdAt: string;
}

export interface TokenStats {
  price: number;
  marketCap: number;
  liquidity: number;
  holders: number;
  volume24h: number;
  burnedToken: number;
  burnPercent: number;
  tax: string;
  lpStatus: string;
}

export enum NavItem {
  Home = '/',
  Stats = '/play',
  NFTs = '/nfts',
  Roadmap = '/roadmap',
  Community = '/community',
}

export interface Ping {
  id: string;
  lat: number;
  lng: number;
  color: string;
  createdAt: any;
}
