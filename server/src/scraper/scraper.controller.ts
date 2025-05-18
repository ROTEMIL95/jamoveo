import { Controller, Get, Query } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';

@Controller('scraper')
export class ScraperController {
  @Get()
  async getSong(@Query('title') title: string, @Query('url') url?: string) {
    if (!title && !url) return { error: 'Must provide title or URL' };

    try {
      let songUrl = url;

      if (!songUrl) {
        const encodedTitle = encodeURIComponent(title.trim());
        const searchUrl = `https://www.tab4u.com/tsearch.php?key=${encodedTitle}`;
        const searchPage = await axios.get(searchUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/90.0.4430.93 Safari/537.36',
          },
        });
        const $ = cheerio.load(searchPage.data);
        const firstLink = $('a.song').attr('href');
        if (!firstLink) return { error: 'Song not found on Tab4U' };
        songUrl = `https://www.tab4u.com${firstLink}`;
      }

      const songPage = await axios.get(songUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/90.0.4430.93 Safari/537.36',
        },
      });
      const $$ = cheerio.load(songPage.data);

      // DEBUG: הצג את תוכן שיר (500 תווים ראשונים)
      const preview = $$('#song_body').html()?.slice(0, 500) || 'No content found';
      console.log('🧪 HTML Preview:', preview);

      const lines: { chords: string; lyrics: string }[] = [];
      $$('#song_body .songtext .row').each((_, row) => {
        const rowEl = $$(row);
        const chords = rowEl.find('.tchords').text().trim();
        const lyrics = rowEl.find('.tlyrics').text().trim();
        if (lyrics || chords) {
          lines.push({ chords, lyrics });
        }
      });

      return {
        title: title || 'Unknown',
        url: songUrl,
        lines,
      };
    } catch (err) {
      console.error(err);
      return { error: 'Failed to scrape song' };
    }
  }
}
