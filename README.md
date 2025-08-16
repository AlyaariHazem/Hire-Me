# HireMe

Interactive recruitment platform built with **Angular 20**. Employers can post and browse jobs, view details, and manage sessions through a responsive UI.

**Live:** https://alyaarihazem.github.io/Hire-Me/  
**Repo:** https://github.com/AlyaariHazem/Hire-Me  
**License:** MIT

---

## Table of Contents
- [Features](#features)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Environment Config](#environment-config)
- [Getting Started](#getting-started)
- [HTTP & Interceptors](#http--interceptors)
- [Theming & UI](#theming--ui)
- [Build](#build)
- [Deploy to GitHub Pages](#deploy-to-github-pages)
- [NPM Scripts](#npm-scripts)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [Roadmap](#roadmap)
- [License](#license)

---

## Features
- Angular 20 **standalone** app with **zoneless** change detection.
- Router-based navigation (Home, Jobs, Job Details, Messages, etc.).
- **PrimeNG** components (Aura preset) + **ngx-toastr** notifications.
- **Auth token interceptor** and logout flow.
- Responsive layout, lazy assets, and simple state via RxJS streams.

---

## Architecture
- **Standalone bootstrap** using `ApplicationConfig` providers.
- **Routing** via `provideRouter(routes)`.
- **HTTP** via `provideHttpClient(withInterceptorsFromDi())`.
- **Auth**: Token read from `localStorage`; interceptor attaches `Authorization` header.
- **Services** return cold observables and share via `shareReplay(1)` when needed.
- **Shared module** exposes common UI and utilities for non-standalone components.

---

## Project Structure
