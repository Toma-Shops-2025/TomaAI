const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://irzzehvrytkunrxqniuo.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('SUPABASE_SERVICE_ROLE_KEY environment variable is required');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

exports.handler = async (event, context) => {
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { imageUrl, prompt, style, userId } = JSON.parse(event.body);

    if (!imageUrl || !prompt || !style || !userId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required parameters' }),
      };
    }

    console.log('Downloading image from:', imageUrl);

    // Download the image from DALL-E
    const response = await fetch(imageUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }

    const imageBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(imageBuffer);

    // Generate a unique filename
    const timestamp = Date.now();
    const sanitizedPrompt = prompt.slice(0, 20).replace(/[^a-zA-Z0-9]/g, '-');
    const fileName = `${timestamp}-${sanitizedPrompt}-${style}.png`;

    console.log('Uploading to Supabase Storage:', fileName);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('generated-images')
      .upload(fileName, buffer, {
        contentType: 'image/png',
        upsert: false,
      });

    if (error) {
      console.error('Storage upload error:', error);
      throw new Error(`Storage upload failed: ${error.message}`);
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('generated-images')
      .getPublicUrl(fileName);

    console.log('Image stored successfully:', publicUrl);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        imageUrl: publicUrl,
        fileName,
      }),
    };

  } catch (error) {
    console.error('Proxy error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message,
      }),
    };
  }
};
