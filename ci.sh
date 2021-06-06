#!/bin/bash
echo "Starting CI process"
echo "Testing backend app"
docker-compose -f docker-compose.prod.yml up -d db test_web
echo "End of testing backend app"
echo "Testing frontend app"
docker-compose -f docker-compose.prod.yml up -d test_frontend
echo "End of testing frontend app"
echo "End of CI process"