import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  // Grafana is used at http://localhost:3020 (see docker-compose). Subpath rewrites + dual ROOT_URLs
  // caused ERR_TOO_MANY_REDIRECTS for many setups.
};

export default nextConfig;
