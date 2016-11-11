# React SSR Starter Kit

[![Build Status](https://travis-ci.org/shendepu/react-ssr-starter-kit.svg?branch=master)](https://travis-ci.org/shendepu/react-ssr-starter-kit)

This is derived from [React Redux Starter Kit](https://github.com/davezuko/react-redux-starter-kit) by adding server-side rendering capability. It is diverged from commit `c3abb24`

It also adds one script `npm run deploy:prod-ssr`

- `npm run deploy:prod-ssr`: produce synchronous build for production server use to do server-side rendering. Output is in `dist_ssr`
- `npm run deploy:prod`: produce synchronous build for production client use with asynchronous module downloading and loading. Output is in `dist`

# Server implementation:

[Moqui React SSR](https://github.com/shendepu/moqui-react-ssr)

# References:

- https://medium.com/@apostolos/server-side-rendering-code-splitting-and-hot-reloading-with-react-router-v4-87239cfc172c#.2q9zxspyo
