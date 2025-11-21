<img alt="little-date banner" src="https://github.com/vercel/little-date/raw/main/.github/banner.png"/>

<div align="center">
    <img src="https://badgen.net/npm/v/little-date?" alt="NPM Version" />
    <img src="https://github.com/vercel/little-date/workflows/CI/badge.svg" alt="Build Status" />
</a>
</div>
<br />

<div align="center"><strong>Small & sweet date-range formatting</strong></div>
<div align="center">An opinionated library that makes date-ranges short and readable.</div>

<br />
<div align="center">
  <sub>Prepared by <a href="https://x.com/timolins">Timo Lins</a> 👨‍🍳 during a <a href="https://vercel.com/?ref=little-date">▲ Vercel</a> Hackathon</sub>
</div>

<br />

## Introduction

When displaying date-ranges in UI, they are often too long, repetitive, and hard to read. `little-date` solves this problem by making date ranges **short**, **readable**, and **easy to understand**.

Consider this example:

```javascript
// Typical long format
console.log(`${from.toLocaleString()} - ${to.toLocaleString()}`);
// Output: "1/1/2024, 00:00:00 AM - 1/12/2024, 23:59:59 PM"

// With little-date
console.log(formatDateRange(from, to));
// Output: "Jan 1 - 12"
```

`little-date` is based on [date-fns](https://date-fns.org/). It supports localization and can be used in both Node.js and the browser.

**Examples dates ✨**

- `Jan 1 - 12`
- `Jan 3 - Apr 20`
- `January 2023`
- `Q1 2023`

Wasn't that easy to read? You can find a full list of formatting examples [here](#formatting-examples).

## Usage

```js
import { formatDateRange } from 'little-date';

const from = new Date('2023-01-01T00:00:00.000Z');
const to = new Date('2023-01-12T23:59:59.999Z');

formatDateRange(from, to); // Outputs: "Jan 1 - 12"
```

## Installation

#### With pnpm

```sh
pnpm i little-date
```

#### With NPM

```sh
npm i little-date
```

## Formatting Examples

| Description                               | Output                                   |
| ----------------------------------------- | ---------------------------------------- |
| Multiple days, same month                 | `Jan 1 - 12`                             |
| Multiple days, different months           | `Jan 3 - Apr 20`                         |
| Full day                                  | `Sun, Jan 1`                             |
| Range spanning different years            | `Jan 1 '22 - Jan 20 '23`                 |
| Multiple days, same month, past year      | `Jan 1 - 12, 2022`                       |
| Full day, past year                       | `Sat, Jan 1, 2022`                       |
| **Special cases**                         |                                          |
| Full year                                 | `2023`                                   |
| Quarter range                             | `Q1 2023`                                |
| Full month                                | `January 2023`                           |
| Full months                               | `Jan - Feb 2023`                         |
| **With time**                             |                                          |
| Today, different hours                    | `12am - 2:30pm`                          |
| Same day, different hours                 | `Jan 1, 12:11am - 2:30pm`                |
| Same day, different hours, 24-hour format | `Jan 1, 0:11 - 14:30`                    |
| Hour difference within a day              | `Jan 1, 12pm - 12:59pm`                  |
| Different days with time included         | `Jan 1, 12:11am - Jan 2, 2:30pm`         |
| Different years with time                 | `Jan 1 '22, 12:11am - Jan 2 '23, 2:30pm` |
| Different years, no time                  | `Jan 1 '22 - Jan 2 '23`                  |

## Advanced Options

Most of the formatting behavior is opinionated and can't be changed. However, there are some options that can be used to customize the output.

```js
import { formatDateRange } from 'little-date';

// ...

formatDateRange(from, to, {
  locale: 'de-AT', // Overwrite the default locale
  includeTime: false, // Prevent time from being displayed
  today: new Date(), // Overwrite the default "today" date, useful for testing
  separator: '-', // Overwrite the default separator. E.g. from "Jan 1 - 12" to "Jan 1 to 12"
  timezone: 'Europe/Vienna', // Overwrite the timezone used for displaying times
});
```

## Customization

To keep things simple, there is minimal customization offered by `little-date`.

For more extensive customization beyond the provided options, it's recommended to copy the implementation from [`src/format-date-range.ts`](https://github.com/vercel/little-date/blob/main/src/format-date-range.ts) into your own repository. This allows you to modify the formatting logic to precisely fit your needs.

## Contribute

We welcome contributions! If you'd like to improve `little-date` or have any feedback, feel free to open an issue or submit a pull request.

## License

MIT
