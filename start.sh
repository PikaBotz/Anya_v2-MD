#!/bin/bash

# Function to detect the hosting platform
detect_platform() {
  if [[ "$(uname)" == "Linux" ]]; then
    echo "Linux"
  elif [[ "$(uname)" == "Darwin" ]]; then
    echo "macOS"
 elif [[ "$(uname)" == "replit" ]]; then
    echo "replit"
 elif [ ! -z "$REPLIT" ]; then
    echo "Replit"
  else
    echo "Unknown"
  fi
}

# Get the platform
platform=$(detect_platform)

# Run different code based on the platform
case $platform in
  "Linux")
    echo " Linux OS Platform Detected"
    yarn install && yarn start
    ;;
  "macOS")
    echo "Mac OS Platform Detected"
    yarn install && yarn start
    ;;
  "replit")
    echo "Replit Platform Detected"
    yarn && yarn start 
    ;;
"Replit")
    echo "Replit Platform Detected"
    yarn install && yarn start 
    ;;
  "Unknown")
    echo "Unsupported platform"
    ;;
esac