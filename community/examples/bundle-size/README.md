# Form Libraries Bundle Size Comparison

This project contains multiple applications for comparing the bundle sizes of different form libraries.

## Project Structure

### Engines

- **formengine** — FormEngine Core
- **rjsf** — React JSON Schema Form
- **survey** — SurveyJS
- **vueform** — VueForm

### Test Applications

For comparison, two real-world use cases are used: a **login form** and a **hotel booking wizard**. They are implemented to be as similar as
possible, using the default UI kits and Material UI where applicable.

To run a build or development server, set the `APP_INPUT` environment variable beforehand to choose which application to start or build.

Available `APP_INPUT` values:

- **login** — login application
- **login-mui** — login application with MUI library/styling
- **booking** — booking application
- **booking-mui** — booking application with MUI library/styling

## Setup

Install all dependencies from the project root:

```bash
npm install
```

## Running Applications

Run a specific application:

**Login:**

```bash
cd formengine && npm run dev-login
cd rjsf && npm run dev-login
cd survey && npm run dev-login
cd vueform && npm run dev-login
```

**Login MUI:**

```bash
cd formengine && npm run dev-login-mui
cd rjsf && npm run dev-login-mui
cd survey && npm run dev-login-mui
cd vueform && npm run dev-login-mui
```

**Booking:**

```bash
cd formengine && npm run dev-booking
cd rjsf && npm run dev-booking
cd survey && npm run dev-booking
cd vueform && npm run dev-booking
```

**Booking MUI:**

```bash
cd formengine && npm run dev-booking-mui
cd rjsf && npm run dev-booking-mui
cd survey && npm run dev-booking-mui
cd vueform && npm run dev-booking-mui
```

## Building

Build a specific application variant:

```bash
APP_INPUT=login npm run build
```

## Bundle Size Analysis

To generate an overall report, run the following command.  
The `APP_INPUT` variable is not required here—it will be set automatically for all variants.  
All builds will be executed before generating the report.

```bash
npm run report
```

The resulting report will be available at:

```
.bundle-stats/bundle-sizes-report.html
```

Each build variant will also be available in its corresponding folder under the `.bundle-stats` directory.
