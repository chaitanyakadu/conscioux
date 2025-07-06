# Tasks Manager

## Introduction

**Tasks Manager** is a worker which pulls the tasks from redis and executes it whenever latest crypto data arrives. The pull takes place from redis rpop where as for latest crypto data we have subscribed to redis. The executed task outcome triggers a notification.

## Key Features

- Pulls tasks from the redis and executes them.
- If the task is as expected then it will trigger a notification

## Note

The code has multiple bugs, which can not be debugged without developing backend server. 