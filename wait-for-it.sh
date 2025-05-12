#!/bin/sh

# Simple script to wait for a host and port to become available
# Usage: /wait-for-it.sh host port
# Example: /wait-for-it.sh postgres 5432

HOST=$1
PORT=$2
TIMEOUT=120
QUIET=0

echo "Waiting for $HOST:$PORT..."

start_time=$(date +%s)

while true
do
  nc -z $HOST $PORT >/dev/null 2>&1
  result=$?
  
  if [ $result -eq 0 ]
  then
    echo "$HOST:$PORT is available"
    break
  fi
  
  current_time=$(date +%s)
  elapsed=$((current_time - start_time))
  
  if [ $elapsed -gt $TIMEOUT ]
  then
    echo "Timeout after $TIMEOUT seconds waiting for $HOST:$PORT"
    exit 1
  fi
  
  sleep 1
done

# Execute command if provided
shift 2
if [ "$#" -gt 0 ]
then
  exec "$@"
fi 
