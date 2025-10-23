#!/bin/bash
cd /home/kavia/workspace/code-generation/containerized-network-management-6128-5251/FrontendApplication
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

