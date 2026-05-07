---
description: Read this file to understand how to fetch data in the project.
---

# Data Fetching Instructions

This document outlines the best practices for fetching data in our Next.js applications. Adhering to these guidelines will ensure consistency, performance, and maintainability across our codebase.

## 1. User Server Components for Data Fetching

In Next.js ALWAYS using Server Components for data fetching. NEVER use Client Components to fetch data.

## 2. Data Fetching Methods

ALWAYS use the helper functions in the /data directory to fetch data. NEVER fetch data directly in the components.

ALL helper functions in the /data directory should use Drizzle ORM for database instructions.
