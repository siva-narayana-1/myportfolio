#!/bin/bash

# Dynamic Port Configuration Script
# Usage: ./scripts/start-dynamic.sh [BACKEND_PORT] [FRONTEND_PORT]

BACKEND_PORT=${1:-5430}
FRONTEND_PORT=${2:-3004}

echo "═══════════════════════════════════════════════════════"
echo "🚀 Starting Portfolio with Dynamic Ports"
echo "═══════════════════════════════════════════════════════"
echo "📍 Backend Port: $BACKEND_PORT"
echo "📍 Frontend Port: $FRONTEND_PORT"
echo "📍 API URL: http://localhost:$BACKEND_PORT"
echo "📍 Frontend URL: http://localhost:$FRONTEND_PORT"
echo "═══════════════════════════════════════════════════════"

# Create logs directory
mkdir -p logs

# Export environment variables
export BACKEND_PORT=$BACKEND_PORT
export FRONTEND_PORT=$FRONTEND_PORT
export NEXT_PUBLIC_API_URL="http://localhost:$BACKEND_PORT"
export FRONTEND_URL="http://localhost:$FRONTEND_PORT"

# Update .env file with new ports (optional)
if [ "$3" != "--no-update-env" ]; then
  echo "Updating .env file..."
  sed -i "s/FRONTEND_PORT=.*/FRONTEND_PORT=\"$FRONTEND_PORT\"/" .env
  sed -i "s/BACKEND_PORT=.*/BACKEND_PORT=\"$BACKEND_PORT\"/" .env
  sed -i "s|NEXT_PUBLIC_API_URL=.*|NEXT_PUBLIC_API_URL=\"http://localhost:$BACKEND_PORT\"|" .env
  sed -i "s|FRONTEND_URL=.*|FRONTEND_URL=\"http://localhost:$FRONTEND_PORT\"|" .env
fi

# Start development servers
npm run dev

echo ""
echo "✅ Portfolio is running!"
echo "   Frontend: http://localhost:$FRONTEND_PORT"
echo "   Backend API: http://localhost:$BACKEND_PORT"
echo "═══════════════════════════════════════════════════════"
