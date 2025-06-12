import { NextRequest } from 'next/server';

declare module 'next/server' {
  export interface RouteParams {
    params: {
      id: string;
    };
  }

  export type RouteHandler = (
    request: NextRequest, 
    context: { params: { id: string } }
  ) => Promise<Response>;
} 