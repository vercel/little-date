<img height="237px" alt="little-date banner" src="https://github.com/timolins/little-date/raw/main/.github/banner.png"/>

<div align="center">
    <img src="https://badgen.net/npm/v/little-date" alt="NPM Version" />
    <img src="https://github.com/timolins/little-date/workflows/CI/badge.svg" alt="Build Status" />
</a>
</div>
<br />

<div align="center"><strong>Small & sweet date-range formatting</strong></div>
<div align="center">An opinionated library that makes date-ranges short and readable.</div>

<br />
<div align="center">
  <sub>Prepared by <a href="https://x.com/timolins">Timo Lins</a> 👨‍🍳 for a <a href="https://vercel.com/?ref=little-date">▲ Vercel</a> Hackathon</sub>
</div>

<br />

## Features

- ✨ **Short & readable output**
- ⚙️ **Zero configuration**
- ⏳ **Localization support** _(12 hour & 24-hour)_
- ✅ **Supports broad range of cases**

</br>

**Sample Outputs**

- `Jan 1 - 12`
- `Jan 3 - Apr 20`
- `January 2023`
- `Q1 2023`

You can find a full list of formatting examples [here](#formatting-examples).

## Usage

```js
import { formatDateRange } from "little-date";

const from = new Date("2021-01-01T00:00:00.000Z");
const to = new Date("2021-01-12T23:59:59.999Z");

console.log(formatDateRange(from, to)); // Outputs: "Jan 1 - 12"
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
| Full day, different year                  | `Sat, Jan 1, 2022`                       |
| **Special Cases**                         |                                          |
| Full year                                 | `2023`                                   |
| Quarter range                             | `Q1 2023`                                |
| Entire month                              | `January 2023`                           |
| **With time**                             |                                          |
| Today, different hours                    | `12am - 2:30pm`                          |
| Same day, different hours                 | `Jan 1, 12:11am - 2:30pm`                |
| Same day, different hours, 24-hour format | `Jan 1, 0:11 - 14:30`                    |
| Hour difference within a day              | `Jan 1, 12pm - 12:59pm`                  |
| Different days with time included         | `Jan 1, 12:11am - Jan 2, 2:30pm`         |
| Different years with time                 | `Jan 1 '22, 12:11am - Jan 2 '23, 2:30pm` |
| Different years, no time                  | `Jan 1 '22 - Jan 2 '23`                  |

## Contribute

We welcome contributions! If you'd like to improve `little-date` or have any feedback, feel free to open an issue or submit a pull request.

## License

MIT
