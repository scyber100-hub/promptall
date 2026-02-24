import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const LOCALE_NAMES: Record<string, string> = {
  en: 'English',
  ko: 'Korean',
  ja: 'Japanese',
  zh: 'Chinese (Simplified)',
  es: 'Spanish',
  fr: 'French',
};

export async function POST(req: NextRequest) {
  try {
    const { content, targetLocale } = await req.json();
    if (!content || !targetLocale) {
      return NextResponse.json({ error: 'Missing content or targetLocale' }, { status: 400 });
    }

    const targetLanguage = LOCALE_NAMES[targetLocale] || targetLocale;

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: `Translate the following AI prompt to ${targetLanguage}. Keep the structure and intent of the prompt exactly the same. Only translate the text, do not add any explanation or formatting. Output only the translated prompt:\n\n${content}`,
        },
      ],
    });

    const translated = (message.content[0] as { type: string; text: string }).text;
    return NextResponse.json({ translated });
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
  }
}
