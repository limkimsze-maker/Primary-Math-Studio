import { engineHTML } from './template';
// Shared with the visible builder and offline engine.
// @ts-ignore -- the pure JS engine is also used by the offline assembler.
import { validate, activityHTML } from '../../../engine-src/core.mjs';
export function GET(request: Request) {
  try {
    const params = new URL(request.url).searchParams;
    const settings = params.get('settings');
    if (!settings || settings.length > 8000) throw new Error('Choose valid activity settings.');
    const c = validate(JSON.parse(settings));
    const asSettings = params.get('format') === 'settings';
    const html = activityHTML(engineHTML,c);
    return new Response(asSettings ? JSON.stringify(c, null, 2) : html, { headers: {
      'Content-Type': asSettings ? 'application/json; charset=utf-8' : 'text/html; charset=utf-8',
      'Content-Disposition': `attachment; filename="${c.engine}-${asSettings?'settings.json':'activity.html'}"`,
      'Cache-Control':'no-store',
      'X-Content-Type-Options':'nosniff',
    }});
  } catch (error) { return Response.json({error: error instanceof Error ? error.message : 'Invalid settings.'}, {status:400}); }
}
