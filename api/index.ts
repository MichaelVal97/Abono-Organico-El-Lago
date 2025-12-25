import { bootstrap } from '../backend/src/vercel';

export default async function handler(req: any, res: any) {
    const app = await bootstrap();
    // Vercel serverless function request handler
    app(req, res);
}
