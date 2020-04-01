require('@babel/register')({
  'presets': ['@babel/env'],
  'rootMode': 'upward-optional',
});

require('@babel/polyfill');
