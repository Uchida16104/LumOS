# LumOS

An OS that can be run in a browser derived from [Lumos Language](https://github.com/Uchida16104/Lumos-Language).

## Architecture

```mermaid
graph TD
    User((User / Browser)) -->|HTTPS| Vercel[Vercel Frontend]

    subgraph LumOS_Frontend_Vercel
        Desktop[Desktop UI]
        WindowManager[Window Manager]
        Terminal[Web Terminal]
        FileSystem[Virtual File System]

        Desktop --> WindowManager
        WindowManager --> Terminal
        WindowManager --> FileSystem
    end

    Vercel -->|API Requests| Render[Render Backend]

    subgraph LumOS_Backend_Render
        RustCore[Rust Core - Actix Web]

        subgraph Polyglot_Runtime_Container
            Python[Python - FastAPI]
            Laravel[PHP - Laravel]
            CSharp[CSharp Runner]
            Legacy[COBOL / Fortran / ALGOL]
            Modern[Go / Swift / Kotlin]

            RustCore -->|Exec or FFI| Python
            RustCore -->|Exec| Laravel
            RustCore -->|Exec| CSharp
            RustCore -->|Exec| Legacy
            RustCore -->|Exec| Modern
        end
    end

    RustCore -->|SQL| Supabase[(Supabase PostgreSQL)]
    Python -->|Data Analysis| Supabase
```

---

## Project Setup Guide & Complete Code

### File Structure and Directory Layout

This structure functions as a single repository (Monorepo).

```text
lumos-os/
├── .gitignore
├── README.md
├── vercel.json              # Vercel configuration
├── render.yaml              # Render configuration
├── package.json             # Frontend dependencies
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.mjs
├── next.config.mjs
├── public/
│   └── icons/               # Icon resources
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Loads HTMX, Alpine, etc.
│   │   ├── globals.css      # Tailwind Import
│   │   └── page.tsx         # LumOS desktop core
│   └── lib/
│       └── utils.ts
├── backend/                 # Render root directory
│   ├── Cargo.toml           # Rust dependencies
│   ├── src/
│   │   └── main.rs          # Rust server entry point
│   └── runtimes/            # Storage for each language's runtime scripts
│       ├── python/
│       ├── cobol/
│       └── ...
└── .env.example

```
