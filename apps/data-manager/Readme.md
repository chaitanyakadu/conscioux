# Data Manager

## Introduction

*Data Manager** is a worker service that periodically fetches cryptocurrency data from CoinMarketCap API endpoints. It processes the received data and distributes it to various storage systems for real-time use and long-term persistence.

## Details

- The service relies on two CoinMarketCap API endpoints to retrieve:
  1. **/listings/latest** - real-time
  2. **/info** - metadata

- Data handling strategy:
  - **Real-time market data** is published to **Redis** for fast, temporary access by downstream systems.
  - **Metadata** is cached and periodically pushed to a **PostgreSQL** database for reliable long-term storage.

## Key Features

- Scheduled via cron job for automated execution
- Efficient data structuring and separation of concerns
- Scalable integration with Redis and PostgreSQL
