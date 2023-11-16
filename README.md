# little-date 📅

A minimalistic and opinionated date formatting library for JavaScript.

## Problem Statement

When building a date range picker or displaying date intervals in various applications, the representation can sometimes become overly verbose

**1. August 2023 - 31. August 2023**

Such extended strings can hinder the user experience, especially in interfaces where space is valuable. `little-date` provides a solution by offering concise, human-readable date range formats, making date presentations more user-friendly.

## Overview

`little-date` offers an opinionated approach to date range presentation, ensuring consistent and intuitive date formats across your application. With its clear design principles and user-centric focus, `little-date` reduces the cognitive load for end-users.

## Features

- 📌 Simplified date range displays.
- 📌 Lightweight and straightforward integration.
- 📌 Comprehensive date range formats spanning from hours to full years.

## Installation

```bash
npm install little-date
```

## Usage

```js
import { formatDateRange } from "little-date";

const from = new Date("2021-01-01T12:00:00.000Z");
const to = new Date("2021-01-12T12:00:00.000Z");
console.log(formatDateRange(from, to)); // Outputs: "Jan 1 - 12"
```

## Contribute

We welcome contributions! If you'd like to improve `little-date` or have any feedback, feel free to open an issue or submit a pull request.

## License

MIT
