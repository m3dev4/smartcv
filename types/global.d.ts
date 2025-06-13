import { NextRequest } from 'next/server';

declare global {
  type RouteContext = {
    params: {
      id: string;
    };
  };

  type RouteHandler = (
    request: NextRequest, 
    context: RouteContext
  ) => Promise<Response>;
} 